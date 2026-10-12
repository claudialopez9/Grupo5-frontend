import { useContext } from 'react'
import { DatosContext } from '../context/DatosContext'

// Hook para usar los datos de la biblioteca desde cualquier componente
function useDatos() {
  return useContext(DatosContext)
}

export default useDatos
