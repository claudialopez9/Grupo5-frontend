import { colorDeCategoria } from '../data/categorias'

// Tapa generada con el color de la categoría (se usa cuando no hay foto de la tapa).
// "etiquetaTitulo" permite que el título sea un h2 (en el catálogo) o un span (cuando ya hay un h1)
function TapaLibro({ titulo, autor, categoria, etiquetaTitulo: EtiquetaTitulo = 'span', ...resto }) {
  return (
    <div
      className="tapa-libro con-lomo d-flex flex-column justify-content-between text-white p-3 ps-4"
      style={{ backgroundColor: colorDeCategoria(categoria) }}
      {...resto}
    >
      <span className="small fw-semibold">{categoria}</span>
      <div className="d-flex flex-column gap-2">
        <EtiquetaTitulo className="fs-4 fw-bold lh-sm mb-0">{titulo}</EtiquetaTitulo>
        {autor && <span className="fw-medium">{autor}</span>}
      </div>
    </div>
  )
}

export default TapaLibro
