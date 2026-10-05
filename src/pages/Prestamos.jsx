import { useState } from 'react'
import { Container, Table, Badge, Button } from 'react-bootstrap'
import { prestamos } from '../data/prestamos'
import { libros } from '../data/libros'
import { coloresCategoria } from '../data/categorias'
import useSEO from '../hooks/useSEO'

const estilosEstado = {
  Activo: { bg: 'primary-subtle', text: 'primary-emphasis' },
  Vencido: { bg: 'danger-subtle', text: 'danger-emphasis' },
  Devuelto: { bg: 'secondary-subtle', text: 'secondary-emphasis' },
}

const filtros = ['Todos', 'Activo', 'Vencido', 'Devuelto']
const nombresFiltro = { Todos: 'Todos', Activo: 'Activos', Vencido: 'Vencidos', Devuelto: 'Devueltos' }

// '2026-09-28' -> '28/09/2026'
function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

// Días que faltan hasta una fecha (negativo si ya pasó)
function diasHasta(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const destino = new Date(`${fecha}T00:00:00`)
  return Math.round((destino - hoy) / (1000 * 60 * 60 * 24))
}

function detalleEstado(prestamo) {
  if (prestamo.estado === 'Devuelto') return ''
  const dias = diasHasta(prestamo.fechaDevolucion)
  if (prestamo.estado === 'Vencido' || dias < 0) {
    const demora = Math.abs(dias)
    return demora === 1 ? '1 día de demora' : `${demora} días de demora`
  }
  if (dias === 0) return 'Vence hoy'
  if (dias === 1) return 'Vence mañana'
  return `Vence en ${dias} días`
}

function colorLibro(titulo) {
  const libro = libros.find((l) => l.titulo === titulo)
  return coloresCategoria[libro?.categoria] || '#3A3C42'
}

function Prestamos() {
  useSEO('Préstamos', 'Seguimiento de préstamos activos, vencidos y devoluciones de la biblioteca de la UTN.')

  const [filtro, setFiltro] = useState('Todos')

  const lista = filtro === 'Todos' ? prestamos : prestamos.filter((p) => p.estado === filtro)

  function contar(estado) {
    return estado === 'Todos' ? prestamos.length : prestamos.filter((p) => p.estado === estado).length
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <h1 className="titulo-principal mb-3">Préstamos</h1>
          <p className="lead mb-4">Seguí los préstamos activos, los vencidos y las devoluciones.</p>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
            {filtros.map((f) => (
              <Button
                key={f}
                variant={f === filtro ? 'dark' : 'outline-secondary'}
                className="rounded-pill px-3"
                aria-pressed={f === filtro}
                onClick={() => setFiltro(f)}
              >
                {nombresFiltro[f]} <span className="ms-1 opacity-75">{contar(f)}</span>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-4 mb-5">
        {lista.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="tabla-prestamos align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Libro</th>
                  <th scope="col">Alumno</th>
                  <th scope="col">Préstamo</th>
                  <th scope="col">Devolución prevista</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => {
                  const detalle = detalleEstado(p)
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <span className="lomo-mini" style={{ backgroundColor: colorLibro(p.libro) }} aria-hidden="true"></span>
                          <span className="fw-semibold">{p.libro}</span>
                        </div>
                      </td>
                      <td>{p.alumno}</td>
                      <td>{formatearFecha(p.fechaPrestamo)}</td>
                      <td>{formatearFecha(p.fechaDevolucion)}</td>
                      <td>
                        <div className="d-flex flex-column align-items-start gap-1">
                          <Badge pill bg={estilosEstado[p.estado].bg} text={estilosEstado[p.estado].text}>
                            {p.estado}
                          </Badge>
                          {detalle && (
                            <span className={`small ${p.estado === 'Vencido' ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
                              {detalle}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-body-secondary py-4">No hay préstamos en este estado.</p>
        )}
      </Container>
    </>
  )
}

export default Prestamos