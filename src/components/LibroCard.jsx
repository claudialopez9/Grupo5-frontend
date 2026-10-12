import { Link } from 'react-router-dom'
import TapaLibro from './TapaLibro'

function LibroCard({ id, titulo, autor, isbn, categoria, disponibles, total, children }) {
  const hayDisponibles = disponibles > 0

  // Un elemento por ejemplar: true si está en la biblioteca, false si está prestado
  const ejemplares = Array.from({ length: total }, (_, i) => i < disponibles)

  return (
    <article className="d-flex flex-column gap-3 h-100">
      <Link to={`/catalogo/${id}`} className="text-decoration-none">
        <TapaLibro titulo={titulo} autor={autor} categoria={categoria} etiquetaTitulo="h2" />
      </Link>

      <div className="d-flex flex-column gap-1">
        <div className="d-flex align-items-center gap-2">
          <span className="d-flex gap-1" aria-hidden="true">
            {ejemplares.map((estaDisponible, i) => (
              <span
                key={i}
                className={`punto-ejemplar d-block rounded-circle ${
                  estaDisponible ? 'bg-success' : 'border border-2 border-secondary-subtle'
                }`}
              />
            ))}
          </span>
          <span className={`fw-bold ${hayDisponibles ? 'text-success' : 'text-danger'}`}>
            {hayDisponibles ? `${disponibles} de ${total} disponibles` : `Prestados los ${total}`}
          </span>
        </div>
        <span className="small text-body-secondary">ISBN {isbn}</span>
        <Link to={`/catalogo/${id}`} className="small fw-semibold">
          Ver detalle
        </Link>
      </div>

      {children && <div className="mt-auto">{children}</div>}
    </article>
  )
}

export default LibroCard
