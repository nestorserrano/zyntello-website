# Patrones de prueba — Zyntello (Laravel / PHPUnit)

> Lo cita `test-driven-development`. ⚠️ La skill upstream remite aquí para «patrones de Jest, React
> Testing Library, Supertest y Playwright». **Este proyecto no es JS/TS**: es Laravel con PHPUnit,
> Blade y Livewire. Los principios de la skill (rojo → verde → refactor) valen; **los ejemplos de
> allí, no**. Lo que sigue los sustituye.

## Cómo se ejecuta la suite aquí

```bash
# Desde app/zyntello-app. phpunit.xml ya fija DB_PORT=3308 y DB_DATABASE=zyntello_app_testing.
php artisan test
```

- ⚠️ Si el MySQL local tiene contraseña de root, **toda** la suite falla con un **1045** porque
  `phpunit.xml` declara `DB_PASSWORD` vacío. Se arregla con el override en la llamada
  (`DB_PASSWORD=... php artisan test`), **no editando `phpunit.xml`**.
- ⚠️ La suite se corre **por tandas** (~19). La corrida única se queda sin memoria y muere, y esa
  muerte se parece mucho a un fallo de las pruebas.
- ⚠️ **Nunca `migrate:fresh` sobre la base de testing** si hay datos sembrados de los que dependen
  otras pruebas.

## La prueba de aislamiento: DOS suscriptores y DOS empresas

Es el patrón que más veces se ha hecho mal, y el defecto no se ve: **una prueba de un solo tenant
pasa en verde aunque el cruce exista**, porque no hay un segundo dato con el que cruzarse.

```php
public function test_no_se_ven_los_articulos_de_la_otra_empresa(): void
{
    [$companyA, $empresaA1, $empresaA2] = $this->sembrarSuscriptorConDosEmpresas();
    [$companyB, $empresaB1]             = $this->sembrarSuscriptorConDosEmpresas();

    $propio = Articulo::factory()->create(['company_id' => $companyA->id, 'empresa_id' => $empresaA1->id]);
    $hermano = Articulo::factory()->create(['company_id' => $companyA->id, 'empresa_id' => $empresaA2->id]);
    $ajeno  = Articulo::factory()->create(['company_id' => $companyB->id, 'empresa_id' => $empresaB1->id]);

    $this->actuandoEn($companyA, $empresaA1);

    $ids = Articulo::pluck('id');

    $this->assertTrue($ids->contains($propio->id),   'El artículo de la empresa activa debe verse.');
    $this->assertFalse($ids->contains($hermano->id), 'Se coló un artículo de OTRA empresa del mismo suscriptor.');
    $this->assertFalse($ids->contains($ajeno->id),   'Se coló un artículo de OTRO suscriptor.');
}
```

Las tres aserciones importan. La del **hermano** es la que casi nunca está, y es la que detecta el
fallo más frecuente: reponer solo `company_id` después de un `sinScopeEmpresa()`.

## Verificar la guarda AL REVÉS

Una guarda que nunca ha fallado no ha demostrado nada. Antes de darla por buena: **quítale el
filtro al código que vigila y comprueba que la prueba se pone roja.** Si sigue verde, la prueba no
mide lo que crees.

- ⚠️⚠️ **Un verificador contra datos sembrados no verifica.** Un número que no se mueve cuando
  arreglas cosas no te está midiendo.
- ⚠️⚠️ **Una guarda cuyo sujeto se agota pasa verde sin comprobar nada** — si el bucle recorre una
  colección vacía, no hay nada que fallar. Afirma primero que el sujeto **no** está vacío. Un
  `catch (\Throwable)` la ciega igual de bien.
- ⚠️ Buscar por **forma** (un grep de patrones) no falla: **da un número, y el número convence**.
  Mide el **efecto**, no la forma.

## Guardas estructurales

Toda consulta con `sinScopeEmpresa()` necesita una prueba que **falle si alguien vuelve a filtrar
solo por `company_id`**. Lo que se detecta leyendo el código a mano se degrada; lo que se convierte
en prueba, no.

Lo mismo para lo que no tiene síntoma: rutas duplicadas, claves repetidas en un `config`, pantallas
sin `@section('ayudaClave')`. ⚠️ Esas guardas leen **el fichero**, no `config()` ni `getRoutes()`:
para cuando Laravel los ha cargado, el duplicado ya se comió a su gemelo y no queda rastro.

## Trampas medidas en este proyecto

- ⚠️⚠️ **Una prueba que LEE un seeder no lo prueba.** `demo:reset` estuvo roto con la suite en
  verde. Hay que **ejecutarlo** y medir el resultado.
- ⚠️⚠️ **`Livewire::test` devuelve el menú VACÍO**, y dos listas vacías coinciden perfectamente.
  La comparación útil es estructural.
- ⚠️ **Pruebas HTTP**: un `APP_URL` con subcarpeta da 404, y sin onboarding se van en 302 — la
  guarda pasa **sin sujeto**. Una verificación HTTP mira el **contenido**: un login fallido también
  responde 200. Incluye siempre un control que **debe** fallar.
- ⚠️ **La base de pruebas no acumula**: no dependas de residuos de una tanda anterior.
- ⚠️ **Una propiedad estática en un trait no se comparte**: hay una por clase que lo usa, y
  `Trait::limpiar()` no limpia ninguna.
- ⚠️ **Fuera de la web `HasEmpresa` no rellena** `company_id`/`empresa_id`. Una prueba que corre en
  CLI puede pasar por casualidad y la web fallar, o al revés.
- ⚠️ Las tablas de prueba tienen que ser **InnoDB**: en MyISAM no revierte ni bloquea, así que
  `RefreshDatabase` deja basura.

## Nombres y mensajes

En español, y el mensaje de la aserción dice **qué se rompió en el negocio**, no qué comparación
falló: `'Se coló un artículo de OTRO suscriptor.'`, no `'Failed asserting that false is true.'`
