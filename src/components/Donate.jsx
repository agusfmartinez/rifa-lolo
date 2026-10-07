import { linkWhatsApp, MENSAJE_DONACION } from '../lib/whatsapp.js'
import CopyAlias from './CopyAlias.jsx'
import { WhatsAppIcon } from './Icons.jsx'

export default function Donate({ resumen }) {
  return (
    <section id="ayudar" className="seccion donar" aria-labelledby="donar-titulo">
      <div className="contenedor">
        <div className="tarjeta donar__tarjeta">
          <h2 id="donar-titulo" className="titulo-seccion">¿No querés números pero querés ayudar?</h2>
          <p>
            Cualquier aporte suma para la operación de Lolo. Transferí lo que puedas al alias y
            avisanos por WhatsApp así te lo agradecemos.
          </p>
          <CopyAlias alias={resumen.alias} titular={resumen.titular} grande />
          <a
            className="boton boton--whatsapp"
            href={linkWhatsApp(resumen.whatsapp, MENSAJE_DONACION)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Avisar por WhatsApp
          </a>
          <p className="donar__compartir">
            ¿No podés aportar? <a href="#compartir">Compartir la rifa</a> también ayuda muchísimo 🐾
          </p>
        </div>
      </div>
    </section>
  )
}
