import { useState } from 'react'
import { Container, Table, Badge, Button } from 'react-bootstrap'
import { useDatos } from '../context/DatosContext'
import { coloresCategoria } from '../data/categorias'
import { formatearFecha, detalleEstado, estadoActual } from '../utils/fechas'
import useSEO from '../hooks/useSEO'

const estilosEstado = {
  Pendiente: { bg: 'warning-subtle', text: 'warning-emphasis' },
  Activo: { bg: 'primary-subtle', text: 'primary-emphasis' },
  Vencido: { bg: 'danger-subtle', text: 'danger-emphasis' },
  Devuelto: { bg: 'secondary-subtle', text: 'secondary-emphasis' },
}

const filtros = ['Todos', 'Pendiente', 'Activo', 'Vencido', 'Devuelto']
const nombresFiltro = {
  Todos: 'Todos',
  Pendiente: 'Para retirar',
  Activo: 'Activos',
  Vencido: 'Vencidos',
  Devuelto: 'Devueltos',
}

function Prestamos() {
  useSEO('Préstamos', 'Seguimiento de solicitudes, préstamos activos, vencidos y devoluciones de la biblioteca de la UTN.')

  const { prestamos, alumnos, libros } = useDatos()
  const [filtro, setFiltro] = useState('Todos')

  function buscarLibro(id) {
    return libros.find((libro) => libro.id === id)
  }

  function nombreAlumno(id) {
    const alumno = alumnos.find((a) => a.id === id)
    return alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno no encontrado'
  }

  const lista = filtro === 'Todos' ? prestamos : prestamos.filter((p) => estadoActual(p) === filtro)

  function contar(estado) {
    return estado === 'Todos' ? prestamos.length : prestamos.filter((p) => estadoActual(p) === estado).length
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <h1 className="titulo-principal mb-3">Préstamos</h1>
          <p className="lead mb-4">Seguí las solicitudes, los préstamos activos, los vencidos y las devoluciones.</p>
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
                  const libro = buscarLibro(p.libroId)
                  const estado = estadoActual(p)
                  const detalle = detalleEstado(p)
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <span
                            className="lomo-mini"
                            style={{ backgroundColor: coloresCategoria[libro?.categoria] || '#3A3C42' }}
                            aria-hidden="true"
                          ></span>
                          <span className="fw-semibold">{libro ? libro.titulo : 'Libro no encontrado'}</span>
                        </div>
                      </td>
                      <td>{nombreAlumno(p.alumnoId)}</td>
                      <td>{formatearFecha(p.fechaPrestamo)}</td>
                      <td>{formatearFecha(p.fechaDevolucion)}</td>
                      <td>
                        <div className="d-flex flex-column align-items-start gap-1">
                          <Badge pill bg={estilosEstado[estado].bg} text={estilosEstado[estado].text}>
                            {estado}
                          </Badge>
                          {detalle && (
                            <span className={`small ${estado === 'Vencido' ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
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
