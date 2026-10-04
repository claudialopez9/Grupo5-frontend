import { Container } from 'react-bootstrap'

function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container className="text-center">
        <small>© {anio} Biblioteca UTN - Todos los derechos reservados</small>
      </Container>
    </footer>
  )
}

export default Footer