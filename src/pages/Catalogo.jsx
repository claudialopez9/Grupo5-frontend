import { Container } from 'react-bootstrap'
import useSEO from '../hooks/useSEO'

function Catalogo() {
  useSEO('Catálogo de libros', 'Catálogo de la biblioteca de la UTN.')

  return (
    <Container className="my-5">
      <h1>Catálogo de libros</h1>
      <p>En construcción.</p>
    </Container>
  )
}

export default Catalogo