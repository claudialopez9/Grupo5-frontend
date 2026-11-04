import { estaVencido } from './fechas'

// Reglas de la biblioteca
export const DIAS_DE_PRESTAMO = 14
export const DIAS_DE_RENOVACION = 7
export const MAXIMO_PRESTAMOS = 3

// Revisa si un alumno puede llevarse un libro.
// Devuelve el motivo si no se puede, o null si está todo bien
export function validarPrestamo(libros, prestamos, alumnoId, libroId) {
  const libro = libros.find((l) => l.id === libroId)
  if (!libro) return 'No encontramos ese libro.'
  if (libro.disponibles === 0) return 'No quedan ejemplares disponibles de este libro.'

  const delAlumno = prestamos.filter((p) => p.alumnoId === alumnoId && p.estado !== 'Devuelto')
  if (delAlumno.some((p) => estaVencido(p))) {
    return 'Hay un préstamo vencido sin devolver. Hasta que se devuelva no se pueden pedir otros libros.'
  }
  if (delAlumno.length >= MAXIMO_PRESTAMOS) {
    return `Se llegó al máximo de ${MAXIMO_PRESTAMOS} libros al mismo tiempo.`
  }
  if (delAlumno.some((p) => p.libroId === libroId)) {
    return 'Este libro ya está pedido o prestado a este alumno.'
  }
  return null
}

// Arma los datos que guardamos de la persona que ingresó
export function armarSesion(usuario, alumno) {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    rol: usuario.rol,
    alumnoId: usuario.alumnoId,
    nombre: alumno ? alumno.nombre : 'Bibliotecario',
  }
}
