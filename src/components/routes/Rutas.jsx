import { Routes, Route } from 'react-router-dom'
import RutaProtegida from './RutaProtegida'
import Inicio from '../../pages/Inicio'
import Catalogo from '../../pages/Catalogo'
import LibroDetalle from '../../pages/LibroDetalle'
import Alumnos from '../../pages/Alumnos'
import Prestamos from '../../pages/Prestamos'
import SobreNosotros from '../../pages/SobreNosotros'
import Ingresar from '../../pages/Ingresar'
import Registrarse from '../../pages/Registrarse'
import Panel from '../../pages/Panel'
import MiBiblioteca from '../../pages/MiBiblioteca'
import NotFound from '../../pages/NotFound'

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/catalogo/:id" element={<LibroDetalle />} />
      <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      <Route path="/ingresar" element={<Ingresar />} />
      <Route path="/registrarse" element={<Registrarse />} />

      <Route path="/panel" element={<RutaProtegida rol="bibliotecario"><Panel /></RutaProtegida>} />
      <Route path="/prestamos" element={<RutaProtegida rol="bibliotecario"><Prestamos /></RutaProtegida>} />
      <Route path="/alumnos" element={<RutaProtegida rol="bibliotecario"><Alumnos /></RutaProtegida>} />

      <Route path="/mi-biblioteca" element={<RutaProtegida rol="alumno"><MiBiblioteca /></RutaProtegida>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Rutas