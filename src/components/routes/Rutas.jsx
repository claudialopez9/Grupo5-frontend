import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Spinner, Alert } from 'react-bootstrap'
import AppNavbar from '../AppNavbar'
import RutaProtegida from './RutaProtegida'
import Inicio from '../../pages/Inicio'
import Catalogo from '../../pages/Catalogo'
import LibroDetalle from '../../pages/LibroDetalle'
import Alumnos from '../../pages/Alumnos'
import Prestamos from '../../pages/Prestamos'
import SobreNosotros from '../../pages/SobreNosotros'
import Ingresar from '../../pages/Ingresar'
import Registrarse from '../../pages/Registrarse'
import Panel from '../../pages/Panel'
import AgregarLibro from '../../pages/AgregarLibro'
import MiBiblioteca from '../../pages/MiBiblioteca'
import NotFound from '../../pages/NotFound'
import { cargarDatosIniciales } from '../../services/datosBiblioteca'
import { fechaHoy, sumarDias, estaVencido, estaEnPoder } from '../../utils/fechas'
import { DIAS_DE_PRESTAMO, DIAS_DE_RENOVACION, validarPrestamo, armarSesion } from '../../utils/reglas'
import {
  CLAVE_REGISTROS,
  CLAVE_PRESTAMOS,
  CLAVE_LIBROS,
  CLAVE_SESION,
  leerGuardado,
  guardar,
  borrar,
  leerRegistros,
} from '../../utils/almacenamiento'

