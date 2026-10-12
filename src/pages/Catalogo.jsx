import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LibroCard from '../components/LibroCard'
import useDatos from '../hooks/useDatos'
import useSesion from '../hooks/useSesion'
import useSEO from '../hooks/useSEO'
import { confirmar, informar, mostrarError } from '../utils/alertas'

function Catalogo() {
  useSEO('Catálogo de libros', 'Consultá el catálogo de la biblioteca de la UTN y la disponibilidad de cada libro.')

  const { libros, prestamos, solicitarPrestamo } = useDatos()
  const { usuario } = useSesion()
  const esAlumno = usuario?.rol === 'alumno'

  // Lista de categorías sin repetir, con "Todas" al principio
  const categorias = ['Todas', ...new Set(libros.map((libro) => libro.categoria))]

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  const texto = busqueda.trim().toLowerCase()

  const librosFiltrados = libros.filter((libro) => {
    const coincideCategoria = categoria === 'Todas' || libro.categoria === categoria
    const coincideTexto = `${libro.titulo} ${libro.autor} ${libro.isbn}`.toLowerCase().includes(texto)
    return coincideCategoria && coincideTexto
  })

  function verTodo() {
    setBusqueda('')
    setCategoria('Todas')
  }

  // ¿El alumno ya pidió o tiene este libro?
  function yaLoPidio(libroId) {
    return prestamos.some((p) => p.alumnoId === usuario.alumnoId && p.libroId === libroId && p.estado !== 'Devuelto')
  }

  function manejarSolicitud(libro) {
    confirmar({
      titulo: '¿Pedir este libro?',
      texto: `Te reservamos un ejemplar de "${libro.titulo}" para que lo retires en la biblioteca.`,
      textoBoton: 'Pedir libro',
    }).then((respuesta) => {
      if (!respuesta.isConfirmed) return

      const resultado = solicitarPrestamo(usuario.alumnoId, libro.id)
      if (resultado.ok) {
        informar(
          'Te reservamos el libro',
          'Pasá a retirarlo por la biblioteca. Lo vas a ver en Mi biblioteca, en "Para retirar".'
        )
      } else {
        mostrarError('No pudimos reservar el libro', resultado.mensaje)
      }
    })
  }

  // Qué botón lleva cada libro según quién está mirando
  function botonDelLibro(libro) {
    if (!usuario) {
      return (
        <Button as={Link} to="/ingresar" variant="outline-dark" className="w-100">
          Ingresá para pedirlo
        </Button>
      )
    }
    if (!esAlumno) return null
    if (yaLoPidio(libro.id)) {
      return (
        <Button variant="outline-secondary" className="w-100" disabled>
          Ya lo pediste
        </Button>
      )
    }
    if (libro.disponibles === 0) {
      return (
        <Button variant="outline-secondary" className="w-100" disabled>
          Sin ejemplares
        </Button>
      )
    }
    return (
      <Button variant="dark" className="w-100" onClick={() => manejarSolicitud(libro)}>
        Pedir prestado
      </Button>
    )
  }

  return (
    <>
      <section className="bg-body-tertiary" aria-label="Buscar">
        <Container className="py-5">
          <h1 className="titulo-principal display-5 fw-bold mb-4">¿Qué libro estás buscando?</h1>

          <Row>
            <Col md={8} lg={6}>
              <Form.Group controlId="buscar" className="mb-3">
                <Form.Label className="fw-semibold">Buscá por título, autor o ISBN</Form.Label>
                <Form.Control
                  type="search"
                  size="lg"
                  className="border-2 border-dark rounded-3"
                  placeholder="Ej.: Tanenbaum"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Categorías">
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={cat === categoria ? 'dark' : 'outline-secondary'}
                className="rounded-pill px-3"
                aria-pressed={cat === categoria}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-4 mb-5">
        <p className="text-body-secondary mb-4">
          Mostrando {librosFiltrados.length} de {libros.length} títulos
        </p>

        {librosFiltrados.length > 0 ? (
          <section aria-label="Libros">
            <Row className="g-4">
              {librosFiltrados.map((libro) => (
                <Col key={libro.id} xs={12} sm={6} md={4} lg={3}>
                  <LibroCard
                    id={libro.id}
                    titulo={libro.titulo}
                    autor={libro.autor}
                    isbn={libro.isbn}
                    categoria={libro.categoria}
                    disponibles={libro.disponibles}
                    total={libro.total}
                  >
                    {botonDelLibro(libro)}
                  </LibroCard>
                </Col>
              ))}
            </Row>
          </section>
        ) : (
          <div className="py-4">
            <h2 className="fw-bold">No encontramos ese libro</h2>
            <p className="text-body-secondary">
              Revisá cómo escribiste el título o el autor, o buscá en todas las categorías.
            </p>
            <Button variant="dark" size="lg" onClick={verTodo}>
              Ver todo el catálogo
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}

export default Catalogo
