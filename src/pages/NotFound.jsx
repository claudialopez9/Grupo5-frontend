import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'
import { coloresCategoria } from '../data/categorias'

// null = lugar vacío en el estante
const lomos = [
  { color: coloresCategoria['Programación'], alto: 230, ancho: 52 },
  { color: coloresCategoria['Matemática'], alto: 260, ancho: 60 },
  null,
  { color: coloresCategoria['Física'], alto: 220, ancho: 56 },
]

function NotFound() {
  useSEO('Página no encontrada', 'La página que buscás no existe en la Biblioteca UTN.')

  return (
    <Container className="py-5 my-lg-4">
      <Row className="align-items-center g-5">
        <Col lg={6}>
          <p className="fw-semibold text-body-secondary mb-2">Error 404</p>
          <h1 className="titulo-principal mb-3">No encontramos esta página</h1>
          <p className="lead mb-4">Puede que el link esté mal escrito o que la página ya no exista.</p>
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to="/" variant="dark" size="lg">Volver al inicio</Button>
            <Button as={Link} to="/catalogo" variant="outline-dark" size="lg">Buscar un libro</Button>
          </div>
        </Col>
        <Col lg={6}>
          <div className="estante-contenedor" aria-hidden="true">
            <ul className="estante list-unstyled mb-0">
              {lomos.map((lomo, i) =>
                lomo ? (
                  <li key={i} className="lomo" style={{ backgroundColor: lomo.color, height: `${lomo.alto}px`, width: `${lomo.ancho}px` }}></li>
                ) : (
                  <li key={i} className="lomo lomo-vacio" style={{ height: '250px', width: '56px' }}></li>
                )
              )}
            </ul>
            <div className="estante-tabla"></div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound