# Biblioteca UTN

Sistema de gestión para la biblioteca de la UTN que permite consultar el catálogo de libros y administrar alumnos y préstamos. Está pensado para usarse desde computadora y celular.

## Demo

https://grupo5-frontend.vercel.app

## Funcionalidades

- Catálogo de libros con disponibilidad de ejemplares
- Listado de alumnos y sus préstamos activos
- Seguimiento de préstamos (activos, vencidos y devueltos)
- Navegación entre páginas con React Router
- Diseño responsive

## Tecnologías

- React + Vite
- React Bootstrap y Bootstrap
- React Router DOM
- JavaScript
- Git y GitHub
- Vercel (deploy)

## Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone [URL del repositorio]
   ```
2. Entrar a la carpeta:
   ```bash
   cd Grupo5-frontend
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
5. Abrir la URL que aparece en la terminal (normalmente http://localhost:5173).

## Estructura del proyecto

```
src/
├── components/   componentes reutilizables
├── pages/        páginas de la aplicación
├── data/         datos de ejemplo
├── hooks/        hooks personalizados (SEO)
├── App.jsx       rutas
└── main.jsx      punto de entrada
```

## Integrantes

- Claudia Lopez
- Magali Guerrero
- Esteban Nájera

## Próximas funcionalidades

- Registro de préstamos y devoluciones
- Carnet digital con código QR
- Panel de gestión con estadísticas
- Búsqueda y filtros del catálogo
