import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config.js'
import { formatoPesos, pad3 } from '../lib/format.js'
import { calcularTotal, desglose } from '../lib/pricing.js'
import { linkWhatsApp, mensajePedido } from '../lib/whatsapp.js'
import CopyAlias from './CopyAlias.jsx'
import { WhatsAppIcon } from './Icons.jsx'

export default function OrderDrawer({ abierto, onCerrar, seleccion, onQuitar, resumen }) {
  const dialogo = useRef(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState('')

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (abierto && !d.open) {
      setEnviado('')
      setError('')
      d.showModal()
    } else if (!abierto && d.open) {
      d.close()
    }
  }, [abierto])

  const { precio_numero, precio_par } = resumen
  const cantidad = seleccion.length
  const total = calcularTotal(cantidad, precio_numero, precio_par)
  const { pares, sueltos } = desglose(cantidad)
  const mostrarDesglose = precio_par !== precio_numero * 2 && pares > 0

  function enviar(e) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError('Contanos tu nombre para saber de quién son los números.')
      return
    }
    setError('')
    const url = linkWhatsApp(resumen.whatsapp, mensajePedido({ nombre, telefono, numeros: seleccion, total }))
    const ventana = window.open(url, '_blank')
    if (ventana) ventana.opener = null
    else window.location.href = url
    setEnviado(url)
  }

  return (
    <dialog
      ref={dialogo}
      className="drawer"
      aria-labelledby="drawer-titulo"
      onClose={onCerrar}
      onClick={(e) => e.target === dialogo.current && onCerrar()}
    >
      <div className="drawer__interior">
        <div className="drawer__cabecera">
          <h2 id="drawer-titulo">Tu pedido</h2>
          <button type="button" className="boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <ul className="chips" aria-label="Números elegidos">
          {[...seleccion].sort((a, b) => a - b).map((n) => (
            <li key={n} className="chip">
              {pad3(n)}
              <button type="button" onClick={() => onQuitar(n)} aria-label={`Quitar el número ${pad3(n)}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <p className="drawer__total">
          <span>{cantidad} {cantidad === 1 ? 'número' : 'números'}</span>
          <strong>{formatoPesos(total)}</strong>
        </p>
        {mostrarDesglose && (
          <p className="drawer__desglose">
            {pares} {pares === 1 ? 'par' : 'pares'} a {formatoPesos(precio_par)}
            {sueltos > 0 && ` + 1 suelto a ${formatoPesos(precio_numero)}`}
          </p>
        )}
        {cantidad >= CONFIG.maxPorPedido && (
          <p className="drawer__nota">Máximo {CONFIG.maxPorPedido} números por pedido.</p>
        )}

        <form className="formulario" onSubmit={enviar} noValidate>
          <label>
            <span>Nombre <span className="requerido">(obligatorio)</span></span>
            <input
              type="text"
              name="nombre"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'error-nombre' : undefined}
              required
            />
          </label>
          {error && (
            <p id="error-nombre" className="formulario__error" role="alert">
              {error}
            </p>
          )}
          <label>
            <span>Teléfono <span className="opcional">(opcional)</span></span>
            <input
              type="tel"
              name="telefono"
              autoComplete="tel"
              inputMode="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </label>

          <button type="submit" className="boton boton--whatsapp boton--ancho" disabled={cantidad === 0}>
            <WhatsAppIcon /> Enviar pedido por WhatsApp
          </button>
          {enviado && (
            <p className="drawer__enviado" role="status">
              Te abrimos WhatsApp. ¿No se abrió?{' '}
              <a href={enviado} target="_blank" rel="noopener noreferrer">Tocá acá</a>.
            </p>
          )}
          <p className="drawer__aclaracion">
            Los números quedan reservados cuando te confirmamos por WhatsApp.
          </p>
        </form>

        <div className="drawer__pago">
          <h3>Para pagar, transferí a:</h3>
          <CopyAlias alias={resumen.alias} titular={resumen.titular} />
          <p>Después mandanos el comprobante por el mismo chat. ¡Gracias! 💙</p>
        </div>
      </div>
    </dialog>
  )
}
