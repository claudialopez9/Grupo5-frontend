// Lectura y guardado en localStorage (los datos quedan en este navegador hasta que haya backend)

export const CLAVE_REGISTROS = 'bibliofrt-registros'
export const CLAVE_PRESTAMOS = 'bibliofrt-prestamos'
export const CLAVE_LIBROS = 'bibliofrt-libros'
export const CLAVE_SESION = 'bibliofrt-sesion'

// Lee algo guardado, o devuelve null si no hay nada
export function leerGuardado(clave) {
  const guardado = localStorage.getItem(clave)
  return guardado ? JSON.parse(guardado) : null
}

// Guarda cualquier dato convertido a texto
export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor))
}

export function borrar(clave) {
  localStorage.removeItem(clave)
}

// Alumnos y usuarios que se registraron desde la página
export function leerRegistros() {
  return leerGuardado(CLAVE_REGISTROS) ?? { alumnos: [], usuarios: [] }
}
