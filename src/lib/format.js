/** $7.000 — punto de miles, sin decimales. */
export function formatoPesos(n) {
  const entero = Math.round(Number(n) || 0)
  const signo = entero < 0 ? '-' : ''
  const miles = String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${signo}$${miles}`
}

/** 7 → "007" */
export function pad3(n) {
  return String(n).padStart(3, '0')
}

/** "hace 3 horas", "hace un momento", etc. Devuelve '' si no hay fecha. */
export function haceTiempo(fecha, ahora = new Date()) {
  if (!fecha) return ''
  const seg = Math.max(0, Math.round((ahora - fecha) / 1000))
  const min = Math.floor(seg / 60)
  const horas = Math.floor(min / 60)
  const dias = Math.floor(horas / 24)

  if (min < 1) return 'hace un momento'
  if (min < 60) return min === 1 ? 'hace 1 minuto' : `hace ${min} minutos`
  if (horas < 24) return horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`
  if (dias < 30) return dias === 1 ? 'hace 1 día' : `hace ${dias} días`
  const meses = Math.floor(dias / 30)
  return meses === 1 ? 'hace 1 mes' : `hace ${meses} meses`
}

/** "5491134940534" → "+54 9 11 3494-0534" (celulares de AMBA); otros, "+" y dígitos. */
export function formatoTelefono(numero) {
  const d = String(numero ?? '').replace(/\D/g, '')
  if (/^54911\d{8}$/.test(d)) return `+54 9 11 ${d.slice(5, 9)}-${d.slice(9)}`
  return d ? `+${d}` : ''
}
