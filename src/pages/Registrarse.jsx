import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useSesion } from '../context/SesionContext'
import useSEO from '../hooks/useSEO'

const carreras = [
  'Ing. en Sistemas',
  'Ing. Civil',
  'Ing. Eléctrica',
  'Ing. Electrónica',
  'Ing. Mecánica',
  'Ing. Química',
]

const formularioVacio = {
  nombre: '',
  apellido: '',
  legajo: '',
  correo: '',
  carrera: '',
  password: '',
  confirmacion: '',
}

function Registrarse() {
  useSEO('Registrarse', 'Creá tu cuenta de alumno en BiblioFRT con tu número de legajo.')

  const { usuario, registrarse } = useSesion()
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioVacio)

  if (usuario) return <Navigate to="/" replace />

  // Un solo manejador para todos los campos: usa el "name" del input
  function actualizarCampo(e) {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
  }

  function mostrarError(titulo, texto) {
    Swal.fire({ icon: 'error', title: titulo, text: texto, confirmButtonText: 'Entendido', confirmButtonColor: '#1F2125' })
  }

  function manejarEnvio(e) {
    e.preventDefault()

    if (formulario.password !== formulario.confirmacion) {
      mostrarError('Las contraseñas no coinciden', 'Escribí la misma contraseña en los dos campos.')
      return
    }

    const resultado = registrarse({
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      legajo: formulario.legajo.trim(),
      correo: formulario.correo.trim(),
      carrera: formulario.carrera,
      password: formulario.password,
    })

    if (!resultado.ok) {
      mostrarError('No pudimos crear la cuenta', resultado.mensaje)
      return
    }

    Swal.fire({
      icon: 'success',
      title: `¡Listo, ${resultado.sesion.nombre}!`,
      text: 'Tu cuenta quedó creada. Desde ahora ingresás con tu legajo.',
      timer: 2200,
      showConfirmButton: false,
    })
    navigate('/')
  }

  return (
    <section className="hero-busqueda">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={7}>
            <h1 className="titulo-principal mb-3">Crear cuenta</h1>
            <p className="lead mb-4">Registrate con tu legajo para ver tus préstamos y fechas de devolución.</p>

            <Form onSubmit={manejarEnvio} className="bg-white border rounded-3 p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="nombre">
                    <Form.Label className="fw-semibold">Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" required minLength={2} value={formulario.nombre} onChange={actualizarCampo} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="apellido">
                    <Form.Label className="fw-semibold">Apellido</Form.Label>
                    <Form.Control type="text" name="apellido" required minLength={2} value={formulario.apellido} onChange={actualizarCampo} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="legajo">
                    <Form.Label className="fw-semibold">Legajo</Form.Label>
                    <Form.Control type="number" name="legajo" required min={10000} max={99999} placeholder="Ej.: 45012" value={formulario.legajo} onChange={actualizarCampo} />
                    <Form.Text>Va a ser tu usuario para ingresar.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="carrera">
                    <Form.Label className="fw-semibold">Carrera</Form.Label>
                    <Form.Select name="carrera" required value={formulario.carrera} onChange={actualizarCampo}>
                      <option value="">Elegí tu carrera</option>
                      {carreras.map((carrera) => (
                        <option key={carrera} value={carrera}>{carrera}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="correo">
                    <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                    <Form.Control type="email" name="correo" required placeholder="nombre@ejemplo.com" value={formulario.correo} onChange={actualizarCampo} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password-nueva">
                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                    <Form.Control type="password" name="password" required minLength={4} autoComplete="new-password" value={formulario.password} onChange={actualizarCampo} />
                    <Form.Text>Mínimo 4 caracteres.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="confirmacion">
                    <Form.Label className="fw-semibold">Repetí la contraseña</Form.Label>
                    <Form.Control type="password" name="confirmacion" required minLength={4} autoComplete="new-password" value={formulario.confirmacion} onChange={actualizarCampo} />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="dark" size="lg" className="w-100 mt-4">
                Crear cuenta
              </Button>
            </Form>

            <p className="mt-3 mb-0">
              ¿Ya tenés cuenta? <Link to="/ingresar">Ingresá</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Registrarse