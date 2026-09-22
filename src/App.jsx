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
import { useRevelar } from './hooks/useRevelar'
import './styles/zyntello.css'
import './styles/Secciones.css'

function App() {
  useRevelar()

  return (
    <>
      {/* Primer elemento enfocable de la página: sin esto, quien navega con
          teclado tiene que recorrer todo el menú en cada visita. */}
      <a href="#inicio" className="zy-saltar">Saltar al contenido</a>

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
    </>
  )
}

export default App
