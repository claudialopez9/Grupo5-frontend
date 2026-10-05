function AlumnosCard({ nombre, apellido, legajo, carrera, prestamosActivos }) {
  const iniciales = `${nombre[0]}${apellido[0]}`

  let textoPrestamos = `${prestamosActivos} préstamos activos`
  if (prestamosActivos === 0) textoPrestamos = 'Sin préstamos activos'
  if (prestamosActivos === 1) textoPrestamos = '1 préstamo activo'

  return (
    <article className="carnet h-100 d-flex flex-column">
      <div className="carnet-franja d-flex align-items-center justify-content-between px-3 py-2 text-white">
        <span className="fw-bold">BiblioFRT</span>
        <span className="small">Carnet de biblioteca</span>
      </div>

      <div className="p-3 d-flex align-items-center gap-3 flex-grow-1">
        <span className="avatar-iniciales" aria-hidden="true">{iniciales}</span>
        <div>
          <h2 className="fs-5 fw-bold mb-0">{nombre} {apellido}</h2>
          <p className="mb-0 text-body-secondary">{carrera}</p>
        </div>
      </div>

      <div className="px-3 py-2 border-top d-flex justify-content-between gap-2 small">
        <span>Legajo <strong>{legajo}</strong></span>
        <span className={prestamosActivos > 0 ? 'fw-semibold' : 'text-body-secondary'}>
          {textoPrestamos}
        </span>
      </div>
    </article>
  )
}

export default AlumnosCard