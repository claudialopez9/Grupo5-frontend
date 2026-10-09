import { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

function ModalPrestamo({ show, onHide, alumnos, libros, onRegistrar }) {
  const [alumnoId, setAlumnoId] = useState('')
  const [libroId, setLibroId] = useState('')

  const librosDisponibles = libros.filter((libro) => libro.disponibles > 0)

  function limpiar() {
    setAlumnoId('')
    setLibroId('')
  }

  function cerrar() {
    limpiar()
    onHide()
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const registrado = onRegistrar(Number(alumnoId), Number(libroId))
    if (registrado) limpiar()
  }

  return (
    <Modal show={show} onHide={cerrar} centered enforceFocus={false}>
      <Form onSubmit={manejarEnvio}>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="fs-4 fw-bold">Registrar préstamo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-body-secondary">
            Para alumnos que retiran un libro en el mostrador sin haberlo pedido por la web.
          </p>

          <Form.Group className="mb-3" controlId="prestamo-alumno">
            <Form.Label className="fw-semibold">Alumno</Form.Label>
            <Form.Select required value={alumnoId} onChange={(e) => setAlumnoId(e.target.value)}>
              <option value="">Elegí un alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.apellido}, {alumno.nombre} (legajo {alumno.legajo})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="prestamo-libro">
            <Form.Label className="fw-semibold">Libro</Form.Label>
            <Form.Select required value={libroId} onChange={(e) => setLibroId(e.target.value)}>
              <option value="">Elegí un libro</option>
              {librosDisponibles.map((libro) => (
                <option key={libro.id} value={libro.id}>
                  {libro.titulo} ({libro.disponibles} disponibles)
                </option>
              ))}
            </Form.Select>
            <Form.Text>Solo aparecen los libros con ejemplares disponibles.</Form.Text>
          </Form.Group>

          <p className="small text-body-secondary mt-3 mb-0">La devolución queda a 14 días desde hoy.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrar}>Cancelar</Button>
          <Button type="submit" variant="dark">Registrar préstamo</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalPrestamo
