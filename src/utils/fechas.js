// '2026-09-28' -> '28/09/2026'
export function formatearFecha(fecha) {
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

// Un préstamo está vencido si figura así o si ya pasó la fecha y no se devolvió
export function estaVencido(prestamo) {
  if (prestamo.estado === 'Devuelto') return false
  return prestamo.estado === 'Vencido' || diasHasta(prestamo.fechaDevolucion) < 0
}

// Texto corto para mostrar debajo del estado
export function detalleEstado(prestamo) {
  if (prestamo.estado === 'Devuelto') return ''
  const dias = diasHasta(prestamo.fechaDevolucion)
  if (estaVencido(prestamo)) {
    const demora = Math.abs(dias)
    return demora === 1 ? '1 día de demora' : `${demora} días de demora`
  }
  if (dias === 0) return 'Vence hoy'
  if (dias === 1) return 'Vence mañana'
  return `Vence en ${dias} días`
}