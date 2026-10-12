import { Container, Row, Col, Alert, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AlumnosCard from '../components/AlumnosCard'
import LomoCategoria from '../components/LomoCategoria'
import useDatos from '../hooks/useDatos'
import useSesion from '../hooks/useSesion'
import useSEO from '../hooks/useSEO'
import { formatearFecha, estaVencido, estaEnPoder, detalleEstado } from '../utils/fechas'
import { confirmar, avisarExito, informar, mostrarError } from '../utils/alertas'

function MiBiblioteca() {
  useSEO('Mi biblioteca', 'Tus préstamos, solicitudes, fechas de devolución e historial en la biblioteca de la UTN.')

  const { usuario } = useSesion()
  const { alumnos, prestamos, libros, cancelarSolicitud, renovarPrestamo } = useDatos()

  // Datos del alumno que ingresó
  const alumno = alumnos.find((a) => a.id === usuario.alumnoId)

  // Sus préstamos, separados por estado
  const misPrestamos = prestamos.filter((p) => p.alumnoId === usuario.alumnoId)
  const pendientes = misPrestamos.filter((p) => p.estado === 'Pendiente')
  const enPoder = misPrestamos.filter((p) => estaEnPoder(p))
  const devueltos = misPrestamos.filter((p) => p.estado === 'Devuelto')
  const vencidos = enPoder.filter((p) => estaVencido(p))

  function buscarLibro(id) {
    return libros.find((libro) => libro.id === id)
  }

  function puedeRenovar(prestamo) {
    return prestamo.estado === 'Activo' && !estaVencido(prestamo) && !prestamo.renovado
  }

  function manejarCancelacion(prestamo) {
    const libro = buscarLibro(prestamo.libroId)
    confirmar({
      icono: 'warning',
      titulo: '¿Cancelar la solicitud?',
      texto: `Se libera el ejemplar de "${libro ? libro.titulo : 'el libro'}" para otra persona.`,
      textoBoton: 'Cancelar solicitud',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        cancelarSolicitud(prestamo.id)
        avisarExito('Solicitud cancelada')
      }
    })
  }

  function manejarRenovacion(prestamo) {
    confirmar({
      titulo: '¿Renovar el préstamo?',
      texto: 'La devolución se extiende 7 días. Cada préstamo se puede renovar una sola vez.',
      textoBoton: 'Renovar',
    }).then((respuesta) => {
      if (!respuesta.isConfirmed) return

      const resultado = renovarPrestamo(prestamo.id)
      if (resultado.ok) {
        informar('Préstamo renovado', `Nueva fecha de devolución: ${formatearFecha(resultado.nuevaFecha)}.`)
      } else {
        mostrarError('No se pudo renovar', resultado.mensaje)
      }
    })
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
      <section className="bg-body-tertiary">
        <Container className="py-5">
          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <h1 className="titulo-principal display-5 fw-bold mb-3">Mi biblioteca</h1>
              <p className="lead mb-0">
                Hola, {alumno.nombre}. Acá ves los libros que pediste, los que tenés y cuándo tenés que devolverlos.
              </p>
            </Col>
            <Col lg={5}>
              <AlumnosCard
                nombre={alumno.nombre}
                apellido={alumno.apellido}
                legajo={alumno.legajo}
                carrera={alumno.carrera}
                prestamosActivos={enPoder.length}
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
            <p className="mb-0">
              Acercate a la biblioteca para devolverlo. Hasta que lo devuelvas no vas a poder pedir otros libros.
            </p>
          </Alert>
        )}

        {pendientes.length > 0 && (
          <section className="mb-5" aria-labelledby="titulo-para-retirar">
            <h2 id="titulo-para-retirar" className="fs-3 fw-bold mb-3">
              Para retirar
            </h2>
            <ul className="list-unstyled mb-0">
              {pendientes.map((p) => {
                const libro = buscarLibro(p.libroId)
                return (
                  <li key={p.id} className="d-flex flex-wrap align-items-center gap-3 py-3 border-bottom">
                    <LomoCategoria categoria={libro?.categoria} />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{libro ? libro.titulo : 'Libro no encontrado'}</p>
                      <p className="small text-body-secondary mb-0">
                        Lo pediste el {formatearFecha(p.fechaSolicitud)}. Pasá a buscarlo por la biblioteca.
                      </p>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => manejarCancelacion(p)}>
                      Cancelar solicitud
                    </Button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className="mb-5" aria-labelledby="titulo-mis-libros">
          <h2 id="titulo-mis-libros" className="fs-3 fw-bold mb-3">
            Libros que tengo
          </h2>
          {enPoder.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {enPoder.map((p) => {
                const libro = buscarLibro(p.libroId)
                const vencido = estaVencido(p)
                return (
                  <li key={p.id} className="d-flex flex-wrap align-items-center gap-3 py-3 border-bottom">
                    <LomoCategoria categoria={libro?.categoria} />
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
                    {puedeRenovar(p) && (
                      <Button variant="outline-dark" size="sm" onClick={() => manejarRenovacion(p)}>
                        Renovar 7 días
                      </Button>
                    )}
                    {p.renovado && (
                      <Badge pill bg="secondary-subtle" text="secondary-emphasis">
                        Renovado
                      </Badge>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="py-2">
              <p className="text-body-secondary">No tenés libros en este momento.</p>
              <Button as={Link} to="/catalogo" variant="dark">
                Buscar un libro
              </Button>
            </div>
          )}
        </section>

        <section aria-labelledby="titulo-historial">
          <h2 id="titulo-historial" className="fs-3 fw-bold mb-3">
            Historial
          </h2>
          {devueltos.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {devueltos.map((p) => {
                const libro = buscarLibro(p.libroId)
                return (
                  <li key={p.id} className="d-flex align-items-center gap-3 py-3 border-bottom">
                    <LomoCategoria categoria={libro?.categoria} />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{libro ? libro.titulo : 'Libro no encontrado'}</p>
                      <p className="small text-body-secondary mb-0">
                        Lo retiraste el {formatearFecha(p.fechaPrestamo)}
                      </p>
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
