/**
 * Total de un pedido: los pares se cobran a precioPar y el que sobra a precioNumero.
 * Ej: 3 números = 1 par + 1 suelto.
 */
export function calcularTotal(cantidad, precioNumero, precioPar) {
  const n = Math.max(0, Math.floor(cantidad || 0))
  const pares = Math.floor(n / 2)
  const sueltos = n % 2
  return pares * precioPar + sueltos * precioNumero
}

/** Detalle legible: "1 par a $7.000 + 1 suelto a $4.000" (sin formatear acá). */
export function desglose(cantidad) {
  const n = Math.max(0, Math.floor(cantidad || 0))
  return { pares: Math.floor(n / 2), sueltos: n % 2 }
}
