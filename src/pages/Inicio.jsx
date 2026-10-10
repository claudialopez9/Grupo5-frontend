import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { useDatos } from '../context/DatosContext'
import { useSesion } from '../context/SesionContext'
import { coloresCategoria } from '../data/categorias'

// Accesos que se muestran según quién ingresó
const accesosPorRol = {
  visitante: [
    { id: 1, titulo: 'Catálogo', texto: 'Buscá libros y mirá cuántos ejemplares hay disponibles.', ruta: '/catalogo' },
    { id: 2, titulo: 'Crear cuenta', texto: 'Registrate con tu legajo para pedir libros y seguir tus préstamos.', ruta: '/registrarse' },
    { id: 3, titulo: 'Ingresar', texto: 'Si ya tenés cuenta, entrá con tu número de legajo.', ruta: '/ingresar' },
  ],
  alumno: [
    { id: 1, titulo: 'Catálogo', texto: 'Buscá libros y pedilos prestados.', ruta: '/catalogo' },
    { id: 2, titulo: 'Mi biblioteca', texto: 'Mirá los libros que tenés, renovalos y revisá cuándo devolverlos.', ruta: '/mi-biblioteca' },
    { id: 3, titulo: 'Sobre nosotros', texto: 'Conocé al equipo que desarrolla BiblioFRT.', ruta: '/sobre-nosotros' },
  ],
  bibliotecario: [
    { id: 1, titulo: 'Panel', texto: 'Entregá solicitudes, registrá devoluciones y mirá lo que vence.', ruta: '/panel' },
    { id: 2, titulo: 'Préstamos', texto: 'Consultá todos los préstamos y filtralos por estado.', ruta: '/prestamos' },
    { id: 3, titulo: 'Alumnos', texto: 'Buscá alumnos registrados y mirá cuántos libros tiene cada uno.', ruta: '/alumnos' },
  ],
}

// Segundo botón del encabezado según quién ingresó
const botonSecundarioPorRol = {
  visitante: { texto: 'Crear cuenta', ruta: '/registrarse' },
  alumno: { texto: 'Mi biblioteca', ruta: '/mi-biblioteca' },
  bibliotecario: { texto: 'Ir al panel', ruta: '/panel' },
}

function Inicio() {
  useSEO('Inicio', 'BiblioFRT, el sistema de gestión de la biblioteca de la UTN FRT: catálogo, préstamos y alumnos.')

  const { libros } = useDatos()
  const { usuario } = useSesion()

  // Si no hay nadie logueado, se usa "visitante"
  const rol = usuario ? usuario.rol : 'visitante'
  const accesos = accesosPorRol[rol]
  const botonSecundario = botonSecundarioPorRol[rol]

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <Row className="align-items-end g-5">
            <Col lg={6}>
              <h1 className="titulo-principal mb-3">La biblioteca de la FRT</h1>
              <p className="lead mb-4">
                Buscá libros, pedilos prestados y seguí tus devoluciones desde la compu o el celular.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/catalogo" variant="dark" size="lg">
                  Buscar un libro
                </Button>
                <Button as={Link} to={botonSecundario.ruta} variant="outline-dark" size="lg">
                  {botonSecundario.texto}
                </Button>
              </div>
            </Col>

            <Col lg={6}>
              <div className="estante-contenedor">
                <ul className="estante list-unstyled mb-0" aria-label="Libros del catálogo">
                  {libros.map((libro) => (
                    <li
                      key={libro.id}
                      className="lomo"
                      style={{
                        backgroundColor: coloresCategoria[libro.categoria] || '#3A3C42',
                        height: `${210 + (libro.titulo.length % 5) * 20}px`,
                        width: `${50 + (libro.autor.length % 3) * 8}px`,
                      }}
                    >
                      {libro.titulo}
                    </li>
                  ))}
                </ul>
                <div className="estante-tabla" aria-hidden="true"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        <h2 className="fw-bold mb-3">¿Qué querés hacer?</h2>
        <nav aria-label="Secciones del sistema">
          {accesos.map((acceso) => (
            <Link
              key={acceso.id}
              to={acceso.ruta}
              className="acceso d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-4 px-3 border-top text-decoration-none"
            >
              <div>
                <h3 className="fs-3 fw-bold mb-1">{acceso.titulo}</h3>
                <p className="text-body-secondary mb-0">{acceso.texto}</p>
              </div>
              <span className="btn btn-outline-dark rounded-pill px-4 flex-shrink-0">
                Ir a {acceso.titulo}
              </span>
            </Link>
          ))}
        </nav>
      </Container>
    </>
  )
}

export default Inicio