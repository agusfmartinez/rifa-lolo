import { useState } from 'react'
import { CONFIG } from '../config.js'
import { Paw } from './Icons.jsx'

export default function Hero() {
  const [sinFoto, setSinFoto] = useState(false)
  const base = import.meta.env.BASE_URL

  return (
    <header className="hero">
      <Paw className="hero__huella hero__huella--1" />
      <Paw className="hero__huella hero__huella--2" />
      <div className="hero__contenido contenedor">
        <div className="hero__texto">
          {CONFIG.etiqueta && (
            <p className="hero__etiqueta">
              <Paw className="huella-mini" /> {CONFIG.etiqueta}
            </p>
          )}
          <h1>{CONFIG.titulo}</h1>
          <p className="hero__subtitulo">{CONFIG.subtitulo}</p>
          <div className="hero__botones">
            <a className="boton boton--primario boton--grande" href="#numeros">
              Pedí tus números
            </a>
            <a className="boton boton--secundario boton--grande" href="#ayudar">
              Quiero ayudar
            </a>
          </div>
        </div>
        <div className="hero__foto">
          {sinFoto ? (
            <div className="foto-placeholder" role="img" aria-label="Acá va la foto de Lolo">
              <Paw className="foto-placeholder__huella" />
              <span>Foto de Lolo</span>
            </div>
          ) : (
            <img
              src={base + CONFIG.fotoHero.src}
              alt={CONFIG.fotoHero.alt}
              fetchPriority="high"
              onError={() => setSinFoto(true)}
            />
          )}
        </div>
      </div>
    </header>
  )
}
