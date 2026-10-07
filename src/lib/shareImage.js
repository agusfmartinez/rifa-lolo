// Dibuja la imagen para estados de WhatsApp / historias de Instagram (1080x1920)
// con el estado de la rifa en vivo. Todo en canvas, sin librerías.
import { CONFIG } from '../config.js'
import { formatoPesos, formatoTelefono, pad3 } from './format.js'

export const ANCHO = 1080
export const ALTO = 1920

const C = {
  azul: '#2f6fb5',
  azulOsc: '#1d4e89',
  azulClaro: '#e4effb',
  azulPastel: '#cfe2f7',
  rosa: '#f4a7c3',
  rosaClaro: '#fde9f1',
  rosaOsc: '#b8325f',
  tinta: '#1e2b45',
  tintaSuave: '#4a5672',
  fondo: '#fffaf6',
  blanco: '#ffffff',
  reservado: '#ffe7a3',
  reservadoTinta: '#8a6700',
  vendidoFondo: '#f1f2f6',
  vendidoTinta: '#b4bac6',
  punto: '#e5484d',
}

const TITULOS = '"Baloo 2", "Nunito", sans-serif'
const TEXTO = '"Nunito", sans-serif'

function fuente(ctx, peso, tam, familia = TEXTO) {
  ctx.font = `${peso} ${tam}px ${familia}`
}

/** Achica la fuente hasta que el texto entre en `max` px. */
function ajustar(ctx, texto, max, peso, tam, familia = TEXTO) {
  let t = tam
  fuente(ctx, peso, t, familia)
  while (t > 12 && ctx.measureText(texto).width > max) {
    t -= 1
    fuente(ctx, peso, t, familia)
  }
  return t
}

/** Parte un texto en líneas que entren en `max` px con la fuente actual. */
function partirLineas(ctx, texto, max) {
  const lineas = []
  let actual = ''
  for (const palabra of String(texto).split(/\s+/).filter(Boolean)) {
    const prueba = actual ? `${actual} ${palabra}` : palabra
    if (actual && ctx.measureText(prueba).width > max) {
      lineas.push(actual)
      actual = palabra
    } else {
      actual = prueba
    }
  }
  if (actual) lineas.push(actual)
  return lineas
}

function rect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function huella(ctx, x, y, tam, color, rot = 0, alpha = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rot * Math.PI) / 180)
  ctx.scale(tam / 64, tam / 64)
  ctx.translate(-32, -32)
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  const elipse = (cx, cy, rx, ry, r = 0) => {
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, (r * Math.PI) / 180, 0, Math.PI * 2)
    ctx.fill()
  }
  elipse(32, 43, 13, 11)
  elipse(15, 28, 5.5, 7, -20)
  elipse(25, 17, 5.5, 7.5)
  elipse(39, 17, 5.5, 7.5)
  elipse(49, 28, 5.5, 7, 20)
  ctx.restore()
}

function tarjeta(ctx, x, y, w, h, r = 36) {
  ctx.save()
  ctx.shadowColor = 'rgba(30, 43, 69, 0.10)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  ctx.fillStyle = C.blanco
  rect(ctx, x, y, w, h, r)
  ctx.fill()
  ctx.restore()
}

async function cargarImagen(src) {
  try {
    const img = new Image()
    img.src = src
    await img.decode()
    return img
  } catch {
    return null
  }
}

async function cargarFuentes() {
  if (!document.fonts?.load) return
  try {
    await Promise.all([
      document.fonts.load(`800 80px "Baloo 2"`),
      document.fonts.load(`700 40px "Baloo 2"`),
      document.fonts.load(`800 30px "Nunito"`),
      document.fonts.load(`700 30px "Nunito"`),
    ])
  } catch {
    // si no cargan, se usa la fuente del sistema
  }
}

function sitio() {
  const env = import.meta.env?.VITE_SITE_URL?.trim()
  try {
    return env ? new URL(env).host : window.location.host
  } catch {
    return window.location.host
  }
}

