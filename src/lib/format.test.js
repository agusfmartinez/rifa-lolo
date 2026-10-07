import { describe, it, expect } from 'vitest'
import { formatoPesos, pad3, haceTiempo, formatoTelefono } from './format.js'

describe('format', () => {
  it('formatoPesos', () => {
    expect(formatoPesos(7000)).toBe('$7.000')
    expect(formatoPesos(153000)).toBe('$153.000')
    expect(formatoPesos(1234567)).toBe('$1.234.567')
    expect(formatoPesos(500)).toBe('$500')
    expect(formatoPesos(0)).toBe('$0')
  })
  it('pad3', () => {
    expect(pad3(7)).toBe('007')
    expect(pad3(200)).toBe('200')
  })
  it('haceTiempo', () => {
    const ahora = new Date(2026, 9, 7, 12, 0)
    const antes = (min) => new Date(ahora - min * 60000)
    expect(haceTiempo(null, ahora)).toBe('')
    expect(haceTiempo(antes(0), ahora)).toBe('hace un momento')
    expect(haceTiempo(antes(1), ahora)).toBe('hace 1 minuto')
    expect(haceTiempo(antes(45), ahora)).toBe('hace 45 minutos')
    expect(haceTiempo(antes(180), ahora)).toBe('hace 3 horas')
    expect(haceTiempo(antes(60 * 24), ahora)).toBe('hace 1 día')
    expect(haceTiempo(antes(60 * 24 * 5), ahora)).toBe('hace 5 días')
  })
})

describe('formatoTelefono', () => {
  it('formatea celulares de AMBA', () => {
    expect(formatoTelefono('5491134940534')).toBe('+54 9 11 3494-0534')
  })
  it('otros números quedan con + y dígitos', () => {
    expect(formatoTelefono('5493514567890')).toBe('+5493514567890')
    expect(formatoTelefono('')).toBe('')
  })
})
