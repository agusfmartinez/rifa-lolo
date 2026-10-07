import { haceTiempo } from '../lib/format.js'
import { linkWhatsApp, MENSAJE_CONSULTA } from '../lib/whatsapp.js'
import { InstagramIcon, Paw, WhatsAppIcon } from './Icons.jsx'

export default function Footer({ resumen, actualizado, ahora }) {
  return (
    <footer className="pie">
      <div className="contenedor">
        <Paw className="pie__huella" />
        <p className="pie__gracias">Gracias por ayudar a Lolo 💙</p>
        <div className="pie__botones">
          <a
            className="boton boton--instagram"
            href={`https://instagram.com/${resumen.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon /> @{resumen.instagram}
          </a>
          <a
            className="boton boton--whatsapp"
            href={linkWhatsApp(resumen.whatsapp, MENSAJE_CONSULTA)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
        {resumen.texto_legal && <p className="pie__legal">{resumen.texto_legal}</p>}
        {actualizado && (
          <p className="pie__actualizado">Actualizado {haceTiempo(actualizado, ahora)}</p>
        )}
      </div>
    </footer>
  )
}
