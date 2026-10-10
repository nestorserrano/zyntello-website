import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Servicios from './components/Servicios'
import Soluciones from './components/Soluciones'
import Funcionalidades from './components/Funcionalidades'
import PorQueZyntello from './components/PorQueZyntello'
import Portafolio from './components/Portafolio'
import Nosotros from './components/Nosotros'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppChat from './components/WhatsAppChat'
import AvisoCookies from './components/AvisoCookies'
import { ProveedorIdioma, useIdioma } from './hooks/useIdioma'
import { useRevelar } from './hooks/useRevelar'
import './styles/zyntello.css'
import './styles/Secciones.css'
import './styles/financial-ui.css'
import './styles/AvisoCookies.css'
import './styles/SelectorIdioma.css'

/**
 * Primer elemento enfocable de la página: sin esto, quien navega con teclado
 * tiene que recorrer todo el menú en cada visita.
 *
 * ⚠️ Es un componente aparte y no una línea dentro de `App` porque `useIdioma()`
 * no funciona en el mismo componente que monta el proveedor — el contexto aún
 * no existe ahí. Y tiene que traducirse por el mismo motivo que los
 * `aria-label`: no se ve, lo lee un lector de pantalla, y en español para quien
 * navega en chino es la única instrucción que no puede entender ni adivinar.
 */
function SaltarAlContenido() {
  const { t } = useIdioma()
  return <a href="#inicio" className="zy-saltar">{t('a11y.saltar', 'Saltar al contenido')}</a>
}

function App() {
  useRevelar()

  return (
    /* ⚠️ El proveedor envuelve TODO: el aviso de cookies y el pie también se traducen, y si
       quedaran fuera `useIdioma()` lanzaría y tumbaría la página entera. */
    <ProveedorIdioma>
      <SaltarAlContenido />

      <Navbar />
      <main>
        <Hero />
        <Servicios />
        <Soluciones />
        <Funcionalidades />
        <PorQueZyntello />
        <Portafolio />
        <Nosotros />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppChat />
      <AvisoCookies />
    </ProveedorIdioma>
  )
}

export default App
