import axios from 'axios'

// Las direcciones salen del archivo .env (nunca se escriben en los componentes)
const API_URL = import.meta.env.VITE_API_URL
const COVERS_URL = import.meta.env.VITE_COVERS_URL

// Datos que le pedimos a Open Library de cada libro
const CAMPOS =
  'key,title,author_name,first_publish_year,number_of_pages_median,publisher,subject,cover_i,edition_count,isbn'

// "Sears y Zemansky" -> "Sears" (Open Library busca mejor con un solo autor)
function primerAutor(autor) {
  return autor.split(' y ')[0]
}

// Hace una búsqueda en Open Library y devuelve el primer resultado, o null si no encontró nada
async function buscarPrimero(filtro) {
  const response = await axios.get(`${API_URL}/search.json`, {
    params: { ...filtro, limit: 1, fields: CAMPOS },
  })
  return response.data.docs[0] ?? null
}

// Busca un libro del catálogo probando tres formas, una después de la otra.
// Si una encuentra el libro, ya no se hacen las siguientes. Si hay un error de conexión,
// Axios lo lanza y lo atrapa el try/catch del useEffect que llamó a esta función
export async function buscarLibro({ isbn, titulo, autor }) {
  const autorPrincipal = primerAutor(autor)

  const porIsbn = await buscarPrimero({ isbn })
  if (porIsbn) return porIsbn

  const porTituloYAutor = await buscarPrimero({ title: titulo, author: autorPrincipal })
  if (porTituloYAutor) return porTituloYAutor

  return buscarPrimero({ q: `${titulo} ${autorPrincipal}` })
}

// Búsqueda libre (título, autor o tema) para incorporar libros nuevos al catálogo
export async function buscarEnOpenLibrary(texto) {
  const response = await axios.get(`${API_URL}/search.json`, {
    params: { q: texto, limit: 12, fields: CAMPOS },
  })
  return response.data.docs
}

// Dirección de la imagen de la tapa ('S' chica, 'M' mediana, 'L' grande)
export function urlTapa(coverId, tamanio = 'L') {
  if (!coverId) return null
  return `${COVERS_URL}/b/id/${coverId}-${tamanio}.jpg`
}

// Dirección de la página del libro en Open Library
export function urlObra(key) {
  return `${API_URL}${key}`
}
