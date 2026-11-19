import Rutas from './components/routes/Rutas'
import Footer from './components/Footer'

// Layout de la app: Rutas dibuja la navbar y la página, y el footer queda siempre abajo
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Rutas />
      <Footer />
    </div>
  )
}

export default App
