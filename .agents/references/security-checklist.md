# Checklist de seguridad — Zyntello

> Lo citan `security-and-hardening`, `code-review-and-quality`, `shipping-and-launch` y
> `doubt-driven-development`. Complementa a `hardening-patterns.md` (patrones genéricos, del
> paquete upstream): **aquí está lo que es propio de este proyecto**, y es lo que manda.

## 0. Antes que nada: el aislamiento ES la superficie de ataque principal

En un SaaS multi-tenant el fallo de seguridad más probable no es una inyección: es **ver los datos
de otro suscriptor con un 200 y sin ningún error**. Todo lo demás de esta lista va después.

## 1. Autorización por petición

- [ ] `$empresa = empresa_activa(); $company = company(); abort_unless($empresa && $company, 403);`
      al inicio de **cada** acción.
- [ ] ⚠️ Y comprobar que **no se redefine `$company` dos líneas más abajo** con `currentCompany`,
      que puede ser `null`. Ese anti-patrón apareció en 10 métodos de un mismo archivo: el
      `abort_unless` está escrito y no protege nada.
- [ ] Para cuentas internas `company()` es `null` → usar `company_obligatoria()`.

## 2. Todo id que llega de fuera

- [ ] Un id del **request** o de la **URL** se resuelve **acotado por las dos dimensiones**. Sin
      eso, pegar el id de otra empresa en la URL abre —y deja **editar**— su ficha, y la pantalla
      no muestra nada raro.
- [ ] ⚠️⚠️ `Rule::exists` / `exists:tabla,id` comprueba que el id **exista**, no que sea **tuyo**.
      Para cualquier tabla con `company_id` va `DelTenant::existe()`. Ya se cerraron así 338 reglas
      en 119 controladores.
- [ ] Excepción: los catálogos de **plataforma** (`paises`, `monedas`, `tipos_nit`,
      `nits_oficiales`, `nom_posiciones_mt`, `puertos`) no se acotan. El criterio es **si la tabla
      tiene `company_id`**, no cómo se llame.

## 3. Consultas que apagan el scope

- [ ] Cada `sinScopeEmpresa()` repone **las dos** condiciones, desde un scope con nombre y fuente
      única. Filtrar solo `company_id` enseña las otras empresas del mismo suscriptor; no filtrar
      nada enseña los otros suscriptores.
- [ ] La reposición incluye el `orWhereNull('empresa_id')`, o los registros globales del tenant
      **desaparecen de todas las pantallas**.
- [ ] ⚠️⚠️ **En los reportes se salta a `DB::table` y ahí se pierde el scope.** La guarda protege
      el **acceso**, no la **consulta**: usar `->acotarTenant()`.
- [ ] ⚠️⚠️ **Fuera de la web el scope no está**: una API móvil sin sesión, un job, un cron o un
      comando CLI devuelven los datos de **todos** los suscriptores con un 200. Un método que
      recibe la empresa por parámetro no puede resolver sus datos con modelos que leen la sesión,
      **y sus relaciones tampoco**.

## 4. Datos y secretos

- [ ] ⚠️ El repo `zyntello-website` es **PÚBLICO**. Ninguna credencial, clave ni passphrase se
      escribe en un archivo versionado — y borrarla después **no la quita del historial**.
- [ ] Las contraseñas viven en el `.env` de cada entorno, que está en `.gitignore`.
- [ ] El `.env` de producción **no está en Git**: `git pull` directo, y si se usa `rsync`, siempre
      `--exclude='.env'`.
- [ ] Datos personales: solo lo que la pantalla necesita. Lo que se registre en log, sin PII.

## 5. Entrada no confiable

- [ ] Validación en el servidor siempre; la del navegador es comodidad, no defensa.
- [ ] Eloquent / query builder con parámetros. Nada de concatenar SQL con entrada del usuario.
- [ ] Blade escapa con `{{ }}`; `{!! !!}` solo sobre contenido que el propio sistema generó.
- [ ] Subidas: extensión y tipo comprobados en servidor, fuera del document root o servidas por
      un controlador que **también** comprueba el tenant.

## 6. Sesión y acceso

- [ ] El mismo correo en dos apps del ecosistema son **dos cuentas distintas**.
- [ ] Verificar y consumir un código 2FA son **un solo acto**, o no hay anti-reuso.
- [ ] Tragarse la `AuthenticationException` anula `redirectGuestsTo`.

## 7. Antes de firmar

- [ ] ¿Hay una prueba con **dos suscriptores y dos empresas** que falle si se quita el filtro?
- [ ] ¿Cada `sinScopeEmpresa()` nuevo tiene su **guarda estructural**? Lo que se detecta leyendo el
      código a mano se degrada; lo que se convierte en prueba, no.
- [ ] ¿Se **midió** que no queden filas con `empresa_id` NULL que deberían tenerlo? El scope es
      **laxo con el NULL**: una fila huérfana se ve desde todas las empresas del tenant.
