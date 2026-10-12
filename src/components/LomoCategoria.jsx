import { colorDeCategoria } from '../data/categorias'

// Franja finita con el color de la categoría del libro (listas y tablas de préstamos)
function LomoCategoria({ categoria }) {
  return (
    <span
      className="lomo-mini rounded-1 flex-shrink-0"
      style={{ backgroundColor: colorDeCategoria(categoria) }}
      aria-hidden="true"
    ></span>
  )
}

export default LomoCategoria
