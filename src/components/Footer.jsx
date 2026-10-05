import { Container } from 'react-bootstrap'

function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="border-top">
      <Container className="py-4 d-flex flex-column flex-md-row justify-content-between gap-2 small text-body-secondary">
        <span>© {anio} Biblioteca UTN Facultad Regional Tucumán. Todos los derechos reservados.</span>
        <span>BiblioFRT es un proyecto del Grupo 5</span>
      </Container>
    </footer>
  )
}

export default Footer