import { useEffect, useRef, useState } from 'react'
import { Paw } from './Icons.jsx'

export default function Gallery({ fotos }) {
  const [actual, setActual] = useState(null)
  const [rotas, setRotas] = useState(() => new Set())
  const dialogo = useRef(null)
  const base = import.meta.env.BASE_URL
  const visibles = fotos.filter((f) => !rotas.has(f.src))

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (actual !== null && !d.open) d.showModal()
    if (actual === null && d.open) d.close()
  }, [actual])

  if (visibles.length === 0) {
    return (
      <div className="galeria-vacia" role="img" aria-label="Pronto vas a ver fotos de Lolo">
        {[0, 1, 2].map((i) => (
          <div key={i} className="galeria-vacia__cuadro">
            <Paw className="galeria-vacia__huella" />
          </div>
        ))}
        <p>Pronto, fotos de Lolo 📸</p>
      </div>
    )
  }

  const mover = (paso) => setActual((i) => (i + paso + visibles.length) % visibles.length)
  const foto = actual !== null ? visibles[actual] : null

  return (
    <>
      <ul className="galeria">
        {visibles.map((f, i) => (
          <li key={f.src}>
            <button type="button" className="galeria__item" onClick={() => setActual(i)} aria-label={`Ver foto: ${f.alt}`}>
              <img
                src={base + f.src}
                alt={f.alt}
                loading="lazy"
                decoding="async"
                onError={() => setRotas((s) => new Set(s).add(f.src))}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogo}
        className="lightbox"
        aria-label="Foto ampliada"
        onClose={() => setActual(null)}
        onClick={(e) => e.target === dialogo.current && setActual(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') mover(1)
          if (e.key === 'ArrowLeft') mover(-1)
        }}
      >
        {foto && (
          <figure>
            <img src={base + foto.src} alt={foto.alt} />
            <figcaption>{foto.alt}</figcaption>
          </figure>
        )}
        <button type="button" className="boton-cerrar lightbox__cerrar" onClick={() => setActual(null)} aria-label="Cerrar">
          ✕
        </button>
        {visibles.length > 1 && (
          <>
            <button type="button" className="lightbox__nav lightbox__nav--ant" onClick={() => mover(-1)} aria-label="Foto anterior">‹</button>
            <button type="button" className="lightbox__nav lightbox__nav--sig" onClick={() => mover(1)} aria-label="Foto siguiente">›</button>
          </>
        )}
      </dialog>
    </>
  )
}
