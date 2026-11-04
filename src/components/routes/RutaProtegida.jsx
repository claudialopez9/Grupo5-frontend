import { Navigate } from 'react-router-dom'

// Muestra la página solo si hay alguien logueado con el rol pedido
function RutaProtegida({ usuario, rol, children }) {
  if (!usuario) {
    return <Navigate to="/ingresar" replace />
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida
