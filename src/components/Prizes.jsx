import { useState } from 'react'
import { CONFIG } from '../config.js'

const vacioOConfirmar = (t) => (t && t.trim() ? t : 'A confirmar')

export default function Prizes({ resumen }) {
  return (
    <section className="seccion premios" aria-labelledby="premios-titulo">
      <div className="contenedor">
        <h2 id="premios-titulo" className="titulo-seccion">Premios</h2>
        <ol className="premios__lista">
          {CONFIG.premios.map((p) => (
            <li key={p.puesto} className="premio">
              <ImagenPremio premio={p} />
              <span className="premio__puesto">{p.puesto} premio</span>
              <span className="premio__nombre">{p.nombre}</span>
            </li>
          ))}
        </ol>
        <dl className="sorteo">
          <div>
            <dt>Sorteo</dt>
            <dd>{vacioOConfirmar(resumen.fecha_sorteo)}</dd>
          </div>
          <div>
            <dt>Por</dt>
            <dd>{vacioOConfirmar(resumen.loteria)}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function ImagenPremio({ premio }) {
  const [rota, setRota] = useState(!premio.foto)
  if (rota) {
    return (
      <span className="premio__emoji" aria-hidden="true">
        {premio.emoji}
      </span>
    )
  }
  return (
    <img
      className="premio__foto"
      src={import.meta.env.BASE_URL + premio.foto}
      alt={premio.nombre}
      loading="lazy"
      decoding="async"
      onError={() => setRota(true)}
    />
  )
}
