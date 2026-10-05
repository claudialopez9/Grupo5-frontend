import { Routes, Route, Link } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'

function Inicio() {
  return <h1>Inicio</h1>
}

function Acerca() {
  return <h1>Acerca de</h1>
}

function App() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Grupo 5</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/acerca">Acerca de</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/acerca" element={<Acerca />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
