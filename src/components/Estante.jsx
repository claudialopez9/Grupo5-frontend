// Estante de libros: lomos de colores parados sobre una tabla.
// Cada lomo es { id, titulo, color, alto, ancho, vacio }. "vacio: true" dibuja un hueco punteado.
// Si no recibe "etiqueta", el estante es decorativo y los lectores de pantalla lo saltean.
function Estante({ lomos, etiqueta }) {
  return (
    <div className="mw-100">
      <ul
        className="list-unstyled d-flex align-items-end gap-2 px-2 mb-0 overflow-x-auto"
        aria-label={etiqueta}
        aria-hidden={etiqueta ? undefined : true}
      >
        {lomos.map((lomo) => (
          <li
            key={lomo.id}
            className={
              lomo.vacio
                ? 'lomo-vacio rounded-1 flex-shrink-0'
                : 'lomo-vertical con-lomo d-flex align-items-center flex-shrink-0 py-3 rounded-1 text-white small fw-bold lh-sm'
            }
            style={{ backgroundColor: lomo.color, height: `${lomo.alto}px`, width: `${lomo.ancho}px` }}
          >
            {lomo.titulo}
          </li>
        ))}
      </ul>
      <div className="py-1 bg-dark rounded-1" aria-hidden="true"></div>
    </div>
  )
}

export default Estante
