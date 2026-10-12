import { Container, Row, Col } from 'react-bootstrap'
import useSEO from '../hooks/useSEO'
import { colorDeCategoria } from '../data/categorias'

const bloques = [
  {
    id: 1,
    titulo: 'El proyecto',
    color: colorDeCategoria('Ingeniería'),
    texto:
      'Nace con el objetivo de aplicar de forma integral lo aprendido en la carrera: desarrollo frontend, diseño de bases de datos relacionales y trabajo colaborativo con control de versiones.',
  },
  {
    id: 2,
    titulo: 'El problema que resuelve',
    color: colorDeCategoria('Programación'),
    texto:
      'En las bibliotecas académicas, libros, socios y préstamos suelen gestionarse con planillas dispersas y registros manuales. Eso genera errores, pérdida de información y dificultad para seguir devoluciones y vencimientos. BiblioFRT centraliza todo en un solo sistema.',
  },
  {
    id: 3,
    titulo: 'Hacia dónde va',
    color: colorDeCategoria('Matemática'),
    texto:
      'Lo encaramos como un proyecto real, no como un ejercicio aislado: una base funcional que pueda crecer hasta ser una herramienta que use la propia universidad.',
  },
]

const integrantes = [
  { nombre: 'Esteban Nájera', foto: '/img/esteban.jpeg' },
  { nombre: 'Magali Guerrero', foto: '/img/maga.jpeg' },
  { nombre: 'Claudia Lopez', foto: '/img/clau.jpeg' },
]

function SobreNosotros() {
  useSEO(
    'Sobre nosotros',
    'Conocé al equipo que desarrolla BiblioFRT, el sistema de gestión de la biblioteca de la UTN Facultad Regional Tucumán.'
  )

  return (
    <>
      <section className="bg-body-tertiary">
        <Container className="py-5">
          <h1 className="titulo-principal display-5 fw-bold mb-3">Tres estudiantes, una biblioteca</h1>
          <Row>
            <Col lg={8}>
              <p className="lead mb-0">
                BiblioFRT es el Trabajo Final Integrador de la carrera de Programación de la UTN Facultad Regional
                Tucumán, hecho por un equipo de tres estudiantes.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5 mb-4">
        <section aria-label="Sobre el proyecto" className="mb-5">
          <Row className="g-4">
            {bloques.map((bloque) => (
              <Col key={bloque.id} xs={12} md={4}>
                <article className="card h-100 rounded-3 overflow-hidden">
                  <div
                    className="con-lomo d-flex align-items-end text-white p-4 ps-5"
                    style={{ backgroundColor: bloque.color }}
                  >
                    <h2 className="fs-4 fw-bold lh-sm mb-0">{bloque.titulo}</h2>
                  </div>
                  <p className="p-4 mb-0">{bloque.texto}</p>
                </article>
              </Col>
            ))}
          </Row>
        </section>

        <section aria-labelledby="titulo-equipo">
          <h2 id="titulo-equipo" className="fs-2 fw-bold mb-4">
            El equipo
          </h2>
          <Row className="g-4">
            {integrantes.map((persona) => (
              <Col key={persona.nombre} xs={12} md={4}>
                <article className="card h-100 rounded-4 overflow-hidden">
                  <div className="bg-primary d-flex justify-content-between px-3 py-2 text-white small">
                    <span className="fw-bold">BiblioFRT</span>
                    <span>Grupo 5</span>
                  </div>
                  <div className="d-flex flex-column align-items-center gap-3 px-3 py-4">
                    <img
                      src={persona.foto}
                      alt={persona.nombre}
                      width={140}
                      height={140}
                      loading="lazy"
                      className="rounded-circle object-fit-cover p-1 border border-2 border-primary"
                    />
                    <h3 className="fs-5 fw-bold mb-0 text-center">{persona.nombre}</h3>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </>
  )
}

export default SobreNosotros
