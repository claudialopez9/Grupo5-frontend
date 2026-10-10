import { useEffect } from 'react'

function useSEO(titulo, descripcion) {
  useEffect(() => {
    document.title = `${titulo} | BiblioFRT`

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', descripcion)
  }, [titulo, descripcion])
}

export default useSEO