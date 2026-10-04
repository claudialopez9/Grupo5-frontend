import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'

const accesos = [
  { id: 1, titulo: 'Catálogo', texto: 'Buscá libros y mirá cuántos ejemplares hay disponibles.', ruta: '/catalogo' },
  { id: 2, titulo: 'Alumnos', texto: 'Consultá los alumnos registrados y sus préstamos.', ruta: '/alumnos' },
  { id: 3, titulo: 'Préstamos', texto: 'Seguí préstamos activos, vencidos y devoluciones.', ruta: '/prestamos' },
]

function Inicio() {
  useSEO('Inicio', 'Sistema de gestión de la biblioteca de la UTN: catálogo, alumnos y préstamos.')

  return (
    <Container className="my-5">
      <section className="text-center mb-5">
        <h1>Biblioteca UTN</h1>
        <p className="lead">
          Gestioná libros, ejemplares, alumnos y préstamos desde una computadora o desde el celular.
        </p>
      </section>

      <section>
        <h2 className="mb-4">¿Qué querés hacer?</h2>
        <Row>
          {accesos.map((acceso) => (
            <Col key={acceso.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{acceso.titulo}</Card.Title>
                  <Card.Text>{acceso.texto}</Card.Text>
                  <Button as={Link} to={acceso.ruta} variant="primary">
                    Ir a {acceso.titulo}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  )
}

export default Inicio