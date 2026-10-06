import { Routes, Route } from 'react-router-dom'
import Inicio from '../../pages/Inicio'
import Catalogo from '../../pages/Catalogo'
import Alumnos from '../../pages/Alumnos'
import Prestamos from '../../pages/Prestamos'
import SobreNosotros from '../../pages/SobreNosotros'
import NotFound from '../../pages/NotFound'

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/alumnos" element={<Alumnos />} />
      <Route path="/prestamos" element={<Prestamos />} />
      <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Rutas
