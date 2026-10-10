import { Fragment, useEffect, useState } from 'react'
import { Container, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useDatos } from '../context/DatosContext'
import { coloresCategoria } from '../data/categorias'
import { buscarLibro, urlTapa, urlObra } from '../services/openLibrary'
import useSEO from '../hooks/useSEO'

function LibroDetalle() {
  const { id } = useParams()
  const { libros } = useDatos()
  const libro = libros.find((l) => l.id === Number(id))

  useSEO(
    libro ? libro.titulo : 'Libro no encontrado',
    libro
      ? `Disponibilidad y datos de "${libro.titulo}", de ${libro.autor}, en la biblioteca de la UTN FRT.`
      : 'El libro que buscás no está en el catálogo de la biblioteca.'
  )

  // Lo que devolvió Open Library, junto con el ISBN del libro al que corresponde
  const [resultado, setResultado] = useState(null)

  const isbn = libro?.isbn
  const titulo = libro?.titulo
  const autor = libro?.autor

  // Se ejecuta al abrir la página y cada vez que se pasa a otro libro
  useEffect(() => {
    if (!titulo) return

    let cancelado = false

    async function cargarDatosExtra() {
      try {
        const info = await buscarLibro({ isbn, titulo, autor })
        if (!cancelado) setResultado({ isbn, info, error: false })
      } catch (err) {
        console.error(err)
        if (!cancelado) {
          setResultado({ isbn, info: null, error: true })
          Swal.fire({
            icon: 'error',
            title: 'No pudimos traer más datos del libro',
            text: 'Hubo un problema al conectarnos con Open Library. Revisá tu conexión e intentá de nuevo.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#1F2125',
          })
        }
      }
    }

    cargarDatosExtra()

    // Limpieza: si se sale de la página antes de que llegue la respuesta, se ignora
    return () => {
      cancelado = true
    }
  }, [isbn, titulo, autor])

  if (!libro) {
    return (
      <Container className="py-5">
        <h1 className="titulo-principal mb-3">No encontramos ese libro</h1>
        <p className="lead mb-4">Puede que el link esté mal escrito o que el libro ya no esté en el catálogo.</p>
        <Link to="/catalogo" className="btn btn-dark btn-lg">Ir al catálogo</Link>
      </Container>
    )
  }

  // Estados derivados de la respuesta
  const esDeEsteLibro = resultado?.isbn === isbn
  const cargando = !esDeEsteLibro
  const info = esDeEsteLibro ? resultado.info : null
  const huboError = esDeEsteLibro && resultado.error
  const tapa = urlTapa(info?.cover_i)
  const hayDisponibles = libro.disponibles > 0

  // Solo se muestran los datos que Open Library tiene
  const datos = info
    ? [
        { etiqueta: 'Primera edición', valor: info.first_publish_year },
        { etiqueta: 'Páginas', valor: info.number_of_pages_median },
        { etiqueta: 'Editoriales', valor: info.publisher?.slice(0, 3).join(', ') },
        { etiqueta: 'Ediciones registradas', valor: info.edition_count },
      ].filter((dato) => dato.valor)
    : []
  const temas = info?.subject?.slice(0, 8) ?? []

  return (
    <>
      <section className="hero-busqueda">
        <Container className="py-5">
          <Link to="/catalogo" className="d-inline-block mb-4 fw-semibold">Volver al catálogo</Link>
          <Row className="g-5 align-items-center">
            <Col xs={8} sm={5} md={4} lg={3}>
              {tapa ? (
                <img
                  src={tapa}
                  alt={`Tapa de ${libro.titulo}`}
                  className="w-100 rounded-3 shadow-sm"
                  style={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="tapa-libro d-flex flex-column justify-content-between text-white"
                  style={{ backgroundColor: coloresCategoria[libro.categoria] || '#3A3C42' }}
                  aria-hidden="true"
                >
                  <span className="small fw-semibold">{libro.categoria}</span>
                  <span className="tapa-titulo">{libro.titulo}</span>
                </div>
              )}
            </Col>
            <Col md={8} lg={9}>
              <h1 className="titulo-principal mb-2">{libro.titulo}</h1>
              <p className="lead mb-4">{libro.autor}</p>
              <p className={`fw-bold mb-1 ${hayDisponibles ? 'text-success' : 'text-danger'}`}>
                {hayDisponibles
                  ? `${libro.disponibles} de ${libro.total} ejemplares disponibles`
                  : `Prestados los ${libro.total} ejemplares`}
              </p>
              <p className="text-body-secondary mb-0">
                Categoría: {libro.categoria}. ISBN {libro.isbn}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        <section aria-labelledby="titulo-mas-datos" className="texto-legible">
          <h2 id="titulo-mas-datos" className="fs-3 fw-bold mb-3">Más datos del libro</h2>

          {cargando && (
            <div className="d-flex align-items-center gap-3 text-body-secondary">
              <Spinner animation="border" size="sm" aria-hidden="true" />
              <span>Buscando datos en Open Library…</span>
            </div>
          )}

          {huboError && (
            <Alert variant="danger" className="mb-0">
              No pudimos traer los datos de Open Library. Recargá la página para intentarlo de nuevo.
            </Alert>
          )}

          {esDeEsteLibro && !huboError && !info && (
            <p className="text-body-secondary mb-0">Open Library no tiene más información sobre este libro.</p>
          )}

          {info && (
            <>
              {datos.length > 0 && (
                <dl className="row mb-4">
                  {datos.map((dato) => (
                    <Fragment key={dato.etiqueta}>
                      <dt className="col-sm-5 col-lg-4 fw-semibold">{dato.etiqueta}</dt>
                      <dd className="col-sm-7 col-lg-8">{dato.valor}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}

              {temas.length > 0 && (
                <div className="mb-4">
                  <h3 className="fs-6 fw-bold mb-2">Temas</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {temas.map((tema) => (
                      <Badge key={tema} pill bg="secondary-subtle" text="secondary-emphasis">{tema}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="small text-body-secondary mb-0">
                Datos de{' '}
                <a href={urlObra(info.key)} target="_blank" rel="noopener noreferrer">Open Library</a>.
                Pueden corresponder a otra edición del mismo libro.
              </p>
            </>
          )}
        </section>
      </Container>
    </>
  )
}

export default LibroDetalle