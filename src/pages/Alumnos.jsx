import { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import AlumnosCard from '../components/AlumnosCard'
import { useDatos } from '../context/DatosContext'
import useSEO from '../hooks/useSEO'

function Alumnos() {
  useSEO('Alumnos', 'Listado de alumnos registrados en la biblioteca de la UTN y sus préstamos activos.')

  const { alumnos, prestamos } = useDatos()
  const [busqueda, setBusqueda] = useState('')
  const texto = busqueda.trim().toLowerCase()

  const alumnosFiltrados = alumnos.filter((alumno) =>
    `${alumno.nombre} ${alumno.apellido} ${alumno.legajo}`.toLowerCase().includes(texto)
  )

  // Cuenta los préstamos de un alumno que todavía no devolvió
  function contarActivos(alumnoId) {
    return prestamos.filter((p) => p.alumnoId === alumnoId && p.estado !== 'Devuelto').length
  }

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <h1 className="titulo-principal mb-3">Alumnos</h1>
          <p className="lead mb-4">Consultá los alumnos registrados y cuántos préstamos tiene cada uno.</p>
          <Form.Group controlId="buscar-alumno" className="buscador">
            <Form.Label className="fw-semibold">Buscá por nombre, apellido o legajo</Form.Label>
            <Form.Control
              type="search"
              size="lg"
              placeholder="Ej.: Gómez o 45012"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Form.Group>
        </Container>
      </section>

      <Container className="py-4 mb-5">
        <p className="text-body-secondary mb-4">
          Mostrando {alumnosFiltrados.length} de {alumnos.length} alumnos
        </p>
        {alumnosFiltrados.length > 0 ? (
          <section aria-label="Alumnos registrados">
            <Row className="g-4">
              {alumnosFiltrados.map((alumno) => (
                <Col key={alumno.id} xs={12} md={6} lg={4}>
                  <AlumnosCard
                    nombre={alumno.nombre}
                    apellido={alumno.apellido}
                    legajo={alumno.legajo}
                    carrera={alumno.carrera}
                    prestamosActivos={contarActivos(alumno.id)}
                  />
                </Col>
              ))}
            </Row>
          </section>
        ) : (
          <p className="text-body-secondary py-4">
            No hay alumnos con ese nombre o legajo. Revisá cómo lo escribiste.
          </p>
        )}
      </Container>
    </>
  )
}

export default Alumnos