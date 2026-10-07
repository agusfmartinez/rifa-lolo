import { useEffect, useState } from 'react'
import { Paw } from './Icons.jsx'

/** Botón flotante que lleva a la grilla. Se esconde mientras la grilla está en pantalla. */
export default function GoToGrid({ oculto }) {
  const [grillaVisible, setGrillaVisible] = useState(true)

  useEffect(() => {
    const seccion = document.getElementById('numeros')
    if (!seccion || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([e]) => setGrillaVisible(e.isIntersecting), {
      rootMargin: '0px 0px -30% 0px',
    })
    obs.observe(seccion)
    return () => obs.disconnect()
  }, [])

  if (oculto || grillaVisible) return null
  return (
    <a className="boton-flotante" href="#numeros">
      <Paw className="boton-flotante__huella" /> Ver números
    </a>
  )
}
