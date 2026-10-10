function aTextoFecha(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Fecha de hoy en formato 'AAAA-MM-DD'
export function fechaHoy() {
  return aTextoFecha(new Date())
}

// Suma días a una fecha 'AAAA-MM-DD' y devuelve otra en el mismo formato
export function sumarDias(fecha, cantidad) {
  const resultado = new Date(`${fecha}T00:00:00`)
  resultado.setDate(resultado.getDate() + cantidad)
  return aTextoFecha(resultado)
}

// '2026-09-28' -> '28/09/2026'. Si no hay fecha (por ejemplo, una solicitud sin retirar), muestra una raya
export function formatearFecha(fecha) {
  if (!fecha) return '—'
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

// Días que faltan hasta una fecha (negativo si ya pasó)
export function diasHasta(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const destino = new Date(`${fecha}T00:00:00`)
  return Math.round((destino - hoy) / (1000 * 60 * 60 * 24))
}

// El alumno tiene el libro en su poder: ya lo retiró y todavía no lo devolvió
export function estaEnPoder(prestamo) {
  return prestamo.estado === 'Activo' || prestamo.estado === 'Vencido'
}

// Vencido: lo tiene el alumno y ya pasó la fecha de devolución
export function estaVencido(prestamo) {
  if (!estaEnPoder(prestamo)) return false
  return prestamo.estado === 'Vencido' || diasHasta(prestamo.fechaDevolucion) < 0
}

// Estado real: un préstamo "Activo" cuya fecha ya pasó se muestra como "Vencido"
export function estadoActual(prestamo) {
  return estaVencido(prestamo) ? 'Vencido' : prestamo.estado
}

// Texto corto para mostrar debajo del estado
export function detalleEstado(prestamo) {
  if (prestamo.estado === 'Devuelto') return ''
  if (prestamo.estado === 'Pendiente') return 'Listo para retirar en la biblioteca'
  const dias = diasHasta(prestamo.fechaDevolucion)
  if (estaVencido(prestamo)) {
    const demora = Math.abs(dias)
    return demora === 1 ? '1 día de demora' : `${demora} días de demora`
  }
  if (dias === 0) return 'Vence hoy'
  if (dias === 1) return 'Vence mañana'
  return `Vence en ${dias} días`
}
