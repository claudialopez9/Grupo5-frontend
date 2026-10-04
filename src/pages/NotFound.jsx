import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'

function NotFound() {
  useSEO('Página no encontrada', 'La página que buscás no existe en la Biblioteca UTN.')

  return (
    <Container className="my-5 text-center">
      <h1>404</h1>
      <p className="lead">La página que buscás no existe.</p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </Container>
  )
}

export default NotFound