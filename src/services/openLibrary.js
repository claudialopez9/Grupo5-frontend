import axios from 'axios'

// Las direcciones salen del archivo .env (nunca se escriben en los componentes)
const API_URL = import.meta.env.VITE_API_URL
const COVERS_URL = import.meta.env.VITE_COVERS_URL

// Datos que le pedimos a Open Library de cada libro
const CAMPOS = 'key,title,author_name,first_publish_year,number_of_pages_median,publisher,subject,cover_i,edition_count'

// "Sears y Zemansky" -> "Sears" (Open Library busca mejor con un solo autor)
function primerAutor(autor) {
  return autor.split(' y ')[0]
}

// Busca un libro en Open Library. Prueba tres formas y devuelve el primer resultado, o null si no lo encuentra
export async function buscarLibro({ isbn, titulo, autor }) {
  const intentos = [
    { isbn },
    { title: titulo, author: primerAutor(autor) },
    { q: `${titulo} ${primerAutor(autor)}` },
  ]

  for (const filtro of intentos) {
    const response = await axios.get(`${API_URL}/search.json`, {
      params: { ...filtro, limit: 1, fields: CAMPOS },
    })
    if (response.data.docs.length > 0) {
      return response.data.docs[0]
    }
  }
  return null
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