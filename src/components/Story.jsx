import { CONFIG } from '../config.js'
import Gallery from './Gallery.jsx'

export default function Story() {
  return (
    <section className="seccion historia" aria-labelledby="historia-titulo">
      <div className="contenedor">
        <h2 id="historia-titulo" className="titulo-seccion">La historia de Lolo</h2>
        <div className="historia__texto">
          {CONFIG.historia.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Gallery fotos={CONFIG.fotos} />
      </div>
    </section>
  )
}
