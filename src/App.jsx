import AppNavbar from './components/AppNavbar'
import Rutas from './components/routes/Rutas'
import Footer from './components/Footer'

// Layout de la app: navbar arriba, la página en el medio y el footer siempre abajo
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        <Rutas />
      </main>
      <Footer />
    </div>
  )
}

export default App
