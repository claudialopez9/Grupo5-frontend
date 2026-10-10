# BiblioFRT

Sistema de gestión para la biblioteca de la **UTN Facultad Regional Tucumán**. Permite consultar el catálogo, pedir libros prestados desde la web y administrar préstamos, devoluciones y alumnos. Funciona desde computadora y celular.

Trabajo integrador de **Programación IV**, carrera de Programación, UTN FRT.

## Demo

https://grupo5-frontend.vercel.app

### Usuarios de prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Bibliotecario | `bibliotecario` | `1234` |
| Alumna con préstamos | `45012` | `1234` |
| Alumna con un préstamo vencido | `44871` | `1234` |
| Alumno sin préstamos | `45544` | `1234` |

Los alumnos ingresan con su número de legajo. También se puede crear una cuenta nueva desde "Registrarse".

## Funcionalidades

### Para cualquier visitante
- Catálogo con buscador (título, autor o ISBN) y filtro por categoría.
- Disponibilidad de cada libro: un punto por ejemplar físico.
- Registro de alumnos con validaciones.

### Para alumnos
- Pedir libros prestados desde el catálogo (queda una solicitud para retirar).
- **Mi biblioteca**: carnet del alumno, libros para retirar, libros en su poder con fecha de devolución, renovación de 7 días (una vez por préstamo) e historial.
- Aviso de préstamos vencidos.

### Para el bibliotecario
- **Panel**: resumen del día, solicitudes para entregar, préstamos vencidos, préstamos que vencen en la semana y ranking de libros más pedidos.
- Entrega y cancelación de solicitudes, registro de devoluciones y préstamo directo en el mostrador.
- Listado de préstamos con filtro por estado y listado de alumnos con buscador.

### Reglas de la biblioteca
- Solo se presta si hay ejemplares disponibles.
- Un alumno con un préstamo vencido no puede pedir otro libro hasta devolverlo.
- Máximo 3 libros al mismo tiempo por alumno.
- El préstamo dura 14 días.

## Tecnologías

- React + Vite
- React Bootstrap y Bootstrap 5
- React Router DOM
- Context API (`createContext` y `useContext`)
- SweetAlert2
- Git, GitHub y Vercel

## Hooks utilizados

**useState**: guarda datos que cambian con la interacción del usuario y hacen que la página se vuelva a dibujar. Por ejemplo: el texto del buscador y la categoría elegida en el Catálogo, el filtro de estado en Préstamos, los campos de los formularios de ingreso y registro, el usuario logueado y si el formulario de préstamo directo está abierto.

**useEffect**: ejecuta código después de que el componente se dibuja.
- En `DatosContext`, con dependencias `[]`: se ejecuta **una sola vez** al cargar la app y pide los archivos JSON con `fetch`.
- También en `DatosContext`, con dependencias `[prestamos]` y `[libros]`: se ejecuta **cada vez que cambian** y guarda los datos en `localStorage`, para que no se pierdan al recargar.
- En el hook propio `useSEO`, con dependencias `[titulo, descripcion]`: actualiza el título de la pestaña y la descripción cada vez que se cambia de página.

## Estrategias SEO

- Título y descripción propios en cada página (hook `useSEO`).
- Etiquetas semánticas: `header`, `nav`, `main`, `section`, `article`, `figure` y `footer`.
- Un solo `h1` por página y jerarquía ordenada de títulos.
- Etiquetas Open Graph en `index.html` para compartir el sitio.
- Idioma declarado (`lang="es"`) y textos alternativos en las imágenes.

## Instalación y ejecución

1. Clonar el repositorio:
```bash
   git clone https://github.com/claudialopez9/Grupo5-frontend.git
```
2. Entrar a la carpeta:
```bash
   cd Grupo5-frontend
```
3. Instalar las dependencias:
```bash
   npm install
```
4. Ejecutar en modo desarrollo:
```bash
   npm run dev
```
5. Abrir la dirección que aparece en la terminal (normalmente http://localhost:5173).

Otros comandos: `npm run build` genera la versión de producción y `npm run lint` revisa el código.

## Estructura del proyecto

```
public/
├── data/            datos de la biblioteca en JSON (libros, alumnos, préstamos, usuarios)
└── img/             logos y fotos del equipo
src/
├── components/      componentes reutilizables (LibroCard, AlumnosCard, ModalPrestamo, navbar, footer)
│   └── routes/      rutas de la app y RutaProtegida
├── context/         DatosContext (datos y acciones) y SesionContext (login)
├── data/            colores de cada categoría
├── hooks/           hook propio useSEO
├── pages/           una página por vista
├── utils/           funciones de fechas
├── App.jsx          layout: navbar, contenido y footer (sin rutas)
└── main.jsx         punto de entrada: router y contextos
```

## Forma de trabajo

- Rama `main` para entregas y `dev` para desarrollo.
- Una rama por tarea, con el formato `token/nombre-en-español` (`feature`, `fix`, `refactor`, `chore`, `docs`).
- Cada cambio entra a `dev` mediante Pull Request.

## Limitaciones actuales

Por ahora los datos salen de archivos JSON, y los cambios (registros, solicitudes, devoluciones) se guardan en el `localStorage` del navegador, así que no se comparten entre computadoras. Las contraseñas de prueba están a la vista. Ambas cosas se resuelven con el backend y la base de datos.

## Integrantes

- Claudia Lopez
- Magali Guerrero
- Esteban Nájera

Docente: Prof. Georgina Costilla.