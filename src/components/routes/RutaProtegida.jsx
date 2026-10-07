import { Navigate } from 'react-router-dom'
import { useSesion } from '../../context/SesionContext'


function RutaProtegida({ rol, children }) {
  const { usuario } = useSesion()

  if (!usuario) {
    return <Navigate to="/ingresar" replace />
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida
