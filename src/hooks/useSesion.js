import { useContext } from 'react'
import { SesionContext } from '../context/SesionContext'

// Hook para saber quién ingresó y usar las funciones de ingreso, registro y salida
function useSesion() {
  return useContext(SesionContext)
}

export default useSesion
