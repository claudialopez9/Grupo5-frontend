// Color de cada categoría (tapas, lomos y franjas de color)
export const coloresCategoria = {
  Programación: '#3451C7',
  Ingeniería: '#B8480B',
  Matemática: '#0E7C62',
  'Bases de datos': '#6E45B5',
  Sistemas: '#17708D',
  Física: '#B03A61',
}

// Color para libros sin categoría conocida (por ejemplo, resultados de Open Library)
const COLOR_SIN_CATEGORIA = '#3A3C42'

export function colorDeCategoria(categoria) {
  return coloresCategoria[categoria] || COLOR_SIN_CATEGORIA
}
