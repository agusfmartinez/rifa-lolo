import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { limpiarNumero, parsearFecha, parsearPublico, parsearResumen, conAntiCache } from './sheet.js'
import { CONFIG } from '../config.js'

const ejemplo = (f) => readFileSync(new URL(`../../docs/datos-ejemplo/${f}`, import.meta.url), 'utf8')

describe('limpiarNumero', () => {
  it('acepta $, puntos y espacios', () => {
    expect(limpiarNumero('153000')).toBe(153000)
    expect(limpiarNumero('153.000')).toBe(153000)
    expect(limpiarNumero('$153.000')).toBe(153000)
    expect(limpiarNumero(' $ 153.000 ')).toBe(153000)
  })
  it('vacío → null', () => {
    expect(limpiarNumero('')).toBeNull()
    expect(limpiarNumero(undefined)).toBeNull()
    expect(limpiarNumero('abc')).toBeNull()
  })
})

describe('parsearFecha', () => {
  it('yyyy-mm-dd hh:mm', () => {
    expect(parsearFecha('2026-10-06 21:40')).toEqual(new Date(2026, 9, 6, 21, 40))
  })
  it('dd/mm/yyyy hh:mm:ss', () => {
    expect(parsearFecha('6/10/2026 21:40:05')).toEqual(new Date(2026, 9, 6, 21, 40, 5))
  })
  it('vacío o inválido → null', () => {
    expect(parsearFecha('')).toBeNull()
    expect(parsearFecha('ayer')).toBeNull()
  })
})

describe('parsearPublico', () => {
  it('lee el CSV de ejemplo', () => {
    const nums = parsearPublico(ejemplo('publico.csv'))
    expect(nums).toHaveLength(200)
    expect(nums[0]).toEqual({ numero: 1, estado: 'vendido' })
    expect(nums[1]).toEqual({ numero: 2, estado: 'disponible' })
  })
  it('tolera espacios, mayúsculas y filas faltantes', () => {
    const nums = parsearPublico('numero,estado\n 1 , Vendido \n2,DISPONIBLE\n3,???\n')
    expect(nums[0].estado).toBe('vendido')
    expect(nums[1].estado).toBe('disponible')
    expect(nums[2].estado).toBe('reservado') // desconocido → no seleccionable
    expect(nums[150].estado).toBe('reservado') // faltante → no seleccionable
  })
  it('falla si no hay datos', () => {
    expect(() => parsearPublico('')).toThrow()
    expect(() => parsearPublico('<html>error</html>')).toThrow()
  })
})

describe('parsearResumen', () => {
  it('lee el CSV de ejemplo', () => {
    const r = parsearResumen(ejemplo('resumen.csv'))
    expect(r.recaudado).toBe(153000)
    expect(r.objetivo).toBe(700000)
    expect(r.vendidos).toBe(33)
    expect(r.disponibles).toBe(165)
    expect(r.precio_numero).toBe(3500)
    expect(r.precio_par).toBe(7000)
    expect(r.whatsapp).toBe('5491134940534')
    expect(r.estado_rifa).toBe('activa')
    expect(r.ultima_reserva).toEqual(new Date(2026, 9, 6, 21, 40))
    expect(r.ganadores).toEqual([])
    expect(r.texto_legal).toBe('')
  })
  it('limpia montos con $ y puntos, ignora tercera columna', () => {
    const r = parsearResumen('clave,valor,nota\nRecaudado , $153.000 ,algo\nprecio_par,"7.000",x\n')
    expect(r.recaudado).toBe(153000)
    expect(r.precio_par).toBe(7000)
  })
  it('claves faltantes o vacías usan defaults', () => {
    const r = parsearResumen('clave,valor\nalias,\nobjetivo,\nwhatsapp,\n')
    expect(r.alias).toBe(CONFIG.defaults.alias)
    expect(r.objetivo).toBe(700000)
    expect(r.whatsapp).toBe(CONFIG.defaults.whatsapp)
    expect(r.precio_numero).toBe(CONFIG.defaults.precio_numero)
    expect(r.instagram).toBe('soylolo_m')
    expect(r.fecha_sorteo).toBe('A confirmar')
    expect(r.vendidos).toBeNull()
    expect(r.ultima_reserva).toBeNull()
  })
  it('normaliza instagram, whatsapp, estado y ganadores', () => {
    const r = parsearResumen(
      'clave,valor\ninstagram,@soylolo_m\nwhatsapp,+54 9 11 3494-0534\nestado_rifa, SORTEADA \n' +
        'numero_ganador_1,027\nnumero_ganador_2,\nnumero_ganador_3,150\n',
    )
    expect(r.instagram).toBe('soylolo_m')
    expect(r.whatsapp).toBe('5491134940534')
    expect(r.estado_rifa).toBe('sorteada')
    expect(r.ganadores).toEqual([
      { puesto: 1, numero: 27 },
      { puesto: 3, numero: 150 },
    ])
  })
  it('estado_rifa inválido → activa; objetivo 0 → default', () => {
    const r = parsearResumen('clave,valor\nestado_rifa,quién sabe\nobjetivo,0\n')
    expect(r.estado_rifa).toBe('activa')
    expect(r.objetivo).toBe(700000)
  })
  it('aviso del Sheet pisa al default; vacío usa el default', () => {
    expect(parsearResumen('clave,valor\naviso,  Cirugía reprogramada  \n').aviso).toBe('Cirugía reprogramada')
    expect(parsearResumen('clave,valor\naviso,\n', { aviso: 'default' }).aviso).toBe('default')
  })
})

describe('conAntiCache', () => {
  it('usa & si ya hay query y ? si no', () => {
    expect(conAntiCache('https://x.com/a?b=1', 5)).toBe('https://x.com/a?b=1&_=5')
    expect(conAntiCache('/datos.csv', 5)).toBe('/datos.csv?_=5')
  })
})