// Rutas guarda el estado de toda la app (datos de la biblioteca y usuario logueado)
// y se lo pasa por props a la navbar y a cada página.
function Rutas() {
  // ---------- Estado ----------
  const [libros, setLibros] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [prestamos, setPrestamos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [usuario, setUsuario] = useState(() => leerGuardado(CLAVE_SESION))
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // ---------- Efectos ----------

  // 1) Una sola vez al abrir la app ([]): trae los JSON con Axios.
  //    Si ya hubo cambios guardados en el navegador, usa esos en lugar de los originales
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datos = await cargarDatosIniciales()
        const registros = leerRegistros()
        setLibros(leerGuardado(CLAVE_LIBROS) ?? datos.libros)
        setAlumnos([...datos.alumnos, ...registros.alumnos])
        setPrestamos(leerGuardado(CLAVE_PRESTAMOS) ?? datos.prestamos)
        setUsuarios([...datos.usuarios, ...registros.usuarios])
      } catch (err) {
        console.error(err)
        setError(`No se pudieron cargar los datos (${err.message})`)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  // 2) Cada vez que cambian los préstamos, se guardan en el navegador
  //    (espera a que termine la carga para no pisarlos con una lista vacía)
  useEffect(() => {
    if (!cargando) guardar(CLAVE_PRESTAMOS, prestamos)
  }, [prestamos, cargando])

  // 3) Cada vez que cambian los libros, se guardan en el navegador
  useEffect(() => {
    if (!cargando) guardar(CLAVE_LIBROS, libros)
  }, [libros, cargando])

  // ---------- Sesión ----------

  function guardarSesion(sesion) {
    setUsuario(sesion)
    guardar(CLAVE_SESION, sesion)
  }

  // Devuelve la sesión si el usuario y la contraseña coinciden, o null si no
  function ingresar(nombreUsuario, password) {
    const encontrado = usuarios.find((u) => u.usuario === nombreUsuario.trim() && u.password === password)
    if (!encontrado) return null

    const alumno = alumnos.find((a) => a.id === encontrado.alumnoId)
    const sesion = armarSesion(encontrado, alumno)
    guardarSesion(sesion)
    return sesion
  }

  function salir() {
    setUsuario(null)
    borrar(CLAVE_SESION)
  }

  // Crea el alumno y su usuario, y deja la sesión iniciada
  function registrarse({ nombre, apellido, legajo, correo, carrera, password }) {
    if (usuarios.some((u) => u.usuario === legajo)) {
      return { ok: false, mensaje: 'Ya existe una cuenta con ese legajo. Probá ingresar.' }
    }

    const id = Date.now()
    const nuevoAlumno = { id, nombre, apellido, legajo, carrera, correo }
    const nuevoUsuario = { id, usuario: legajo, password, rol: 'alumno', alumnoId: id }

    setAlumnos([...alumnos, nuevoAlumno])
    setUsuarios([...usuarios, nuevoUsuario])

    const registros = leerRegistros()
    guardar(CLAVE_REGISTROS, {
      alumnos: [...registros.alumnos, nuevoAlumno],
      usuarios: [...registros.usuarios, nuevoUsuario],
    })

    const sesion = armarSesion(nuevoUsuario, nuevoAlumno)
    guardarSesion(sesion)
    return { ok: true, sesion }
  }

  // ---------- Libros ----------

  // Agrega un libro nuevo al catálogo (por ejemplo, uno encontrado en Open Library)
  function agregarLibro({ titulo, autor, isbn, categoria, total }) {
    if (libros.some((libro) => libro.isbn === isbn)) {
      return { ok: false, mensaje: 'Ya hay un libro con ese ISBN en el catálogo.' }
    }
    const nuevo = { id: Date.now(), titulo, autor, isbn, categoria, disponibles: total, total }
    setLibros([...libros, nuevo])
    return { ok: true, libro: nuevo }
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

  // ---------- Préstamos ----------

  // El alumno pide un libro desde la web: queda "Pendiente" y el ejemplar se reserva
  function solicitarPrestamo(alumnoId, libroId) {
    const problema = validarPrestamo(libros, prestamos, alumnoId, libroId)
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
    setPrestamos([...prestamos, nuevo])
    cambiarDisponibles(libroId, -1)
    return { ok: true }
  }

  // El bibliotecario entrega el libro pedido: pasa a "Activo" con devolución a 14 días
  function entregarPrestamo(prestamoId) {
    const hoy = fechaHoy()
    setPrestamos(
      prestamos.map((p) =>
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

    setPrestamos(prestamos.filter((p) => p.id !== prestamoId))
    cambiarDisponibles(prestamo.libroId, 1)
  }

  // Préstamo en el mostrador (sin pedido previo por la web): queda "Activo" directamente
  function registrarPrestamoDirecto(alumnoId, libroId) {
    const problema = validarPrestamo(libros, prestamos, alumnoId, libroId)
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
    setPrestamos([...prestamos, nuevo])
    cambiarDisponibles(libroId, -1)
    return { ok: true, prestamo: nuevo }
  }

  // El alumno devuelve el libro: queda "Devuelto" y el ejemplar vuelve a estar disponible
  function registrarDevolucion(prestamoId) {
    const prestamo = prestamos.find((p) => p.id === prestamoId)
    if (!prestamo || !estaEnPoder(prestamo)) return

    setPrestamos(
      prestamos.map((p) => (p.id === prestamoId ? { ...p, estado: 'Devuelto', fechaDevolucionReal: fechaHoy() } : p))
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
    setPrestamos(
      prestamos.map((p) => (p.id === prestamoId ? { ...p, fechaDevolucion: nuevaFecha, renovado: true } : p))
    )
    return { ok: true, nuevaFecha }
  }

  // Borra los cambios guardados y vuelve a los datos originales de los JSON
  function restablecerDatos() {
    borrar(CLAVE_PRESTAMOS)
    borrar(CLAVE_LIBROS)
    window.location.reload()
  }

  // ---------- Qué se muestra ----------

  // Mientras cargan los datos, o si fallaron, se muestra un aviso en lugar de las páginas
  function contenido() {
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
            <Alert.Heading as="h1" className="fs-4">
              No pudimos cargar los datos
            </Alert.Heading>
            <p className="mb-0">{error}. Recargá la página para intentarlo de nuevo.</p>
          </Alert>
        </Container>
      )
    }

    return (
      <Routes>
        <Route path="/" element={<Inicio libros={libros} usuario={usuario} />} />
        <Route
          path="/catalogo"
          element={
            <Catalogo libros={libros} prestamos={prestamos} usuario={usuario} solicitarPrestamo={solicitarPrestamo} />
          }
        />
        <Route path="/catalogo/:id" element={<LibroDetalle libros={libros} />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/ingresar" element={<Ingresar usuario={usuario} ingresar={ingresar} />} />
        <Route path="/registrarse" element={<Registrarse usuario={usuario} registrarse={registrarse} />} />

        <Route
          path="/panel"
          element={
            <RutaProtegida usuario={usuario} rol="bibliotecario">
              <Panel
                usuario={usuario}
                libros={libros}
                alumnos={alumnos}
                prestamos={prestamos}
                entregarPrestamo={entregarPrestamo}
                cancelarSolicitud={cancelarSolicitud}
                registrarDevolucion={registrarDevolucion}
                registrarPrestamoDirecto={registrarPrestamoDirecto}
                restablecerDatos={restablecerDatos}
              />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/agregar-libro"
          element={
            <RutaProtegida usuario={usuario} rol="bibliotecario">
              <AgregarLibro libros={libros} agregarLibro={agregarLibro} />
            </RutaProtegida>
          }
        />
        <Route
          path="/prestamos"
          element={
            <RutaProtegida usuario={usuario} rol="bibliotecario">
              <Prestamos prestamos={prestamos} alumnos={alumnos} libros={libros} />
            </RutaProtegida>
          }
        />
        <Route
          path="/alumnos"
          element={
            <RutaProtegida usuario={usuario} rol="bibliotecario">
              <Alumnos alumnos={alumnos} prestamos={prestamos} />
            </RutaProtegida>
          }
        />

        <Route
          path="/mi-biblioteca"
          element={
            <RutaProtegida usuario={usuario} rol="alumno">
              <MiBiblioteca
                usuario={usuario}
                alumnos={alumnos}
                prestamos={prestamos}
                libros={libros}
                cancelarSolicitud={cancelarSolicitud}
                renovarPrestamo={renovarPrestamo}
              />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return (
    <>
      <AppNavbar usuario={usuario} salir={salir} />
      <main className="flex-grow-1">{contenido()}</main>
    </>
  )
}

export default Rutas
