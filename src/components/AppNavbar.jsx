import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext";

function AppNavbar() {
  const { usuario, salir } = useSesion();
  const navigate = useNavigate();

  const esBibliotecario = usuario?.rol === "bibliotecario";
  const esAlumno = usuario?.rol === "alumno";

  function manejarSalida() {
    salir();
    navigate("/");
  }

  return (
    <Navbar
      expand="md"
      bg="dark"
      data-bs-theme="dark"
      sticky="top"
      collapseOnSelect
      className="navbar-bibliofrt border-bottom py-2"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="marca d-flex align-items-center gap-2"
        >
          <img src="/img/logo-navbar.svg" alt="Logo de la UTN" height="40" />
          BiblioFRT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-md-center">
            <Nav.Link as={NavLink} to="/" end eventKey="inicio">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" eventKey="catalogo">
              Catálogo
            </Nav.Link>
            {esAlumno && (
              <Nav.Link
                as={NavLink}
                to="/mi-biblioteca"
                eventKey="mi-biblioteca"
              >
                Mi biblioteca
              </Nav.Link>
            )}
            {esBibliotecario && (
              <>
                <Nav.Link as={NavLink} to="/panel" eventKey="panel">
                  Panel
                </Nav.Link>
                <Nav.Link as={NavLink} to="/prestamos" eventKey="prestamos">
                  Préstamos
                </Nav.Link>
                <Nav.Link as={NavLink} to="/alumnos" eventKey="alumnos">
                  Alumnos
                </Nav.Link>
              </>
            )}
            <Nav.Link
              as={NavLink}
              to="/sobre-nosotros"
              eventKey="sobre-nosotros"
            >
              Sobre Nosotros
            </Nav.Link>
            {usuario ? (
              <>
                <Navbar.Text className="ms-md-3">
                  Hola, <strong className="text-white">{usuario.nombre}</strong>
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-md-3 my-2 my-md-0 align-self-start align-self-md-center"
                  onClick={manejarSalida}
                >
                  Salir
                </Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/ingresar" eventKey="ingresar">
                Ingresar
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
