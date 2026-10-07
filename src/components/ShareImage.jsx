import { useEffect, useRef, useState } from 'react'
import { generarImagenRifa } from '../lib/shareImage.js'
import { copiarTexto } from '../lib/clipboard.js'
import { linkWhatsApp } from '../lib/whatsapp.js'
import { WhatsAppIcon } from './Icons.jsx'

const NOMBRE_ARCHIVO = 'rifa-lolo.png'
const TEXTO_COMPARTIR = '¡Ayudemos a que Lolo vuelva a ver! 🐶💙 Elegí tu número de la rifa:'

export default function ShareImage({ datos }) {
  const dialogo = useRef(null)
  const [abierto, setAbierto] = useState(false)
  const [imagen, setImagen] = useState(null) // { url, archivo }
  const [estado, setEstado] = useState('') // '' | 'generando' | 'error'
  const [linkCopiado, setLinkCopiado] = useState(false)
  const link = window.location.origin + window.location.pathname

  useEffect(() => {
    const d = dialogo.current
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  // Libera la imagen anterior al regenerar o desmontar.
  useEffect(() => () => imagen && URL.revokeObjectURL(imagen.url), [imagen])

  async function abrir() {
    setAbierto(true)
    setEstado('generando')
    try {
      const blob = await generarImagenRifa(datos)
      const archivo = new File([blob], NOMBRE_ARCHIVO, { type: 'image/png' })
      setImagen({ url: URL.createObjectURL(blob), archivo })
      setEstado('')
    } catch (err) {
      console.error(err)
      setEstado('error')
    }
  }

  const puedeCompartir =
    imagen && typeof navigator.canShare === 'function' && navigator.canShare({ files: [imagen.archivo] })

  async function compartir() {
    try {
      await navigator.share({ files: [imagen.archivo], text: `${TEXTO_COMPARTIR} ${link}` })
    } catch (err) {
      if (err?.name !== 'AbortError') console.warn(err)
    }
  }

  async function copiarLink() {
    if (await copiarTexto(link)) {
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2500)
    }
  }

  return (
    <section id="compartir" className="seccion compartir" aria-labelledby="compartir-titulo">
      <div className="contenedor">
        <div className="tarjeta compartir__tarjeta">
          <h2 id="compartir-titulo" className="titulo-seccion">Compartí la rifa</h2>
          <p>
            Subí la imagen con los números al día a tus estados de WhatsApp o historias de Instagram.
            ¡Cada vez que alguien comparte, Lolo está más cerca de volver a ver! 🐾
          </p>
          <div className="compartir__botones">
            <button type="button" className="boton boton--primario boton--grande" onClick={abrir}>
              Compartir rifa
            </button>
            <a
              className="boton boton--whatsapp"
              href={linkWhatsApp('', `${TEXTO_COMPARTIR} ${link}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Compartir link
            </a>
            <button type="button" className="boton boton--secundario" onClick={copiarLink}>
              {linkCopiado ? '¡Link copiado! ✓' : 'Copiar link'}
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogo}
        className="drawer compartir__dialogo"
        aria-labelledby="compartir-dialogo-titulo"
        onClose={() => setAbierto(false)}
        onClick={(e) => e.target === dialogo.current && setAbierto(false)}
      >
        <div className="drawer__interior">
          <div className="drawer__cabecera">
            <h2 id="compartir-dialogo-titulo">Imagen para compartir</h2>
            <button type="button" className="boton-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">
              ✕
            </button>
          </div>

          {estado === 'generando' && (
            <p className="cargando" role="status">
              <span className="cargando__huella" aria-hidden="true">🐾</span> Armando la imagen…
            </p>
          )}
          {estado === 'error' && (
            <p className="formulario__error" role="alert">No pudimos armar la imagen. Probá de nuevo.</p>
          )}

          {imagen && estado === '' && (
            <>
              <img
                className="compartir__preview"
                src={imagen.url}
                alt="Imagen de la rifa con la grilla de números actualizada"
              />
              <div className="compartir__acciones">
                {puedeCompartir && (
                  <button type="button" className="boton boton--whatsapp boton--ancho" onClick={compartir}>
                    Compartir imagen
                  </button>
                )}
                <a
                  className={`boton boton--ancho ${puedeCompartir ? 'boton--secundario' : 'boton--primario'}`}
                  href={imagen.url}
                  download={NOMBRE_ARCHIVO}
                >
                  Descargar imagen
                </a>
              </div>
              <p className="compartir__ayuda">
                {puedeCompartir
                  ? 'Tocá "Compartir imagen" y elegí WhatsApp (Mi estado) o Instagram (Historia).'
                  : 'Descargala y subila a tu estado o historia. En el celular también podés mantener apretada la imagen para guardarla.'}
              </p>
            </>
          )}
        </div>
      </dialog>
    </section>
  )
}
