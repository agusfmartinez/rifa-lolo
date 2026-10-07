import Papa from 'papaparse'
import { CONFIG } from '../config.js'

export const ESTADOS = ['disponible', 'reservado', 'vendido']

const CLAVES_NUMERICAS = [
  'recaudado', 'pendiente', 'objetivo', 'vendidos', 'reservados', 'disponibles',
  'precio_numero', 'precio_par',
]
const CLAVES_TEXTO = [
  'alias', 'titular', 'fecha_sorteo', 'loteria', 'texto_legal',
]

/** "153000", "153.000", "$153.000" → 153000. Vacío o sin dígitos → null. */
export function limpiarNumero(valor) {
  if (valor === null || valor === undefined) return null
  const digitos = String(valor).replace(/\D/g, '')
  return digitos === '' ? null : parseInt(digitos, 10)
}

/** Acepta "2026-10-06 21:40", "2026-10-06T21:40", "6/10/2026 21:40" o "6/10/2026". */
export function parsearFecha(valor) {
  const s = String(valor ?? '').trim()
  if (!s) return null
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (m) return armarFecha(m[1], m[2], m[3], m[4], m[5], m[6])
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (m) return armarFecha(m[3], m[2], m[1], m[4], m[5], m[6])
  return null
}

function armarFecha(a, mes, d, h = 0, min = 0, seg = 0) {
  const f = new Date(+a, +mes - 1, +d, +(h || 0), +(min || 0), +(seg || 0))
  return Number.isNaN(f.getTime()) ? null : f
}

function filasCsv(texto) {
  const { data } = Papa.parse(String(texto ?? '').replace(/^﻿/, ''), {
    skipEmptyLines: 'greedy',
  })
  return data.map((fila) => fila.map((c) => String(c ?? '').trim()))
}

/**
 * CSV de la pestaña Publico → array de 200 { numero, estado }.
 * Estados desconocidos o números que faltan se marcan como "reservado"
 * (no seleccionables) para no ofrecer algo que quizás ya no está libre.
 */
export function parsearPublico(texto, total = CONFIG.totalNumeros) {
  const filas = filasCsv(texto)
  if (filas.length === 0) throw new Error('CSV Publico vacío')

  const porNumero = new Map()
  for (const [num, est] of filas) {
    const n = limpiarNumero(num)
    if (n === null || n < 1 || n > total) continue // encabezado o basura
    const estado = String(est ?? '').toLowerCase()
    porNumero.set(n, ESTADOS.includes(estado) ? estado : 'reservado')
  }
  if (porNumero.size === 0) throw new Error('CSV Publico sin números')

  return Array.from({ length: total }, (_, i) => ({
    numero: i + 1,
    estado: porNumero.get(i + 1) ?? 'reservado',
  }))
}

/** CSV de la pestaña Resumen (clave,valor[,nota]) → objeto normalizado con defaults. */
export function parsearResumen(texto, defaults = CONFIG.defaults) {
  const crudo = {}
  for (const [clave, valor = ''] of filasCsv(texto)) {
    const k = clave.toLowerCase()
    if (!k || k === 'clave') continue
    crudo[k] = valor
  }
  const vacio = (k) => crudo[k] === undefined || crudo[k] === ''

  const r = { ...defaults }
  for (const k of CLAVES_NUMERICAS) {
    const n = limpiarNumero(crudo[k])
    if (n !== null) r[k] = n
  }
  for (const k of CLAVES_TEXTO) {
    if (!vacio(k)) r[k] = crudo[k]
  }

  if (!vacio('whatsapp')) {
    const tel = crudo.whatsapp.replace(/\D/g, '')
    if (tel) r.whatsapp = tel
  }
  if (!vacio('instagram')) {
    const ig = crudo.instagram.replace(/^@/, '').trim()
    if (ig) r.instagram = ig
  }

  const estado = (crudo.estado_rifa || '').toLowerCase()
  r.estado_rifa = ['activa', 'cerrada', 'sorteada'].includes(estado) ? estado : defaults.estado_rifa

  r.ultima_reserva = parsearFecha(crudo.ultima_reserva) ?? defaults.ultima_reserva

  r.ganadores = [1, 2, 3]
    .map((i) => ({ puesto: i, numero: limpiarNumero(crudo[`numero_ganador_${i}`]) }))
    .filter((g) => g.numero !== null)

  // Un objetivo de 0 rompería la barra.
  if (!r.objetivo) r.objetivo = defaults.objetivo
  return r
}

/** Agrega un parámetro anti-caché a la URL. */
export function conAntiCache(url, ahora = Date.now()) {
  return `${url}${url.includes('?') ? '&' : '?'}_=${ahora}`
}

const ENV_PUBLICO = import.meta.env?.VITE_CSV_PUBLICO?.trim()
const ENV_RESUMEN = import.meta.env?.VITE_CSV_RESUMEN?.trim()
const BASE = import.meta.env?.BASE_URL ?? '/'

export const USA_DATOS_EJEMPLO = !ENV_PUBLICO || !ENV_RESUMEN

async function bajarCsv(url) {
  const res = await fetch(conAntiCache(url), { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status} al leer ${url}`)
  return res.text()
}

/** Baja y parsea las dos pestañas. Tira error si algo falla. */
export async function cargarDatos() {
  const urlPublico = USA_DATOS_EJEMPLO ? `${BASE}datos-ejemplo/publico.csv` : ENV_PUBLICO
  const urlResumen = USA_DATOS_EJEMPLO ? `${BASE}datos-ejemplo/resumen.csv` : ENV_RESUMEN
  const [txtPublico, txtResumen] = await Promise.all([bajarCsv(urlPublico), bajarCsv(urlResumen)])

  const numeros = parsearPublico(txtPublico)
  const resumen = parsearResumen(txtResumen)

  // Si el Sheet no trae contadores, se calculan desde la grilla.
  const contar = (e) => numeros.filter((x) => x.estado === e).length
  resumen.vendidos ??= contar('vendido')
  resumen.reservados ??= contar('reservado')
  resumen.disponibles ??= contar('disponible')

  return { numeros, resumen, ejemplo: USA_DATOS_EJEMPLO }
}
