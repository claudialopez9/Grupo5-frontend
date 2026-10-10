import { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import { fechaHoy, sumarDias, estaVencido, estaEnPoder } from '../utils/fechas'

const DatosContext = createContext(null)

const CLAVE_REGISTROS = 'bibliofrt-registros'
const CLAVE_PRESTAMOS = 'bibliofrt-prestamos'
const CLAVE_LIBROS = 'bibliofrt-libros'

// Reglas de la biblioteca
const DIAS_DE_PRESTAMO = 14
const DIAS_DE_RENOVACION = 7
const MAXIMO_PRESTAMOS = 3

// Alumnos y usuarios que se registraron desde la página (quedan en este navegador)
function leerRegistros() {
  const guardados = localStorage.getItem(CLAVE_REGISTROS)
  return guardados ? JSON.parse(guardados) : { alumnos: [], usuarios: [] }
}

// Lee algo guardado en localStorage, o devuelve null si no hay nada
function leerGuardado(clave) {
  const guardado = localStorage.getItem(clave)
  return guardado ? JSON.parse(guardado) : null
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

  // 1) Al cargar la app: trae los JSON (o lo guardado en el navegador, si ya hubo cambios)
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
        setLibros(leerGuardado(CLAVE_LIBROS) ?? datosLibros)
        setAlumnos([...datosAlumnos, ...registros.alumnos])
        setPrestamos(leerGuardado(CLAVE_PRESTAMOS) ?? datosPrestamos)
        setUsuarios([...datosUsuarios, ...registros.usuarios])
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  // 2) Cada vez que cambian los préstamos, se guardan en el navegador
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem(CLAVE_PRESTAMOS, JSON.stringify(prestamos))
    }
  }, [prestamos, cargando])

  // 3) Cada vez que cambian los libros (ejemplares disponibles), se guardan en el navegador
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem(CLAVE_LIBROS, JSON.stringify(libros))
    }
  }, [libros, cargando])

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

  // Suma o resta ejemplares disponibles de un libro, sin pasar de 0 ni del total
  function cambiarDisponibles(libroId, cambio) {
    setLibros((anteriores) =>
      anteriores.map((libro) =>
        libro.id === libroId
          ? { ...libro, disponibles: Math.min(Math.max(libro.disponibles + cambio, 0), libro.total) }
          : libro
      )
    )
  }

  // Revisa las reglas. Devuelve el motivo si no se puede prestar, o null si está todo bien
  function validarPrestamo(alumnoId, libroId) {
    const libro = libros.find((l) => l.id === libroId)
    if (!libro) return 'No encontramos ese libro.'
    if (libro.disponibles === 0) return 'No quedan ejemplares disponibles de este libro.'

    const delAlumno = prestamos.filter((p) => p.alumnoId === alumnoId && p.estado !== 'Devuelto')
    if (delAlumno.some((p) => estaVencido(p))) {
      return 'Hay un préstamo vencido sin devolver. Hasta que se devuelva no se pueden pedir otros libros.'
    }
    if (delAlumno.length >= MAXIMO_PRESTAMOS) {
      return `Se llegó al máximo de ${MAXIMO_PRESTAMOS} libros al mismo tiempo.`
    }
    if (delAlumno.some((p) => p.libroId === libroId)) {
      return 'Este libro ya está pedido o prestado a este alumno.'
    }
    return null
  }

  // El alumno pide un libro desde la web: queda "Pendiente" y el ejemplar se reserva
  function solicitarPrestamo(alumnoId, libroId) {
    const problema = validarPrestamo(alumnoId, libroId)
    if (problema) return { ok: false, mensaje: problema }

    const nuevo = {
      id: Date.now(),
      alumnoId,
      libroId,
      fechaSolicitud: fechaHoy(),
      fechaPrestamo: null,
      fechaDevolucion: null,
      estado: 'Pendiente',
    }
    setPrestamos((anteriores) => [...anteriores, nuevo])
    cambiarDisponibles(libroId, -1)
    return { ok: true }
  }

  // El bibliotecario entrega el libro pedido: pasa a "Activo" con devolución a 14 días
  function entregarPrestamo(prestamoId) {
    const hoy = fechaHoy()
    setPrestamos((anteriores) =>
      anteriores.map((p) =>
        p.id === prestamoId && p.estado === 'Pendiente'
          ? { ...p, estado: 'Activo', fechaPrestamo: hoy, fechaDevolucion: sumarDias(hoy, DIAS_DE_PRESTAMO) }
          : p
      )
    )
  }

  // Se cancela una solicitud que nunca se retiró: se borra y el ejemplar vuelve a estar disponible
  function cancelarSolicitud(prestamoId) {
    const prestamo = prestamos.find((p) => p.id === prestamoId)
    if (!prestamo || prestamo.estado !== 'Pendiente') return

    setPrestamos((anteriores) => anteriores.filter((p) => p.id !== prestamoId))
    cambiarDisponibles(prestamo.libroId, 1)
  }

  // Préstamo en el mostrador (sin pedido previo por la web): queda "Activo" directamente
  function registrarPrestamoDirecto(alumnoId, libroId) {
    const problema = validarPrestamo(alumnoId, libroId)
    if (problema) return { ok: false, mensaje: problema }

    const hoy = fechaHoy()
    const nuevo = {
      id: Date.now(),
      alumnoId,
      libroId,
      fechaSolicitud: hoy,
      fechaPrestamo: hoy,
      fechaDevolucion: sumarDias(hoy, DIAS_DE_PRESTAMO),
      estado: 'Activo',
    }
    setPrestamos((anteriores) => [...anteriores, nuevo])
    cambiarDisponibles(libroId, -1)
    return { ok: true, prestamo: nuevo }
  }

  // El alumno devuelve el libro: queda "Devuelto" y el ejemplar vuelve a estar disponible
  function registrarDevolucion(prestamoId) {
    const prestamo = prestamos.find((p) => p.id === prestamoId)
    if (!prestamo || !estaEnPoder(prestamo)) return

    setPrestamos((anteriores) =>
      anteriores.map((p) =>
        p.id === prestamoId ? { ...p, estado: 'Devuelto', fechaDevolucionReal: fechaHoy() } : p
      )
    )
    cambiarDisponibles(prestamo.libroId, 1)
  }

  // El alumno extiende la devolución 7 días, una sola vez y si no está vencido
  function renovarPrestamo(prestamoId) {
    const prestamo = prestamos.find((p) => p.id === prestamoId)
    if (!prestamo || prestamo.estado !== 'Activo') {
      return { ok: false, mensaje: 'Solo se pueden renovar préstamos activos.' }
    }
    if (estaVencido(prestamo)) {
      return { ok: false, mensaje: 'El préstamo ya venció. Acercate a la biblioteca para devolverlo.' }
    }
    if (prestamo.renovado) {
      return { ok: false, mensaje: 'Este préstamo ya se renovó una vez.' }
    }

    const nuevaFecha = sumarDias(prestamo.fechaDevolucion, DIAS_DE_RENOVACION)
    setPrestamos((anteriores) =>
      anteriores.map((p) => (p.id === prestamoId ? { ...p, fechaDevolucion: nuevaFecha, renovado: true } : p))
    )
    return { ok: true, nuevaFecha }
  }

  // Borra los cambios guardados y vuelve a los datos originales de los JSON
  function restablecerDatos() {
    localStorage.removeItem(CLAVE_PRESTAMOS)
    localStorage.removeItem(CLAVE_LIBROS)
    window.location.reload()
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
    <DatosContext.Provider
      value={{
        libros,
        alumnos,
        prestamos,
        usuarios,
        agregarRegistro,
        solicitarPrestamo,
        entregarPrestamo,
        cancelarSolicitud,
        registrarPrestamoDirecto,
        registrarDevolucion,
        renovarPrestamo,
        restablecerDatos,
      }}
    >
      {children}
    </DatosContext.Provider>
  )
}

export function useDatos() {
  return useContext(DatosContext)
}
