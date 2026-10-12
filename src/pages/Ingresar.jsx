import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import useSesion from '../hooks/useSesion'
import useSEO from '../hooks/useSEO'
import { avisarExito, mostrarError } from '../utils/alertas'

function Ingresar() {
  useSEO('Ingresar', 'Ingresá a BiblioFRT con tu número de legajo o con el usuario de la biblioteca.')

  const { usuario, ingresar } = useSesion()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')

  // Si hay alguien logueado (recién ingresó o ya estaba), lo mandamos a su página según el rol
  if (usuario) return <Navigate to={usuario.rol === 'bibliotecario' ? '/panel' : '/mi-biblioteca'} replace />

  function manejarEnvio(e) {
    e.preventDefault()
    const sesion = ingresar(nombreUsuario, password)

    if (!sesion) {
      mostrarError('No pudimos ingresar', 'El usuario o la contraseña no coinciden. Revisalos e intentá de nuevo.')
      return
    }

    // Al cambiar el usuario, el componente se vuelve a dibujar y el <Navigate> de arriba hace la redirección
    avisarExito(`¡Hola, ${sesion.nombre}!`, 'Ingresaste a BiblioFRT.')
  }

  return (
    <section className="bg-body-tertiary">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <h1 className="titulo-principal display-5 fw-bold mb-3">Ingresar</h1>
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
