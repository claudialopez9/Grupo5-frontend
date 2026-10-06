import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

function AppNavbar() {
  return (
    <Navbar expand="md" bg="dark" sticky="top" collapseOnSelect className="navbar-bibliofrt border-bottom py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="marca d-flex align-items-center gap-2">
          <img src="/img/logo-navbar.svg" alt="logo biblioteca" height="40" ></img>
           
          BiblioFRT
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end eventKey="inicio">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" eventKey="catalogo">Catálogo</Nav.Link>
            <Nav.Link as={NavLink} to="/prestamos" eventKey="prestamos">Préstamos</Nav.Link>
            <Nav.Link as={NavLink} to="/alumnos" eventKey="alumnos">Alumnos</Nav.Link>
            <Nav.Link as={NavLink} to="/sobre-nosotros" eventKey="sobre-nosotros">Sobre Nosotros</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar