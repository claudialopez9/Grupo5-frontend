import { Container } from 'react-bootstrap'
import useSEO from '../hooks/useSEO'

function Alumnos() {
  useSEO('Alumnos', 'Alumnos registrados en la biblioteca de la UTN.')

  return (
    <Container className="my-5">
      <h1>Alumnos</h1>
      <p>En construcción.</p>
    </Container>
  )
}

export default Alumnos