/** Devuelve un Blob PNG con la imagen para compartir. */
export async function generarImagenRifa({ numeros, resumen }) {
  await cargarFuentes()
  const foto = await cargarImagen(import.meta.env.BASE_URL + (CONFIG.fotoCompartir || CONFIG.fotoHero.src))

  const canvas = document.createElement('canvas')
  canvas.width = ANCHO
  canvas.height = ALTO
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'alphabetic'

  // Fondo
  const g = ctx.createLinearGradient(0, 0, 0, ALTO)
  g.addColorStop(0, C.azulClaro)
  g.addColorStop(0.45, C.fondo)
  g.addColorStop(1, C.rosaClaro)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, ANCHO, ALTO)
  huella(ctx, 1010, 90, 90, C.rosa, 20, 0.5)
  huella(ctx, 960, 470, 44, C.azul, -15, 0.15)
  huella(ctx, 40, 1560, 56, C.azul, -25, 0.15)
  huella(ctx, 1040, 1600, 60, C.rosa, 15, 0.45)

  const M = 60 // margen
  const anchoUtil = ANCHO - M * 2

  // ---------- Encabezado ----------
  const fx = 195
  const fy = 235
  const fr = 135
  ctx.save()
  ctx.beginPath()
  ctx.arc(fx, fy, fr + 10, 0, Math.PI * 2)
  ctx.fillStyle = C.blanco
  ctx.shadowColor = 'rgba(30, 43, 69, 0.18)'
  ctx.shadowBlur = 30
  ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.beginPath()
  ctx.arc(fx, fy, fr, 0, Math.PI * 2)
  ctx.clip()
  if (foto) {
    const escala = Math.max((fr * 2) / foto.naturalWidth, (fr * 2) / foto.naturalHeight)
    const w = foto.naturalWidth * escala
    const h = foto.naturalHeight * escala
    ctx.drawImage(foto, fx - w / 2, fy - h / 2, w, h)
  } else {
    const gf = ctx.createLinearGradient(fx - fr, fy - fr, fx + fr, fy + fr)
    gf.addColorStop(0, C.rosaClaro)
    gf.addColorStop(1, C.azulPastel)
    ctx.fillStyle = gf
    ctx.fillRect(fx - fr, fy - fr, fr * 2, fr * 2)
    huella(ctx, fx, fy, 130, C.blanco)
  }
  ctx.restore()

  const tx = 365
  const tMax = ANCHO - tx - M
  let ty = 140
  if (CONFIG.etiqueta) {
    const tam = ajustar(ctx, CONFIG.etiqueta, tMax - 40, 800, 28)
    const w = ctx.measureText(CONFIG.etiqueta).width + 40
    ctx.fillStyle = C.rosaClaro
    rect(ctx, tx, ty - 32, w, 48, 24)
    ctx.fill()
    ctx.fillStyle = C.rosaOsc
    ctx.fillText(CONFIG.etiqueta, tx + 20, ty + tam * 0.35 - 2)
    ty += 18
  }
  ctx.fillStyle = C.azulOsc
  ajustar(ctx, 'Rifa Solidaria', tMax, 800, 84, TITULOS)
  ctx.fillText('Rifa Solidaria', tx, ty + 80)
  ctx.fillStyle = C.azul
  ajustar(ctx, 'por Lolo', tMax, 800, 84, TITULOS)
  ctx.fillText('por Lolo', tx, ty + 158)
  ctx.fillStyle = C.tintaSuave
  ajustar(ctx, CONFIG.subtitulo, tMax, 700, 32)
  ctx.fillText(CONFIG.subtitulo, tx, ty + 210)

  // ---------- Texto de Lolo (como en el flyer) ----------
  const hy = 410
  const hPad = 30
  const hMax = anchoUtil - hPad * 2
  let hTam = 31
  let renglones
  do {
    hTam -= 1
    fuente(ctx, 700, hTam)
    renglones = partirLineas(ctx, CONFIG.textoImagen, hMax)
  } while (renglones.length > 4 && hTam > 20)
  const hLh = Math.round(hTam * 1.32)
  const hh = hPad * 2 + renglones.length * hLh - (hLh - hTam)
  ctx.fillStyle = '#d9e8f8'
  rect(ctx, M, hy, anchoUtil, hh, 32)
  ctx.fill()
  ctx.fillStyle = C.tinta
  ctx.textAlign = 'center'
  renglones.forEach((l, k) => ctx.fillText(l, ANCHO / 2, hy + hPad + hTam * 0.8 + k * hLh))
  ctx.textAlign = 'left'

  // ---------- Grilla ----------
  const gy = hy + hh + 20
  const pad = 22
  const cols = 10
  const filas = Math.ceil(numeros.length / cols)
  const gap = 6
  const cw = (anchoUtil - pad * 2 - gap * (cols - 1)) / cols
  const ch = 34
  const altoGrilla = filas * ch + (filas - 1) * gap
  const gh = pad + altoGrilla + 62
  tarjeta(ctx, M, gy, anchoUtil, gh)

  ctx.textAlign = 'center'
  for (const { numero, estado } of numeros) {
    const i = numero - 1
    const x = M + pad + (i % cols) * (cw + gap)
    const y = gy + pad + Math.floor(i / cols) * (ch + gap)
    const cx = x + cw / 2
    const cy = y + ch / 2

    if (estado === 'disponible') {
      ctx.fillStyle = C.blanco
      rect(ctx, x, y, cw, ch, 10)
      ctx.fill()
      ctx.strokeStyle = C.azulPastel
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.fillStyle = C.tinta
    } else if (estado === 'reservado') {
      ctx.fillStyle = C.reservado
      rect(ctx, x, y, cw, ch, 10)
      ctx.fill()
      ctx.fillStyle = C.reservadoTinta
    } else {
      ctx.fillStyle = C.vendidoFondo
      rect(ctx, x, y, cw, ch, 10)
      ctx.fill()
      ctx.fillStyle = C.vendidoTinta
    }
    fuente(ctx, 800, 24)
    if (estado === 'vendido') {
      ctx.fillStyle = C.punto
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillText(pad3(numero), cx, cy + 8.5)
    }
  }
  ctx.textAlign = 'left'

  // Leyenda
  const ly = gy + pad + altoGrilla + 38
  const items = [
    { texto: 'Disponible', dibujar: (x, y) => {
      ctx.fillStyle = C.blanco
      rect(ctx, x, y - 13, 26, 26, 7)
      ctx.fill()
      ctx.strokeStyle = C.azulPastel
      ctx.lineWidth = 2.5
      ctx.stroke()
    } },
    { texto: 'Reservado', dibujar: (x, y) => {
      ctx.fillStyle = C.reservado
      rect(ctx, x, y - 13, 26, 26, 7)
      ctx.fill()
    } },
    { texto: 'Vendido', dibujar: (x, y) => {
      ctx.fillStyle = C.punto
      ctx.beginPath()
      ctx.arc(x + 13, y, 13, 0, Math.PI * 2)
      ctx.fill()
    } },
  ]
  fuente(ctx, 700, 26)
  const anchos = items.map((it) => 26 + 10 + ctx.measureText(it.texto).width)
  const sep = 44
  let lx = ANCHO / 2 - (anchos.reduce((a, b) => a + b, 0) + sep * (items.length - 1)) / 2
  items.forEach((it, k) => {
    it.dibujar(lx, ly)
    ctx.fillStyle = C.tintaSuave
    fuente(ctx, 700, 26)
    ctx.fillText(it.texto, lx + 36, ly + 9)
    lx += anchos[k] + sep
  })

  // ---------- Datos ----------
  const iy = gy + gh + 22
  const precio =
    resumen.precio_par === resumen.precio_numero * 2
      ? `${formatoPesos(resumen.precio_numero)} cada número`
      : `${formatoPesos(resumen.precio_numero)} c/u  ·  2 por ${formatoPesos(resumen.precio_par)}`
  const sorteo = [resumen.fecha_sorteo, resumen.loteria]
    .filter((t) => t && t.trim() && t.trim() !== 'A confirmar')
    .join('  ·  ')
  const lineas = [
    { tit: 'Precio', txt: precio },
    { tit: 'Sorteo', txt: sorteo || 'A confirmar' },
    { tit: 'Premios', txt: CONFIG.premios.map((p) => `${p.puesto} ${p.nombre}`).join('  ·  ') },
    { tit: 'Alias', txt: `${resumen.alias}${resumen.titular ? `  (${resumen.titular})` : ''}` },
  ]
  if (resumen.ganadores?.length) {
    lineas[1] = {
      tit: 'Ganadores',
      txt: resumen.ganadores.map((g) => `${g.puesto}° ${pad3(g.numero)}`).join('  ·  '),
    }
  }
  const lh = 40
  const ih = 30 + lineas.length * lh
  tarjeta(ctx, M, iy, anchoUtil, ih)
  lineas.forEach((l, k) => {
    const y = iy + 52 + k * lh
    ctx.fillStyle = C.rosaOsc
    fuente(ctx, 800, 24)
    ctx.fillText(l.tit.toUpperCase(), M + 36, y)
    ctx.fillStyle = C.tinta
    ajustar(ctx, l.txt, anchoUtil - 72 - 170, 700, 29)
    ctx.fillText(l.txt, M + 36 + 170, y)
  })

  // ---------- Llamado a la acción ----------
  const cy = iy + ih + 24
  const cerrada = resumen.estado_rifa !== 'activa'
  const cta = cerrada ? '¡Gracias por ayudar a Lolo! 💙' : `Elegí tu número en ${sitio()}`
  ctx.fillStyle = C.azul
  rect(ctx, M, cy, anchoUtil, 88, 44)
  ctx.fill()
  ctx.fillStyle = C.blanco
  ctx.textAlign = 'center'
  ajustar(ctx, cta, anchoUtil - 60, 800, 38, TITULOS)
  ctx.fillText(cta, ANCHO / 2, cy + 58)

  ctx.fillStyle = C.tintaSuave
  const pie = `WhatsApp ${formatoTelefono(resumen.whatsapp)}  ·  Instagram @${resumen.instagram}`
  ajustar(ctx, pie, anchoUtil, 700, 27)
  ctx.fillText(pie, ANCHO / 2, cy + 132)
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo generar la imagen'))), 'image/png'),
  )
}
