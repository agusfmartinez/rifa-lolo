import { formatoPesos, pad3 } from './format.js'

export function linkWhatsApp(numero, texto) {
  const tel = String(numero || '').replace(/\D/g, '')
  return `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`
}

export function mensajePedido({ nombre, telefono, numeros, total }) {
  const lista = [...numeros].sort((a, b) => a - b).map(pad3).join(', ')
  const lineas = [
    `¡Hola! Soy ${nombre.trim()} y quiero participar de la rifa de Lolo 🐶`,
    `Números: ${lista}`,
    `Total: ${formatoPesos(total)}`,
  ]
  if (telefono && telefono.trim()) lineas.push(`Mi teléfono: ${telefono.trim()}`)
  lineas.push('Ahora te mando el comprobante de la transferencia.')
  return lineas.join('\n')
}

export const MENSAJE_DONACION = '¡Hola! Te hice una donación para Lolo 💙'
export const MENSAJE_CONSULTA = '¡Hola! Te escribo por la rifa de Lolo 🐶'
