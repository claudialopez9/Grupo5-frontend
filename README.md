# BiblioFRT

Sistema de gestión para la biblioteca de la **UTN Facultad Regional Tucumán**. Permite consultar el catálogo, pedir libros prestados desde la web, administrar préstamos, devoluciones y alumnos, e incorporar libros nuevos con datos de la API de Open Library. Funciona desde computadora y celular.

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
- Página de detalle de cada libro con tapa, año, páginas, editoriales y temas traídos de Open Library.
- Registro de alumnos con validaciones.

### Para alumnos
- Pedir libros prestados desde el catálogo (queda una solicitud para retirar).
- **Mi biblioteca**: carnet del alumno, libros para retirar, libros en su poder con fecha de devolución, renovación de 7 días (una vez por préstamo) e historial.
- Aviso de préstamos vencidos.

### Para el bibliotecario
- **Panel**: resumen del día, solicitudes para entregar, préstamos vencidos, préstamos que vencen en la semana y ranking de libros más pedidos.
- Entrega y cancelación de solicitudes, registro de devoluciones y préstamo directo en el mostrador.
- **Agregar libros**: búsqueda en Open Library e incorporación al catálogo con categoría y cantidad de ejemplares.
- Listado de préstamos con filtro por estado y listado de alumnos con buscador.

### Reglas de la biblioteca
- Solo se presta si hay ejemplares disponibles.
- Un alumno con un préstamo vencido no puede pedir otro libro hasta devolverlo.
- Máximo 3 libros al mismo tiempo por alumno.
- El préstamo dura 14 días.

## API pública: Open Library

Se usa la API de [Open Library](https://openlibrary.org/developers/api) (gratuita y sin clave):

- `GET /search.json`: búsqueda de libros por ISBN, título, autor o texto libre.
- `covers.openlibrary.org/b/id/{id}-L.jpg`: imágenes de las tapas.

Las peticiones se hacen con **Axios** desde `src/services/openLibrary.js`, dentro de un `useEffect`, con estado de carga, manejo de errores y avisos con **SweetAlert2**.

## Variables de entorno

Las direcciones de la API están en un archivo `.env` (no se sube a GitHub, está en `.gitignore`). Para crearlo, copiar `.env.example`:

```
VITE_API_URL=https://openlibrary.org
VITE_COVERS_URL=https://covers.openlibrary.org
```

En React se leen con `import.meta.env.VITE_API_URL`. En Vercel están cargadas en Settings → Environment Variables.

## Tecnologías

- React + Vite
- React Bootstrap y Bootstrap 5
- React Router DOM
- Context API (`createContext` y `useContext`), con un hook propio para leer cada contexto (`useDatos` y `useSesion`)
- Axios
- SweetAlert2
- Git, GitHub y Vercel

## Hooks utilizados

**useState**: guarda datos que cambian con la interacción del usuario y hacen que la página se vuelva a dibujar. Por ejemplo: el texto del buscador y la categoría elegida en el Catálogo, el filtro de estado en Préstamos, los campos de los formularios, el usuario logueado, si un modal está abierto y los resultados que devuelve Open Library.

**useEffect**: ejecuta código después de que el componente se dibuja.
- En `DatosProvider`, con dependencias `[]`: se ejecuta **una sola vez** al cargar la app y pide los archivos JSON con Axios.
- También en `DatosProvider`, con dependencias `[prestamos, cargando]` y `[libros, cargando]`: se ejecuta **cada vez que cambian** y guarda los datos en `localStorage` (espera a que terminen de cargar para no pisarlos con una lista vacía).
- En `LibroDetalle`, con dependencias `[isbn, titulo, autor]`: pide los datos del libro a Open Library al abrir la página y cada vez que se pasa a otro libro. Tiene una función de limpieza para ignorar respuestas que llegan tarde.
- En `AgregarLibro`, con dependencia `[consulta]`: busca en Open Library cada vez que se envía una búsqueda nueva.
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
4. Crear el archivo `.env` copiando `.env.example`.
5. Ejecutar en modo desarrollo:
```bash
   npm run dev
```
6. Abrir la dirección que aparece en la terminal (normalmente http://localhost:5173).

Otros comandos: `npm run build` genera la versión de producción y `npm run lint` revisa el código.

## Estructura del proyecto

```
public/
├── data/            datos de la biblioteca en JSON (libros, alumnos, préstamos, usuarios)
└── img/             logos y fotos del equipo
src/
├── components/      componentes reutilizables (LibroCard, TapaLibro, Estante, LomoCategoria,
│   │                AlumnosCard, ModalPrestamo, navbar y footer)
│   └── routes/      rutas de la app y RutaProtegida
├── context/         DatosContext.js + DatosProvider.jsx (datos y acciones)
│                    SesionContext.js + SesionProvider.jsx (login)
├── data/            colores de cada categoría
├── hooks/           hooks propios: useDatos, useSesion y useSEO
├── pages/           una página por vista
├── services/        peticiones a la API de Open Library (Axios)
├── utils/           funciones de fechas y avisos de SweetAlert2 (alertas.js)
├── index.css        lo poco que Bootstrap no resuelve (colores de marca y formas de libro)
├── App.jsx          layout: navbar, contenido y footer (sin rutas)
└── main.jsx         punto de entrada: router y contextos
```

## Estilos: Bootstrap primero

- Todo el diseño (espaciados, grillas, colores, tipografía, bordes, tablas, formularios y botones) se hace con clases de Bootstrap y componentes de React Bootstrap.
- Los colores de la marca se aplican cambiando las variables de Bootstrap (`--bs-primary`, `--bs-tertiary-bg`) en `index.css`, así `bg-primary`, `bg-body-tertiary` y los links usan el naranja de la facultad sin escribir CSS nuevo.
- `index.css` solo tiene lo que Bootstrap no trae: el lomo de los libros, el texto vertical del estante, el borde punteado del 404, la proporción de las tapas y algunos tamaños fijos chicos.
- Los únicos `style` en línea son valores que salen de los datos (el color de cada categoría y el alto de cada lomo del estante).

## Forma de trabajo

- Rama `main` para entregas y `dev` para desarrollo.
- Una rama por tarea, con el formato `token/nombre-en-español` (`feature`, `fix`, `refactor`, `chore`, `docs`).
- Cada cambio entra a `dev` mediante Pull Request.

## Limitaciones actuales

Por ahora los datos salen de archivos JSON, y los cambios (registros, solicitudes, devoluciones, libros agregados) se guardan en el `localStorage` del navegador, así que no se comparten entre computadoras. Las contraseñas de prueba están a la vista. Ambas cosas se resuelven con el backend y la base de datos.

## Integrantes

- Claudia Lopez
- Magali Guerrero
- Esteban Nájera

Docente: Prof. Georgina Costilla.
