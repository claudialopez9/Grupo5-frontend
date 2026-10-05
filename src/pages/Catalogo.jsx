import { Container, Row, Col } from 'react-bootstrap'
import LibroCard from '../components/LibroCard'
import { libros } from '../data/libros'
import useSEO from '../hooks/useSEO'

function Catalogo() {
  useSEO('Catálogo de libros', 'Consultá el catálogo de la biblioteca de la UTN y la disponibilidad de cada libro.')

  return (
    <Container className="my-5">
      <h1 className="mb-4">Catálogo de libros</h1>
      <section>
        <Row>
          {libros.map((libro) => (
            <Col key={libro.id} xs={12} md={6} lg={3} className="mb-4">
              <LibroCard
                titulo={libro.titulo}
                autor={libro.autor}
                isbn={libro.isbn}
                categoria={libro.categoria}
                disponibles={libro.disponibles}
                total={libro.total}
              />
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  )
}

export default Catalogo
