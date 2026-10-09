import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import LibroCard from '../components/LibroCard'
import { useDatos } from '../context/DatosContext'
import { useSesion } from '../context/SesionContext'
import useSEO from '../hooks/useSEO'

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
    return prestamos.some(
      (p) => p.alumnoId === usuario.alumnoId && p.libroId === libroId && p.estado !== 'Devuelto'
    )
  }

  function manejarSolicitud(libro) {
    Swal.fire({
      icon: 'question',
      title: '¿Pedir este libro?',
      text: `Te reservamos un ejemplar de "${libro.titulo}" para que lo retires en la biblioteca.`,
      showCancelButton: true,
      confirmButtonText: 'Pedir libro',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#1F2125',
    }).then((respuesta) => {
      if (!respuesta.isConfirmed) return

      const resultado = solicitarPrestamo(usuario.alumnoId, libro.id)
      if (resultado.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Te reservamos el libro',
          text: 'Pasá a retirarlo por la biblioteca. Lo vas a ver en Mi biblioteca, en "Para retirar".',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1F2125',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No pudimos reservar el libro',
          text: resultado.mensaje,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1F2125',
        })
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
      return <Button variant="outline-secondary" className="w-100" disabled>Ya lo pediste</Button>
    }
    if (libro.disponibles === 0) {
      return <Button variant="outline-secondary" className="w-100" disabled>Sin ejemplares</Button>
    }
    return (
      <Button variant="dark" className="w-100" onClick={() => manejarSolicitud(libro)}>
        Pedir prestado
      </Button>
    )
  }

  return (
    <>
      <section className="hero-busqueda" aria-label="Buscar">
        <Container className="py-5">
          <h1 className="titulo-principal mb-4">¿Qué libro estás buscando?</h1>

          <Form.Group controlId="buscar" className="buscador mb-3">
            <Form.Label className="fw-semibold">Buscá por título, autor o ISBN</Form.Label>
            <Form.Control
              type="search"
              size="lg"
              placeholder="Ej.: Tanenbaum"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Form.Group>

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
