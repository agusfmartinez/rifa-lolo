import { useState } from 'react'
import { pad3 } from '../lib/format.js'

const ETIQUETA = { disponible: 'disponible', reservado: 'reservado', vendido: 'vendido' }

export default function NumberGrid({ numeros, seleccion, onToggle, cerrada }) {
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const elegidos = new Set(seleccion)
  const visibles = soloDisponibles ? numeros.filter((n) => n.estado === 'disponible') : numeros

  return (
    <>
      <div className="grilla__controles">
        <ul className="leyenda" aria-label="Referencias">
          <li><span className="muestra muestra--disponible" aria-hidden="true" /> Disponible</li>
          <li><span className="muestra muestra--elegido" aria-hidden="true">✓</span> Elegido</li>
          <li><span className="muestra muestra--reservado" aria-hidden="true">⏳</span> Reservado</li>
          <li><span className="muestra muestra--vendido" aria-hidden="true">✕</span> Vendido</li>
        </ul>
        <label className="interruptor">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />
          <span className="interruptor__pista" aria-hidden="true" />
          Ver solo disponibles
        </label>
      </div>

      <ul className="grilla" aria-label="Números de la rifa">
        {visibles.map(({ numero, estado }) => {
          const elegido = elegidos.has(numero)
          const libre = estado === 'disponible' && !cerrada
          const clase = `casilla casilla--${elegido ? 'elegido' : estado}`
          return (
            <li key={numero}>
              <button
                type="button"
                className={clase}
                disabled={!libre}
                aria-pressed={libre ? elegido : undefined}
                aria-label={`Número ${pad3(numero)}, ${elegido ? 'elegido' : ETIQUETA[estado]}`}
                onClick={() => onToggle(numero)}
              >
                <span className="casilla__num">{pad3(numero)}</span>
                {estado === 'reservado' && <span className="casilla__icono" aria-hidden="true">⏳</span>}
                {estado === 'vendido' && <span className="casilla__icono" aria-hidden="true">✕</span>}
                {elegido && <span className="casilla__icono" aria-hidden="true">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>
      {soloDisponibles && visibles.length === 0 && (
        <p className="grilla__vacia">No quedan números disponibles. ¡Gracias a todos! 💙</p>
      )}
    </>
  )
}
