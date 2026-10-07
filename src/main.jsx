import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { DatosProvider } from './context/DatosContext'
import { SesionProvider } from './context/SesionContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DatosProvider>
        <SesionProvider>
          <App />
        </SesionProvider>
      </DatosProvider>
    </BrowserRouter>
  </StrictMode>,
)