import { coloresCategoria } from '../data/categorias'

function LibroCard({ titulo, autor, isbn, categoria, disponibles, total }) {
  const hayDisponibles = disponibles > 0
  const color = coloresCategoria[categoria] || '#3A3C42'

  // Un elemento por ejemplar: true si está en la biblioteca, false si está prestado
  const ejemplares = Array.from({ length: total }, (_, i) => i < disponibles)

  return (
    <article className="d-flex flex-column gap-3 h-100">
      <div
        className="tapa-libro d-flex flex-column justify-content-between text-white"
        style={{ backgroundColor: color }}
      >
        <span className="small fw-semibold">{categoria}</span>
        <div className="d-flex flex-column gap-2">
          <h2 className="tapa-titulo mb-0">{titulo}</h2>
          <span className="fw-medium">{autor}</span>
        </div>
      </div>

      <div className="d-flex flex-column gap-1">
        <div className="d-flex align-items-center gap-2">
          <span className="d-flex gap-1" aria-hidden="true">
            {ejemplares.map((estaDisponible, i) => (
              <span
                key={i}
                className={`punto-ejemplar ${estaDisponible ? 'bg-success' : 'punto-vacio'}`}
              />
            ))}
          </span>
          <span className={`fw-bold ${hayDisponibles ? 'text-success' : 'text-danger'}`}>
            {hayDisponibles
              ? `${disponibles} de ${total} disponibles`
              : `Prestados los ${total}`}
          </span>
        </div>
        <span className="small text-body-secondary">ISBN {isbn}</span>
      </div>
    </article>
  )
}

export default LibroCard