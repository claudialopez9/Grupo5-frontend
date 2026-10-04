import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Alumnos from './pages/Alumnos'
import Prestamos from './pages/Prestamos'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <AppNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
