import { CONFIG } from '../config.js'
import { pad3 } from '../lib/format.js'

export default function Winners({ ganadores }) {
  return (
    <div className="ganadores tarjeta" role="region" aria-labelledby="ganadores-titulo">
      <h3 id="ganadores-titulo">🎉 ¡Ya tenemos ganadores!</h3>
      <ul>
        {ganadores.map((g) => (
          <li key={g.puesto}>
            <span className="ganadores__numero">{pad3(g.numero)}</span>
            <span>
              {g.puesto}° premio
              {CONFIG.premios[g.puesto - 1] && ` · ${CONFIG.premios[g.puesto - 1].nombre}`}
            </span>
          </li>
        ))}
      </ul>
      <p>¡Gracias a todos los que ayudaron a Lolo! 💙</p>
    </div>
  )
}
