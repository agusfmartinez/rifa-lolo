import { useEffect, useRef, useState } from 'react'
import { copiarTexto } from '../lib/clipboard.js'

export default function CopyAlias({ alias, titular, grande = false }) {
  const [estado, setEstado] = useState('') // '' | 'ok' | 'error'
  const aliasRef = useRef(null)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copiar() {
    const ok = await copiarTexto(alias)
    setEstado(ok ? 'ok' : 'error')
    if (!ok && aliasRef.current) {
      // Seleccionamos el texto para que lo copie a mano.
      const rango = document.createRange()
      rango.selectNodeContents(aliasRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(rango)
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setEstado(''), 3000)
  }

  return (
    <div className={`alias ${grande ? 'alias--grande' : ''}`}>
      <p className="alias__etiqueta">Alias</p>
      <p className="alias__valor" ref={aliasRef}>{alias}</p>
      {titular && (
        <p className="alias__titular">
          A nombre de <strong>{titular}</strong>
        </p>
      )}
      <button type="button" className="boton boton--secundario" onClick={copiar}>
        {estado === 'ok' ? '¡Copiado! ✓' : 'Copiar alias'}
      </button>
      <p className="alias__feedback" role="status">
        {estado === 'error' && 'No pudimos copiarlo. Mantené apretado el alias para copiarlo a mano.'}
      </p>
    </div>
  )
}
