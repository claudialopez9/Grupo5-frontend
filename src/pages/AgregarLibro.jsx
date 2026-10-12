import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TapaLibro from '../components/TapaLibro'
import useDatos from '../hooks/useDatos'
import useSEO from '../hooks/useSEO'
import { coloresCategoria } from '../data/categorias'
import { buscarEnOpenLibrary, urlTapa } from '../services/openLibrary'
import { informar, mostrarError } from '../utils/alertas'

const categorias = Object.keys(coloresCategoria)
const formularioVacio = { isbn: '', categoria: '', total: '1' }

// Elige un ISBN de 13 dígitos si hay; si no, el primero que tenga
function elegirIsbn(libro) {
  return libro.isbn?.find((isbn) => isbn.length === 13) ?? libro.isbn?.[0] ?? ''
}

function AgregarLibro() {
  useSEO('Agregar libros', 'Buscá libros en Open Library y sumalos al catálogo de la biblioteca.')

  const { libros, agregarLibro } = useDatos()

  const [texto, setTexto] = useState('')
  const [consulta, setConsulta] = useState('')
  const [busqueda, setBusqueda] = useState(null)
  const [elegido, setElegido] = useState(null)
  const [formulario, setFormulario] = useState(formularioVacio)

  // Se ejecuta cada vez que cambia la consulta (cuando se toca "Buscar")
  useEffect(() => {
    if (!consulta) return

    let cancelado = false

    async function buscar() {
      try {
        const resultados = await buscarEnOpenLibrary(consulta)
        if (!cancelado) setBusqueda({ consulta, resultados, error: false })
      } catch (err) {
        console.error(err)
        if (!cancelado) {
          setBusqueda({ consulta, resultados: [], error: true })
          mostrarError(
            'No pudimos buscar en Open Library',
            'Hubo un problema de conexión. Revisá tu internet e intentá de nuevo.'
          )
        }
      }
    }

    buscar()

    return () => {
      cancelado = true
    }
  }, [consulta])

  // Estados derivados de la búsqueda
  const esDeEstaConsulta = busqueda?.consulta === consulta
  const cargando = consulta !== '' && !esDeEstaConsulta
  const resultados = esDeEstaConsulta ? busqueda.resultados : []
  const huboError = esDeEstaConsulta && busqueda.error
  const isbnsDelCatalogo = new Set(libros.map((libro) => libro.isbn))

  function yaEstaEnCatalogo(libro) {
    return libro.isbn?.some((isbn) => isbnsDelCatalogo.has(isbn)) ?? false
  }

  function manejarBusqueda(e) {
    e.preventDefault()
    setConsulta(texto.trim())
  }

  function abrirFormulario(libro) {
    setElegido(libro)
    setFormulario({ ...formularioVacio, isbn: elegirIsbn(libro) })
  }

  function cerrarFormulario() {
    setElegido(null)
    setFormulario(formularioVacio)
  }

  function actualizarCampo(e) {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
  }

  function manejarAlta(e) {
    e.preventDefault()
    const autores = elegido.author_name?.slice(0, 2).join(' y ') ?? 'Autor desconocido'
    const resultado = agregarLibro({
      titulo: elegido.title,
      autor: autores,
      isbn: formulario.isbn.trim(),
      categoria: formulario.categoria,
      total: Number(formulario.total),
    })

    if (!resultado.ok) {
      mostrarError('No se pudo agregar el libro', resultado.mensaje)
      return
    }

    cerrarFormulario()
    informar(
      'Libro agregado',
      `"${resultado.libro.titulo}" ya está en el catálogo con ${resultado.libro.total} ejemplares.`
    )
  }

  return (
    <>
      <section className="bg-body-tertiary">
        <Container className="py-5">
          <Link to="/panel" className="d-inline-block mb-4 fw-semibold">
            Volver al panel
          </Link>
          <h1 className="titulo-principal display-5 fw-bold mb-3">Agregar libros</h1>
          <p className="lead mb-4">Buscá en Open Library el libro que llegó a la biblioteca y sumalo al catálogo.</p>
          <Row>
            <Col md={8} lg={6}>
              <Form onSubmit={manejarBusqueda}>
                <Form.Group controlId="buscar-open-library">
                  <Form.Label className="fw-semibold">Título, autor o tema</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="search"
                      size="lg"
                      required
                      minLength={3}
                      placeholder="Ej.: algoritmos, Kernighan, redes"
                      className="border-2 border-dark rounded-3"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                    />
                    <Button type="submit" variant="dark" size="lg">
                      Buscar
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        {consulta === '' && <p className="text-body-secondary">Escribí un título, autor o tema y tocá Buscar.</p>}

        {cargando && (
          <div className="d-flex align-items-center gap-3 text-body-secondary">
            <Spinner animation="border" size="sm" aria-hidden="true" />
            <span>Buscando en Open Library…</span>
          </div>
        )}

        {esDeEstaConsulta && !huboError && resultados.length === 0 && (
          <p className="text-body-secondary">No encontramos libros para "{consulta}". Probá con otras palabras.</p>
        )}

        {resultados.length > 0 && (
          <section aria-label="Resultados de Open Library">
            <p className="text-body-secondary mb-4">
              {resultados.length} resultados para "{consulta}"
            </p>
            <Row className="g-4">
              {resultados.map((libro) => {
                const tapa = urlTapa(libro.cover_i, 'M')
                const enCatalogo = yaEstaEnCatalogo(libro)
                return (
                  <Col key={libro.key} xs={6} md={4} lg={3}>
                    <article className="d-flex flex-column gap-2 h-100">
                      {tapa ? (
                        <img
                          src={tapa}
                          alt={`Tapa de ${libro.title}`}
                          loading="lazy"
                          className="proporcion-tapa object-fit-cover w-100 rounded-3 bg-body-secondary"
                        />
                      ) : (
                        <TapaLibro titulo={libro.title} aria-hidden="true" />
                      )}
                      <h2 className="fs-6 fw-bold mb-0">{libro.title}</h2>
                      <p className="small text-body-secondary mb-0">
                        {libro.author_name?.slice(0, 2).join(', ') ?? 'Autor desconocido'}
                        {libro.first_publish_year ? `, ${libro.first_publish_year}` : ''}
                      </p>
                      <div className="mt-auto pt-2">
                        {enCatalogo ? (
                          <Button variant="outline-secondary" size="sm" className="w-100" disabled>
                            Ya está en el catálogo
                          </Button>
                        ) : (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            className="w-100"
                            onClick={() => abrirFormulario(libro)}
                          >
                            Agregar al catálogo
                          </Button>
                        )}
                      </div>
                    </article>
                  </Col>
                )
              })}
            </Row>
          </section>
        )}
      </Container>

      <Modal show={elegido !== null} onHide={cerrarFormulario} centered enforceFocus={false}>
        {elegido && (
          <Form onSubmit={manejarAlta}>
            <Modal.Header closeButton>
              <Modal.Title as="h2" className="fs-4 fw-bold">
                Agregar al catálogo
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="fw-semibold mb-1">{elegido.title}</p>
              <p className="small text-body-secondary mb-4">
                {elegido.author_name?.slice(0, 2).join(' y ') ?? 'Autor desconocido'}
              </p>

              <Form.Group className="mb-3" controlId="alta-isbn">
                <Form.Label className="fw-semibold">ISBN</Form.Label>
                <Form.Control
                  type="text"
                  name="isbn"
                  required
                  pattern="[0-9]{10}|[0-9]{13}"
                  title="El ISBN tiene 10 o 13 números, sin guiones."
                  value={formulario.isbn}
                  onChange={actualizarCampo}
                />
                <Form.Text>10 o 13 números, sin guiones. Revisalo con el del libro físico.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="alta-categoria">
                <Form.Label className="fw-semibold">Categoría</Form.Label>
                <Form.Select name="categoria" required value={formulario.categoria} onChange={actualizarCampo}>
                  <option value="">Elegí una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="alta-total">
                <Form.Label className="fw-semibold">Cantidad de ejemplares</Form.Label>
                <Form.Control
                  type="number"
                  name="total"
                  required
                  min={1}
                  max={20}
                  value={formulario.total}
                  onChange={actualizarCampo}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={cerrarFormulario}>
                Cancelar
              </Button>
              <Button type="submit" variant="dark">
                Agregar libro
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </>
  )
}

export default AgregarLibro
