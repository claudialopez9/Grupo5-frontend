import axios from 'axios'

// Pide un archivo JSON de la carpeta public/data.
// Si falla, Axios lanza un error que atrapa el try/catch del useEffect que lo llamó
async function pedirJSON(ruta) {
  const response = await axios.get(ruta)
  return response.data
}

// Trae los cuatro archivos de la biblioteca al mismo tiempo
export async function cargarDatosIniciales() {
  const [libros, alumnos, prestamos, usuarios] = await Promise.all([
    pedirJSON('/data/libros.json'),
    pedirJSON('/data/alumnos.json'),
    pedirJSON('/data/prestamos.json'),
    pedirJSON('/data/usuarios.json'),
  ])
  return { libros, alumnos, prestamos, usuarios }
}
