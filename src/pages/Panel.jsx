import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import ModalPrestamo from '../components/ModalPrestamo'
import { useDatos } from '../context/DatosContext'
import { useSesion } from '../context/SesionContext'
import { coloresCategoria } from '../data/categorias'
import { formatearFecha, diasHasta, estaVencido, estaEnPoder, detalleEstado } from '../utils/fechas'
import useSEO from '../hooks/useSEO'

const COLOR_CONFIRMAR = '#1F2125'

// Una fila de préstamo. Los botones de cada lista llegan por "children"
function FilaPrestamo({ prestamo, libro, alumno, children }) {
  const vencido = estaVencido(prestamo)
  const esSolicitud = prestamo.estado === 'Pendiente'
  const nombreAlumno = alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno no encontrado'

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
            {esSolicitud
              ? `${nombreAlumno}, lo pidió el ${formatearFecha(prestamo.fechaSolicitud)}`
              : `${nombreAlumno}, devuelve el ${formatearFecha(prestamo.fechaDevolucion)}`}
          </p>
          {!esSolicitud && (
            <p className={`small mb-0 ${vencido ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
              {detalleEstado(prestamo)}
            </p>
          )}
        </div>
      </div>
      <div className="d-flex gap-2 flex-shrink-0">{children}</div>
    </li>
  )
}

function Panel() {
  useSEO('Panel', 'Resumen diario de préstamos, solicitudes y vencimientos de la biblioteca de la UTN.')

  const {
    prestamos,
    libros,
    alumnos,
    entregarPrestamo,
    cancelarSolicitud,
    registrarDevolucion,
    registrarPrestamoDirecto,
    restablecerDatos,
  } = useDatos()
  const { usuario } = useSesion()
  const [mostrarModal, setMostrarModal] = useState(false)

  const buscarLibro = (id) => libros.find((libro) => libro.id === id)
  const buscarAlumno = (id) => alumnos.find((alumno) => alumno.id === id)

  // Cálculos del resumen
  const solicitudes = prestamos.filter((p) => p.estado === 'Pendiente')
  const enCurso = prestamos.filter((p) => estaEnPoder(p))
  const vencidos = enCurso.filter((p) => estaVencido(p))
  const vencenPronto = enCurso.filter((p) => !estaVencido(p) && diasHasta(p.fechaDevolucion) <= 7)
  const ejemplaresDisponibles = libros.reduce((total, libro) => total + libro.disponibles, 0)

  const resumen = [
    { id: 'solicitudes', numero: solicitudes.length, texto: 'solicitudes para entregar' },
    { id: 'en-curso', numero: enCurso.length, texto: 'libros prestados ahora' },
    { id: 'vencidos', numero: vencidos.length, texto: 'préstamos vencidos', alerta: vencidos.length > 0 },
    { id: 'disponibles', numero: ejemplaresDisponibles, texto: 'ejemplares disponibles' },
  ]

  // Ranking: cuántas veces se pidió cada libro
  const masPedidos = libros
    .map((libro) => ({ ...libro, veces: prestamos.filter((p) => p.libroId === libro.id).length }))
    .filter((libro) => libro.veces > 0)
    .sort((a, b) => b.veces - a.veces)
    .slice(0, 5)

  // Cartel de confirmación con el estilo de la página
  function confirmar(opciones) {
    return Swal.fire({
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      confirmButtonColor: COLOR_CONFIRMAR,
      ...opciones,
    })
  }

  function avisarExito(titulo) {
    Swal.fire({ icon: 'success', title: titulo, timer: 1600, showConfirmButton: false })
  }

  function manejarEntrega(prestamo) {
    const libro = buscarLibro(prestamo.libroId)
    confirmar({
      title: '¿Entregar el libro?',
      text: `Se registra el préstamo de "${libro ? libro.titulo : 'el libro'}" con devolución en 14 días.`,
      confirmButtonText: 'Entregar',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        entregarPrestamo(prestamo.id)
        avisarExito('Préstamo registrado')
      }
    })
  }

  function manejarCancelacion(prestamo) {
    confirmar({
      icon: 'warning',
      title: '¿Cancelar la solicitud?',
      text: 'El ejemplar reservado vuelve a estar disponible para otra persona.',
      confirmButtonText: 'Cancelar solicitud',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        cancelarSolicitud(prestamo.id)
        avisarExito('Solicitud cancelada')
      }
    })
  }

  function manejarDevolucion(prestamo) {
    const libro = buscarLibro(prestamo.libroId)
    confirmar({
      title: '¿Registrar la devolución?',
      text: `"${libro ? libro.titulo : 'El libro'}" va a quedar como devuelto y disponible para otro préstamo.`,
      confirmButtonText: 'Registrar devolución',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        registrarDevolucion(prestamo.id)
        avisarExito('Devolución registrada')
      }
    })
  }

  // La usa el modal. Devuelve true si se registró, para que el modal limpie el formulario
  function manejarPrestamoDirecto(alumnoId, libroId) {
    const resultado = registrarPrestamoDirecto(alumnoId, libroId)
    if (!resultado.ok) {
      Swal.fire({
        icon: 'error',
        title: 'No se puede registrar el préstamo',
        text: resultado.mensaje,
        confirmButtonText: 'Entendido',
        confirmButtonColor: COLOR_CONFIRMAR,
      })
      return false
    }
    setMostrarModal(false)
    Swal.fire({
      icon: 'success',
      title: 'Préstamo registrado',
      text: `Devolución el ${formatearFecha(resultado.prestamo.fechaDevolucion)}.`,
      timer: 2200,
      showConfirmButton: false,
    })
    return true
  }

  function manejarRestablecer() {
    confirmar({
      icon: 'warning',
      title: '¿Restablecer los datos de prueba?',
      text: 'Se borran las solicitudes, préstamos y devoluciones hechas desde la página y se vuelve a los datos originales.',
      confirmButtonText: 'Restablecer',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) restablecerDatos()
    })
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <h1 className="titulo-principal mb-3">Panel de la biblioteca</h1>
          <p className="lead mb-4">Hola, {usuario.nombre}. Esto es lo que necesita atención hoy.</p>
          <Button variant="dark" size="lg" onClick={() => setMostrarModal(true)}>
            Registrar préstamo
          </Button>
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
            <section className="mb-5" aria-labelledby="titulo-solicitudes">
              <h2 id="titulo-solicitudes" className="fs-4 fw-bold mb-2">Solicitudes para entregar</h2>
              {solicitudes.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {solicitudes.map((p) => (
                    <FilaPrestamo key={p.id} prestamo={p} libro={buscarLibro(p.libroId)} alumno={buscarAlumno(p.alumnoId)}>
                      <Button variant="dark" size="sm" onClick={() => manejarEntrega(p)}>Entregar</Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => manejarCancelacion(p)}>Cancelar</Button>
                    </FilaPrestamo>
                  ))}
                </ul>
              ) : (
                <p className="text-body-secondary">No hay solicitudes esperando retiro.</p>
              )}
            </section>

            <section className="mb-5" aria-labelledby="titulo-vencidos">
              <h2 id="titulo-vencidos" className="fs-4 fw-bold mb-2">Vencidos</h2>
              {vencidos.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {vencidos.map((p) => (
                    <FilaPrestamo key={p.id} prestamo={p} libro={buscarLibro(p.libroId)} alumno={buscarAlumno(p.alumnoId)}>
                      <Button variant="outline-dark" size="sm" onClick={() => manejarDevolucion(p)}>Registrar devolución</Button>
                    </FilaPrestamo>
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
                    <FilaPrestamo key={p.id} prestamo={p} libro={buscarLibro(p.libroId)} alumno={buscarAlumno(p.alumnoId)}>
                      <Button variant="outline-dark" size="sm" onClick={() => manejarDevolucion(p)}>Registrar devolución</Button>
                    </FilaPrestamo>
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
                      {libro.veces} {libro.veces === 1 ? 'pedido' : 'pedidos'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </Col>
        </Row>

        <div className="mt-5 pt-4 border-top">
          <Button variant="link" className="text-body-secondary p-0" onClick={manejarRestablecer}>
            Restablecer datos de prueba
          </Button>
        </div>
      </Container>

      <ModalPrestamo
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        alumnos={alumnos}
        libros={libros}
        onRegistrar={manejarPrestamoDirecto}
      />
    </>
  )
}

export default Panel

