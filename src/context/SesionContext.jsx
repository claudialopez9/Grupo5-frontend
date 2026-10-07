import { createContext, useContext, useState } from 'react'
import { useDatos } from './DatosContext'

const SesionContext = createContext(null)
const CLAVE_SESION = 'bibliofrt-sesion'

function leerSesionGuardada() {
  const guardada = localStorage.getItem(CLAVE_SESION)
  return guardada ? JSON.parse(guardada) : null
}

// Arma los datos que guardamos de la persona que ingresó
function armarSesion(usuario, alumno) {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    rol: usuario.rol,
    alumnoId: usuario.alumnoId,
    nombre: alumno ? alumno.nombre : 'Bibliotecario',
  }
}

export function SesionProvider({ children }) {
  const { usuarios, alumnos, agregarRegistro } = useDatos()
  const [usuario, setUsuario] = useState(leerSesionGuardada)

  function guardarSesion(sesion) {
    setUsuario(sesion)
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  }

  // Devuelve la sesión si los datos coinciden, o null si no
  function ingresar(nombreUsuario, password) {
    const encontrado = usuarios.find(
      (u) => u.usuario === nombreUsuario.trim() && u.password === password
    )
    if (!encontrado) return null

    const alumno = alumnos.find((a) => a.id === encontrado.alumnoId)
    const sesion = armarSesion(encontrado, alumno)
    guardarSesion(sesion)
    return sesion
  }

  function salir() {
    setUsuario(null)
    localStorage.removeItem(CLAVE_SESION)
  }

  function registrarse(datos) {
    const yaExiste = usuarios.some((u) => u.usuario === datos.legajo)
    if (yaExiste) {
      return { ok: false, mensaje: 'Ya existe una cuenta con ese legajo. Probá ingresar.' }
    }
    const { nuevoAlumno, nuevoUsuario } = agregarRegistro(datos)
    const sesion = armarSesion(nuevoUsuario, nuevoAlumno)
    guardarSesion(sesion)
    return { ok: true, sesion }
  }

  return (
    <SesionContext.Provider value={{ usuario, ingresar, salir, registrarse }}>
      {children}
    </SesionContext.Provider>
  )
}

export function useSesion() {
  return useContext(SesionContext)
}