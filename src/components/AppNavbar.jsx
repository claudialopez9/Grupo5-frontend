import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

function AppNavbar() {
  return (
    <Navbar expand="md" bg="white" sticky="top" collapseOnSelect className="navbar-bibliofrt border-bottom py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="marca d-flex align-items-center gap-2">
          <span className="logo-lomos" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          BiblioFRT
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end eventKey="inicio">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" eventKey="catalogo">Catálogo</Nav.Link>
            <Nav.Link as={NavLink} to="/prestamos" eventKey="prestamos">Préstamos</Nav.Link>
            <Nav.Link as={NavLink} to="/alumnos" eventKey="alumnos">Alumnos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar