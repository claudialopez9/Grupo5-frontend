import { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import LibroCard from '../components/LibroCard'
import { libros } from '../data/libros'
import useSEO from '../hooks/useSEO'

// Lista de categorías sin repetir, con "Todas" al principio
const categorias = ['Todas', ...new Set(libros.map((libro) => libro.categoria))]

function Catalogo() {
  useSEO('Catálogo de libros', 'Consultá el catálogo de la biblioteca de la UTN y la disponibilidad de cada libro.')

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  const texto = busqueda.trim().toLowerCase()

  const librosFiltrados = libros.filter((libro) => {
    const coincideCategoria = categoria === 'Todas' || libro.categoria === categoria
    const coincideTexto = `${libro.titulo} ${libro.autor} ${libro.isbn}`
      .toLowerCase()
      .includes(texto)
    return coincideCategoria && coincideTexto
  })

  function verTodo() {
    setBusqueda('')
    setCategoria('Todas')
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
                  />
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