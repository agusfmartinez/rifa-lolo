import { describe, it, expect } from 'vitest'
import { calcularTotal, desglose } from './pricing.js'

describe('calcularTotal', () => {
  it('0 números = $0', () => {
    expect(calcularTotal(0, 3500, 7000)).toBe(0)
  })
  it('con precios actuales da lo mismo que precio por número', () => {
    for (let n = 1; n <= 20; n++) expect(calcularTotal(n, 3500, 7000)).toBe(n * 3500)
  })
  it('cobra los pares a precio_par y el suelto a precio_numero', () => {
    expect(calcularTotal(1, 4000, 7000)).toBe(4000)
    expect(calcularTotal(2, 4000, 7000)).toBe(7000)
    expect(calcularTotal(3, 4000, 7000)).toBe(11000)
    expect(calcularTotal(4, 4000, 7000)).toBe(14000)
    expect(calcularTotal(5, 4000, 7000)).toBe(18000)
  })
  it('tolera valores raros', () => {
    expect(calcularTotal(undefined, 4000, 7000)).toBe(0)
    expect(calcularTotal(-3, 4000, 7000)).toBe(0)
  })
  it('desglose', () => {
    expect(desglose(3)).toEqual({ pares: 1, sueltos: 1 })
    expect(desglose(4)).toEqual({ pares: 2, sueltos: 0 })
  })
})
