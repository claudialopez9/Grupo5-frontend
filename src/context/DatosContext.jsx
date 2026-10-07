import { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'

const DatosContext = createContext(null)
const CLAVE_REGISTROS = 'bibliofrt-registros'

// Alumnos y usuarios que se registraron desde la página (quedan en este navegador)
function leerRegistros() {
  const guardados = localStorage.getItem(CLAVE_REGISTROS)
  return guardados ? JSON.parse(guardados) : { alumnos: [], usuarios: [] }
}

// Pide un archivo JSON y avisa si la respuesta no fue exitosa
async function pedirJSON(ruta) {
  const respuesta = await fetch(ruta)
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${ruta} (código ${respuesta.status})`)
  }
  return respuesta.json()
}

export function DatosProvider({ children }) {
  const [libros, setLibros] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [prestamos, setPrestamos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [datosLibros, datosAlumnos, datosPrestamos, datosUsuarios] = await Promise.all([
          pedirJSON('/data/libros.json'),
          pedirJSON('/data/alumnos.json'),
          pedirJSON('/data/prestamos.json'),
          pedirJSON('/data/usuarios.json'),
        ])
        const registros = leerRegistros()
        setLibros(datosLibros)
        setAlumnos([...datosAlumnos, ...registros.alumnos])
        setPrestamos(datosPrestamos)
        setUsuarios([...datosUsuarios, ...registros.usuarios])
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  function agregarRegistro({ nombre, apellido, legajo, correo, carrera, password }) {
    const id = Date.now()
    const nuevoAlumno = { id, nombre, apellido, legajo, carrera, correo }
    const nuevoUsuario = { id, usuario: legajo, password, rol: 'alumno', alumnoId: id }

    setAlumnos((anteriores) => [...anteriores, nuevoAlumno])
    setUsuarios((anteriores) => [...anteriores, nuevoUsuario])

    const registros = leerRegistros()
    localStorage.setItem(
      CLAVE_REGISTROS,
      JSON.stringify({
        alumnos: [...registros.alumnos, nuevoAlumno],
        usuarios: [...registros.usuarios, nuevoUsuario],
      })
    )
    return { nuevoAlumno, nuevoUsuario }
  }

  if (cargando) {
    return (
      <div className="d-flex justify-content-center py-5 my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando datos de la biblioteca…</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading as="h1" className="fs-4">No pudimos cargar los datos</Alert.Heading>
          <p className="mb-0">{error}. Recargá la página para intentarlo de nuevo.</p>
        </Alert>
      </Container>
    )
  }

  return (
    <DatosContext.Provider value={{ libros, alumnos, prestamos, usuarios, agregarRegistro }}>
      {children}
    </DatosContext.Provider>
  )
}

export function useDatos() {
  return useContext(DatosContext)
}