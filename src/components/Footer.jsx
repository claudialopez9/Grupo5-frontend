import { Container } from 'react-bootstrap'

function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light">
      <Container className="py-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 small">
        <img src="/img/logo-footer.svg" alt="Logo de la Biblioteca UTN" height="60" />
        <div className="d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
          <span>© {anio} Biblioteca UTN Facultad Regional Tucumán. Todos los derechos reservados.</span>
          <span>BiblioFRT es un proyecto del Grupo 5</span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
