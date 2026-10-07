import { describe, it, expect } from 'vitest'
import { linkWhatsApp, mensajePedido } from './whatsapp.js'

describe('whatsapp', () => {
  it('arma el link con el texto codificado', () => {
    const url = linkWhatsApp('+54 9 11 3494-0534', 'Hola & chau 🐶\nok')
    expect(url).toBe('https://wa.me/5491134940534?text=' + encodeURIComponent('Hola & chau 🐶\nok'))
  })
  it('mensaje de pedido con números ordenados y con ceros', () => {
    const msg = mensajePedido({ nombre: ' Ana ', numeros: [183, 12, 127], total: 10500 })
    expect(msg).toBe(
      '¡Hola! Soy Ana y quiero participar de la rifa de Lolo 🐶\n' +
        'Números: 012, 127, 183\n' +
        'Total: $10.500\n' +
        'Ahora te mando el comprobante de la transferencia.',
    )
  })
  it('incluye el teléfono si se cargó', () => {
    const msg = mensajePedido({ nombre: 'Ana', telefono: '11 5555-5555', numeros: [1], total: 3500 })
    expect(msg).toContain('Mi teléfono: 11 5555-5555')
  })
})
