import Swal from 'sweetalert2'

// Todos los carteles de SweetAlert2 del sitio salen de acá, así se ven iguales en todas las páginas
const COLOR_BOTON = '#1F2125'

// Pide confirmación. Devuelve una promesa: "respuesta.isConfirmed" es true si la persona aceptó
export function confirmar({ titulo, texto, textoBoton, icono = 'question' }) {
  return Swal.fire({
    icon: icono,
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: 'Volver',
    confirmButtonColor: COLOR_BOTON,
  })
}

// Aviso de éxito que se cierra solo
export function avisarExito(titulo, texto) {
  return Swal.fire({ icon: 'success', title: titulo, text: texto, timer: 2000, showConfirmButton: false })
}

// Aviso de éxito con botón, para mensajes que hay que leer con calma
export function informar(titulo, texto) {
  return Swal.fire({
    icon: 'success',
    title: titulo,
    text: texto,
    confirmButtonText: 'Entendido',
    confirmButtonColor: COLOR_BOTON,
  })
}

// Aviso de error con el motivo
export function mostrarError(titulo, texto) {
  return Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'Entendido',
    confirmButtonColor: COLOR_BOTON,
  })
}
