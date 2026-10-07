import { useEffect } from 'react'

export default function Toast({ mensaje, onCerrar, ms = 4500 }) {
  useEffect(() => {
    if (!mensaje) return
    const id = setTimeout(onCerrar, ms)
    return () => clearTimeout(id)
  }, [mensaje, onCerrar, ms])

  return (
    <div className="toast-zona" role="status" aria-live="polite">
      {mensaje && <div className="toast">{mensaje}</div>}
    </div>
  )
}
