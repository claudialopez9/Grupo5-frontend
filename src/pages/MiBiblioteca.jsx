import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AlumnosCard from '../components/AlumnosCard'
import { useDatos } from '../context/DatosContext'
import { useSesion } from '../context/SesionContext'
import { coloresCategoria } from '../data/categorias'
import { formatearFecha, estaVencido, detalleEstado } from '../utils/fechas'
import useSEO from '../hooks/useSEO'

function MiBiblioteca() {
  useSEO('Mi biblioteca', 'Tus préstamos, fechas de devolución e historial en la biblioteca de la UTN.')

  const { usuario } = useSesion()
  const { alumnos, prestamos, libros } = useDatos()

  // Datos del alumno que ingresó
  const alumno = alumnos.find((a) => a.id === usuario.alumnoId)

  // Sus préstamos, separados por estado
  const misPrestamos = prestamos.filter((p) => p.alumnoId === usuario.alumnoId)
  const activos = misPrestamos.filter((p) => p.estado !== 'Devuelto')
  const devueltos = misPrestamos.filter((p) => p.estado === 'Devuelto')
  const vencidos = activos.filter((p) => estaVencido(p))

  function buscarLibro(id) {
    return libros.find((libro) => libro.id === id)
  }

  if (!alumno) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No encontramos tus datos de alumno. Cerrá sesión y volvé a ingresar.</Alert>
      </Container>
    )
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <h1 className="titulo-principal mb-3">Mi biblioteca</h1>
              <p className="lead mb-0">
                Hola, {alumno.nombre}. Acá ves los libros que tenés y cuándo tenés que devolverlos.
              </p>
            </Col>
            <Col lg={5}>
              <AlumnosCard
                nombre={alumno.nombre}
                apellido={alumno.apellido}
                legajo={alumno.legajo}
                carrera={alumno.carrera}
                prestamosActivos={activos.length}
              />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        {vencidos.length > 0 && (
          <Alert variant="danger" className="mb-5">
            <Alert.Heading as="h2" className="fs-5 fw-bold">
              {vencidos.length === 1 ? 'Tenés un préstamo vencido' : `Tenés ${vencidos.length} préstamos vencidos`}
            </Alert.Heading>
            <p className="mb-0">Acercate a la biblioteca para devolverlo lo antes posible.</p>
          </Alert>
        )}

        <section className="mb-5" aria-labelledby="titulo-mis-libros">
          <h2 id="titulo-mis-libros" className="fs-3 fw-bold mb-3">Libros que tengo</h2>
          {activos.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {activos.map((p) => {
                const libro = buscarLibro(p.libroId)
                const vencido = estaVencido(p)
                return (
                  <li key={p.id} className="d-flex flex-wrap align-items-center gap-3 py-3 border-bottom">
                    <span
                      className="lomo-mini"
                      style={{ backgroundColor: coloresCategoria[libro?.categoria] || '#3A3C42' }}
                      aria-hidden="true"
                    ></span>
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{libro ? libro.titulo : 'Libro no encontrado'}</p>
                      <p className="small text-body-secondary mb-0">{libro?.autor}</p>
                    </div>
                    <div className="text-sm-end">
                      <p className="small mb-0">
                        Devolver el <strong>{formatearFecha(p.fechaDevolucion)}</strong>
                      </p>
                      <p className={`small mb-0 ${vencido ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
                        {detalleEstado(p)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="py-2">
              <p className="text-body-secondary">No tenés libros prestados en este momento.</p>
              <Button as={Link} to="/catalogo" variant="dark">Buscar un libro</Button>
            </div>
          )}
        </section>

        <section aria-labelledby="titulo-historial">
          <h2 id="titulo-historial" className="fs-3 fw-bold mb-3">Historial</h2>
          {devueltos.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {devueltos.map((p) => {
                const libro = buscarLibro(p.libroId)
                return (
                  <li key={p.id} className="d-flex align-items-center gap-3 py-3 border-bottom">
                    <span
                      className="lomo-mini"
                      style={{ backgroundColor: coloresCategoria[libro?.categoria] || '#3A3C42' }}
                      aria-hidden="true"
                    ></span>
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{libro ? libro.titulo : 'Libro no encontrado'}</p>
                      <p className="small text-body-secondary mb-0">Lo pediste el {formatearFecha(p.fechaPrestamo)}</p>
                    </div>
                    <span className="small text-body-secondary">Devuelto</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-body-secondary mb-0">Todavía no devolviste ningún libro.</p>
          )}
        </section>
      </Container>
    </>
  )
}

export default MiBiblioteca