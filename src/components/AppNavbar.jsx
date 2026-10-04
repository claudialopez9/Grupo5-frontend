import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

const enlaces = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/catalogo', texto: 'Catálogo' },
  { ruta: '/alumnos', texto: 'Alumnos' },
  { ruta: '/prestamos', texto: 'Préstamos' },
]

function AppNavbar() {
  return (
    <header>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Biblioteca UTN
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-principal" />
          <Navbar.Collapse id="menu-principal">
            <Nav className="me-auto">
              {enlaces.map((enlace) => (
                <Nav.Link key={enlace.ruta} as={NavLink} to={enlace.ruta} end>
                  {enlace.texto}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default AppNavbar