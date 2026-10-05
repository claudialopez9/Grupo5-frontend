import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { libros } from '../data/libros'
import { coloresCategoria } from '../data/categorias'

const accesos = [
  { id: 1, titulo: 'Catálogo', texto: 'Buscá libros y mirá cuántos ejemplares hay disponibles.', ruta: '/catalogo' },
  { id: 2, titulo: 'Alumnos', texto: 'Consultá los alumnos registrados y sus préstamos.', ruta: '/alumnos' },
  { id: 3, titulo: 'Préstamos', texto: 'Seguí préstamos activos, vencidos y devoluciones.', ruta: '/prestamos' },
]

function Inicio() {
  useSEO('Inicio', 'Sistema de gestión de la biblioteca de la UTN: catálogo, alumnos y préstamos.')

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <Row className="align-items-end g-5">
            <Col lg={6}>
              <h1 className="titulo-principal mb-3">La biblioteca de la FRT</h1>
              <p className="lead mb-4">
                Buscá libros, mirá cuántos ejemplares quedan y gestioná alumnos y préstamos desde la compu o el celular.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/catalogo" variant="dark" size="lg">
                  Buscar un libro
                </Button>
                <Button as={Link} to="/prestamos" variant="outline-dark" size="lg">
                  Ver préstamos
                </Button>
              </div>
            </Col>

            <Col lg={6}>
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