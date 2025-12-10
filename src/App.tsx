import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Directiva from './pages/Directiva'
import QuienesSomos from './pages/QuienesSomos'
import Transparencia from './pages/Transparencia'
import Representacion from './pages/Representacion'
import Archivo from './pages/Archivo'
import Contacto from './pages/Contacto'
import Privacidad from './pages/Privacidad'
import Actas from './pages/Actas'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/directiva" element={<Directiva />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/actas" element={<Actas />} />
        <Route path="/representacion" element={<Representacion />} />
        <Route path="/archivo" element={<Archivo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>
    </Layout>
  )
}

export default App
