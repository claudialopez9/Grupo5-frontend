import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Estante from '../components/Estante'
import useSEO from '../hooks/useSEO'
import { colorDeCategoria } from '../data/categorias'

// Estante con un hueco: "falta" la página que se buscaba
const lomos = [
  { id: 1, color: colorDeCategoria('Programación'), alto: 230, ancho: 52 },
  { id: 2, color: colorDeCategoria('Matemática'), alto: 260, ancho: 60 },
  { id: 3, vacio: true, alto: 250, ancho: 56 },
  { id: 4, color: colorDeCategoria('Física'), alto: 220, ancho: 56 },
]

function NotFound() {
  useSEO('Página no encontrada', 'La página que buscás no existe en BiblioFRT.')

  return (
    <Container className="py-5 my-lg-4">
      <Row className="align-items-center g-4 g-lg-5">
        <Col lg={6}>
          <p className="fw-semibold text-body-secondary mb-2">Error 404</p>
          <h1 className="titulo-principal display-5 fw-bold mb-3">No encontramos esta página</h1>
          <p className="lead mb-4">Puede que el link esté mal escrito o que la página ya no exista.</p>
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to="/" variant="dark" size="lg">
              Volver al inicio
            </Button>
            <Button as={Link} to="/catalogo" variant="outline-dark" size="lg">
              Buscar un libro
            </Button>
          </div>
        </Col>
        <Col lg={6} className="d-flex justify-content-center">
          <Estante lomos={lomos} />
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
