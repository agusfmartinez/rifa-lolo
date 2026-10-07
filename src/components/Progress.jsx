import { CONFIG } from '../config.js'
import { formatoPesos, haceTiempo } from '../lib/format.js'

export default function Progress({ resumen, ahora }) {
  const { recaudado, objetivo, disponibles, vendidos, reservados, ultima_reserva } = resumen
  const pct = objetivo > 0 ? Math.round((recaudado / objetivo) * 100) : 0
  const ancho = Math.min(100, Math.max(pct, recaudado > 0 ? 2 : 0))

  return (
    <section className="seccion progreso" aria-labelledby="progreso-titulo">
      <div className="contenedor">
        <div className="tarjeta progreso__tarjeta">
          <h2 id="progreso-titulo" className="visualmente-oculto">Cuánto llevamos juntado</h2>
          <p className="progreso__monto">
            <strong>{formatoPesos(recaudado)}</strong>
            <span> de {formatoPesos(objetivo)}</span>
          </p>
          <div
            className="barra"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(100, pct)}
            aria-label={`Recaudado: ${pct}% de la meta`}
          >
            <div className="barra__relleno" style={{ width: `${ancho}%` }} />
          </div>
          <p className="progreso__pct">
            <strong>{pct}%</strong> de la meta para la cirugía
          </p>

          <ul className="contadores">
            <li className="contador contador--destacado">
              Quedan <strong>{disponibles}</strong> números
            </li>
            <li className="contador">
              <strong>{vendidos}</strong> vendidos
            </li>
            {reservados > 0 && (
              <li className="contador">
                <strong>{reservados}</strong> reservados
              </li>
            )}
          </ul>

          {ultima_reserva && (
            <p className="progreso__ultimo">
              <span className="punto-vivo" aria-hidden="true" /> Último número pedido{' '}
              {haceTiempo(ultima_reserva, ahora)}
            </p>
          )}

          <p className="progreso__aviso">{CONFIG.avisoProtesis}</p>
        </div>
      </div>
    </section>
  )
}
