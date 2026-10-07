import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useSesion } from '../context/SesionContext'
import useSEO from '../hooks/useSEO'

function Ingresar() {
  useSEO('Ingresar', 'Ingresá a BiblioFRT con tu número de legajo o con el usuario de la biblioteca.')

  const { usuario, ingresar } = useSesion()
  const navigate = useNavigate()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')

  // Si ya hay alguien logueado, no tiene sentido mostrar el formulario
  if (usuario) return <Navigate to="/" replace />

  function manejarEnvio(e) {
    e.preventDefault()
    const sesion = ingresar(nombreUsuario, password)

    if (!sesion) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos ingresar',
        text: 'El usuario o la contraseña no coinciden. Revisalos e intentá de nuevo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1F2125',
      })
      return
    }

    Swal.fire({
      icon: 'success',
      title: `¡Hola, ${sesion.nombre}!`,
      text: 'Ingresaste a BiblioFRT.',
      timer: 1800,
      showConfirmButton: false,
    })
    navigate('/')
  }

  return (
    <section className="hero-busqueda">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <h1 className="titulo-principal mb-3">Ingresar</h1>
            <p className="lead mb-4">Los alumnos ingresan con su número de legajo.</p>

            <Form onSubmit={manejarEnvio} className="bg-white border rounded-3 p-4">
              <Form.Group className="mb-3" controlId="usuario">
                <Form.Label className="fw-semibold">Usuario</Form.Label>
                <Form.Control
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Tu número de legajo"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="fw-semibold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  required
                  minLength={4}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="dark" size="lg" className="w-100">
                Ingresar
              </Button>
            </Form>

            <p className="mt-3 mb-0">
              ¿Todavía no tenés cuenta? <Link to="/registrarse">Registrate</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Ingresar