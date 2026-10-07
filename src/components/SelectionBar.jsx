import { formatoPesos } from '../lib/format.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function SelectionBar({ cantidad, total, onPedir, onLimpiar }) {
  return (
    <div className="barra-seleccion" role="region" aria-label="Tu selección">
      <div className="barra-seleccion__interior">
        <p className="barra-seleccion__resumen" aria-live="polite">
          <strong>{cantidad} {cantidad === 1 ? 'número' : 'números'}</strong>
          <span> · {formatoPesos(total)}</span>
        </p>
        <button type="button" className="boton boton--texto" onClick={onLimpiar}>
          Borrar
        </button>
        <button type="button" className="boton boton--whatsapp" onClick={onPedir}>
          <WhatsAppIcon /> Pedir por WhatsApp
        </button>
      </div>
    </div>
  )
}
