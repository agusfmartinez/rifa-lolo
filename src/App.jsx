import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from './config.js'
import { useAhora, useRaffleData } from './hooks/useRaffleData.js'
import { calcularTotal } from './lib/pricing.js'
import { formatoPesos, pad3 } from './lib/format.js'
import { linkWhatsApp, MENSAJE_CONSULTA } from './lib/whatsapp.js'
import Hero from './components/Hero.jsx'
import Progress from './components/Progress.jsx'
import Prizes from './components/Prizes.jsx'
import Winners from './components/Winners.jsx'
import NumberGrid from './components/NumberGrid.jsx'
import SelectionBar from './components/SelectionBar.jsx'
import OrderDrawer from './components/OrderDrawer.jsx'
import Donate from './components/Donate.jsx'
import Story from './components/Story.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import ShareImage from './components/ShareImage.jsx'
import GoToGrid from './components/GoToGrid.jsx'
import { WhatsAppIcon } from './components/Icons.jsx'

const RESUMEN_INICIAL = { ...CONFIG.defaults, ganadores: [] }

export default function App() {
  const { datos, actualizado, fallo, cargando } = useRaffleData()
  const ahora = useAhora()
  const [seleccion, setSeleccion] = useState([])
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [aviso, setAviso] = useState('')
  const cerrarAviso = useCallback(() => setAviso(''), [])

  const resumen = datos?.resumen ?? RESUMEN_INICIAL
  const cerrada = resumen.estado_rifa !== 'activa'
  const hayGanadores = resumen.ganadores.length > 0

  // Si al refrescar un número elegido dejó de estar disponible, se saca y se avisa.
  const seleccionRef = useRef(seleccion)
  seleccionRef.current = seleccion
  useEffect(() => {
    if (!datos) return
    const libres = new Set(datos.numeros.filter((n) => n.estado === 'disponible').map((n) => n.numero))
    const actual = seleccionRef.current
    const perdidos = cerrada ? actual : actual.filter((n) => !libres.has(n))
    if (perdidos.length === 0) return
    setSeleccion(actual.filter((n) => !perdidos.includes(n)))
    setAviso(
      cerrada
        ? 'La venta de números terminó.'
        : perdidos.length === 1
          ? `El número ${pad3(perdidos[0])} ya no está disponible y lo sacamos de tu selección.`
          : `Los números ${perdidos.map(pad3).join(', ')} ya no están disponibles y los sacamos de tu selección.`,
    )
  }, [datos, cerrada])

  const alternar = useCallback((numero) => {
    setSeleccion((prev) => {
      if (prev.includes(numero)) return prev.filter((n) => n !== numero)
      if (prev.length >= CONFIG.maxPorPedido) {
        setAviso(`Podés pedir hasta ${CONFIG.maxPorPedido} números por pedido.`)
        return prev
      }
      return [...prev, numero]
    })
  }, [])

  const quitar = useCallback((numero) => {
    setSeleccion((prev) => {
      const nueva = prev.filter((n) => n !== numero)
      if (nueva.length === 0) setDrawerAbierto(false)
      return nueva
    })
  }, [])

  const total = useMemo(
    () => calcularTotal(seleccion.length, resumen.precio_numero, resumen.precio_par),
    [seleccion.length, resumen.precio_numero, resumen.precio_par],
  )

  return (
    <>
      {datos?.ejemplo && (
        <div className="franja-ejemplo" role="note">
          Datos de ejemplo — configurá las URLs del Google Sheet en <code>.env</code>
        </div>
      )}
      <a className="saltar" href="#numeros">Saltar a los números</a>

      <Hero />

      <main>
        {resumen.aviso && (
          <div className="contenedor">
            <p className="aviso-destacado tarjeta" role="note">
              <span className="aviso-destacado__icono" aria-hidden="true">🗓️</span>
              <span>{resumen.aviso}</span>
            </p>
          </div>
        )}

        <Story />

        {datos ? (
          <Progress resumen={resumen} ahora={ahora} />
        ) : (
          <div className="contenedor"><div className="tarjeta esqueleto" aria-hidden="true" /></div>
        )}

        <Prizes resumen={resumen} />

        <section id="numeros" className="seccion numeros" aria-labelledby="numeros-titulo">
          <div className="contenedor">
            <h2 id="numeros-titulo" className="titulo-seccion">Elegí tus números</h2>
            {datos && !cerrada && (
              <p className="numeros__intro">
                Tocá los números libres que quieras y pedilos por WhatsApp.
                <br />
                Cada número por{' '}
                <PrecioTexto resumen={resumen} />.
              </p>
            )}

            {hayGanadores && <Winners ganadores={resumen.ganadores} />}
            {datos && cerrada && !hayGanadores && (
              <p className="aviso-cerrada tarjeta">La venta de números terminó. ¡Gracias por ayudar a Lolo! 💙</p>
            )}
            {datos && cerrada && hayGanadores && (
              <p className="aviso-cerrada">La venta de números terminó.</p>
            )}

            {datos ? (
              <NumberGrid
                numeros={datos.numeros}
                seleccion={seleccion}
                onToggle={alternar}
                cerrada={cerrada}
              />
            ) : cargando ? (
              <p className="cargando" role="status">
                <span className="cargando__huella" aria-hidden="true">🐾</span> Cargando números…
              </p>
            ) : (
              <div className="error-carga tarjeta" role="alert">
                <p className="error-carga__titulo">No pudimos cargar los números en este momento 😔</p>
                <p>Lo vamos a seguir intentando solo. Mientras tanto, escribinos por WhatsApp y te decimos cuáles quedan.</p>
                <a
                  className="boton boton--whatsapp"
                  href={linkWhatsApp(resumen.whatsapp, MENSAJE_CONSULTA)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon /> Escribir por WhatsApp
                </a>
              </div>
            )}
          </div>
        </section>

        {datos && <ShareImage datos={datos} />}
        <Donate resumen={resumen} />
      </main>

      <Footer resumen={resumen} actualizado={actualizado} ahora={ahora} />

      <GoToGrid oculto={seleccion.length > 0 || drawerAbierto} />

      {seleccion.length > 0 && !drawerAbierto && (
        <SelectionBar
          cantidad={seleccion.length}
          total={total}
          onPedir={() => setDrawerAbierto(true)}
          onLimpiar={() => setSeleccion([])}
        />
      )}

      <OrderDrawer
        abierto={drawerAbierto}
        onCerrar={() => setDrawerAbierto(false)}
        seleccion={seleccion}
        onQuitar={quitar}
        resumen={resumen}
      />

      {fallo && datos && (
        <p className="aviso-red" role="status">No pudimos actualizar, reintentando…</p>
      )}
      <Toast mensaje={aviso} onCerrar={cerrarAviso} />
    </>
  )
}

function PrecioTexto({ resumen }) {
  const { precio_numero, precio_par } = resumen
  const fmt = formatoPesos
  if (precio_par === precio_numero * 2) return <strong>{fmt(precio_numero)}</strong>
  return (
    <>
      <strong>{fmt(precio_numero)}</strong> y 2 números por <strong>{fmt(precio_par)}</strong>
    </>
  )
}
