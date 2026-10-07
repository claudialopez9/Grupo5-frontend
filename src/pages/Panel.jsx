import { Container, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useDatos } from '../context/DatosContext'
import { useSesion } from '../context/SesionContext'
import { coloresCategoria } from '../data/categorias'
import { formatearFecha, diasHasta, estaVencido, detalleEstado } from '../utils/fechas'
import useSEO from '../hooks/useSEO'


function FilaPrestamo({ prestamo, libro, alumno, onDevolver }) {
  const vencido = estaVencido(prestamo)

  return (
    <li className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 py-3 border-bottom">
      <div className="d-flex align-items-center gap-3 flex-grow-1">
        <span
          className="lomo-mini"
          style={{ backgroundColor: coloresCategoria[libro?.categoria] || '#3A3C42' }}
          aria-hidden="true"
        ></span>
        <div>
          <p className="fw-semibold mb-0">{libro ? libro.titulo : 'Libro no encontrado'}</p>
          <p className="small text-body-secondary mb-0">
            {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno no encontrado'}, devuelve el {formatearFecha(prestamo.fechaDevolucion)}
          </p>
          <p className={`small mb-0 ${vencido ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
            {detalleEstado(prestamo)}
          </p>
        </div>
      </div>
      <Button variant="outline-dark" size="sm" className="flex-shrink-0" onClick={() => onDevolver(prestamo)}>
        Registrar devolución
      </Button>
    </li>
  )
}

function Panel() {
  useSEO('Panel', 'Resumen diario de préstamos, vencimientos y disponibilidad de la biblioteca de la UTN.')

  const { prestamos, libros, alumnos, registrarDevolucion } = useDatos()
  const { usuario } = useSesion()

  const buscarLibro = (id) => libros.find((libro) => libro.id === id)
  const buscarAlumno = (id) => alumnos.find((alumno) => alumno.id === id)

  
  const sinDevolver = prestamos.filter((p) => p.estado !== 'Devuelto')
  const vencidos = sinDevolver.filter((p) => estaVencido(p))
  const vencenPronto = sinDevolver.filter((p) => !estaVencido(p) && diasHasta(p.fechaDevolucion) <= 7)
  const ejemplaresDisponibles = libros.reduce((total, libro) => total + libro.disponibles, 0)
  const alumnosConLibros = new Set(sinDevolver.map((p) => p.alumnoId)).size

  const resumen = [
    { id: 'sin-devolver', numero: sinDevolver.length, texto: 'préstamos sin devolver' },
    { id: 'vencidos', numero: vencidos.length, texto: 'préstamos vencidos', alerta: vencidos.length > 0 },
    { id: 'disponibles', numero: ejemplaresDisponibles, texto: 'ejemplares disponibles' },
    { id: 'alumnos', numero: alumnosConLibros, texto: 'alumnos con libros en su poder' },
  ]

  
  const masPedidos = libros
    .map((libro) => ({ ...libro, veces: prestamos.filter((p) => p.libroId === libro.id).length }))
    .filter((libro) => libro.veces > 0)
    .sort((a, b) => b.veces - a.veces)
    .slice(0, 5)

  function manejarDevolucion(prestamo) {
    const libro = buscarLibro(prestamo.libroId)

    Swal.fire({
      icon: 'question',
      title: '¿Registrar la devolución?',
      text: `"${libro ? libro.titulo : 'El libro'}" va a quedar como devuelto y disponible para otro préstamo.`,
      showCancelButton: true,
      confirmButtonText: 'Registrar devolución',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1F2125',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        registrarDevolucion(prestamo.id)
        Swal.fire({ icon: 'success', title: 'Devolución registrada', timer: 1600, showConfirmButton: false })
      }
    })
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <h1 className="titulo-principal mb-3">Panel de la biblioteca</h1>
          <p className="lead mb-0">Hola, {usuario.nombre}. Esto es lo que necesita atención hoy.</p>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        <section aria-label="Resumen" className="mb-5">
          <Row className="g-3">
            {resumen.map((dato) => (
              <Col key={dato.id} xs={6} lg={3}>
                <article className="border rounded-3 p-3 h-100 bg-white">
                  <p className={`numero-panel mb-1 ${dato.alerta ? 'text-danger' : ''}`}>{dato.numero}</p>
                  <p className="text-body-secondary mb-0">{dato.texto}</p>
                </article>
              </Col>
            ))}
          </Row>
        </section>

        <Row className="g-5">
          <Col lg={7}>
            <section className="mb-5" aria-labelledby="titulo-vencidos">
              <h2 id="titulo-vencidos" className="fs-4 fw-bold mb-2">Vencidos</h2>
              {vencidos.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {vencidos.map((p) => (
                    <FilaPrestamo
                      key={p.id}
                      prestamo={p}
                      libro={buscarLibro(p.libroId)}
                      alumno={buscarAlumno(p.alumnoId)}
                      onDevolver={manejarDevolucion}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-body-secondary">No hay préstamos vencidos.</p>
              )}
            </section>

            <section aria-labelledby="titulo-pronto">
              <h2 id="titulo-pronto" className="fs-4 fw-bold mb-2">Vencen en los próximos 7 días</h2>
              {vencenPronto.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {vencenPronto.map((p) => (
                    <FilaPrestamo
                      key={p.id}
                      prestamo={p}
                      libro={buscarLibro(p.libroId)}
                      alumno={buscarAlumno(p.alumnoId)}
                      onDevolver={manejarDevolucion}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-body-secondary">Ningún préstamo vence esta semana.</p>
              )}
            </section>
          </Col>

          <Col lg={5}>
            <section aria-labelledby="titulo-ranking">
              <h2 id="titulo-ranking" className="fs-4 fw-bold mb-2">Libros más pedidos</h2>
              <ol className="list-unstyled mb-0">
                {masPedidos.map((libro, i) => (
                  <li key={libro.id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                    <span className="fw-bold text-body-secondary">{i + 1}</span>
                    <span
                      className="lomo-mini"
                      style={{ backgroundColor: coloresCategoria[libro.categoria] || '#3A3C42' }}
                      aria-hidden="true"
                    ></span>
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{libro.titulo}</p>
                      <p className="small text-body-secondary mb-0">{libro.autor}</p>
                    </div>
                    <span className="small fw-semibold text-nowrap">
                      {libro.veces} {libro.veces === 1 ? 'préstamo' : 'préstamos'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Panel
