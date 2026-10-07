import { useCallback, useEffect, useRef, useState } from 'react'
import { cargarDatos } from '../lib/sheet.js'
import { CONFIG } from '../config.js'

/**
 * Lee el Sheet cada 60 s y al volver a la pestaña.
 * Si una carga falla, conserva el último dato bueno y marca `fallo`.
 */
export function useRaffleData() {
  const [datos, setDatos] = useState(null)
  const [actualizado, setActualizado] = useState(null)
  const [fallo, setFallo] = useState(false)
  const [cargando, setCargando] = useState(true)
  const enCurso = useRef(false)

  const refrescar = useCallback(async () => {
    if (enCurso.current) return
    enCurso.current = true
    try {
      const nuevos = await cargarDatos()
      setDatos(nuevos)
      setActualizado(new Date())
      setFallo(false)
    } catch (err) {
      console.warn('No se pudieron actualizar los datos de la rifa:', err)
      setFallo(true)
    } finally {
      enCurso.current = false
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    refrescar()
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refrescar()
    }, CONFIG.refrescoMs)
    const alVolver = () => {
      if (document.visibilityState === 'visible') refrescar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [refrescar])

  return { datos, actualizado, fallo, cargando, refrescar }
}

/** Fecha actual que se actualiza cada `ms` (para los "hace X min"). */
export function useAhora(ms = 30_000) {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), ms)
    return () => clearInterval(id)
  }, [ms])
  return ahora
}
