# CLAUDE.md — Web de la Rifa Solidaria por Lolo

> Si el usuario dice "iniciá el proyecto", "arrancá" o similar: leé todo este archivo, proponé en pocas líneas la estructura de carpetas y el plan, y empezá a construir siguiendo el **Orden de trabajo** del final. No esperes más instrucciones salvo que algo esté bloqueado.

## Contexto

Lolo es el perro del usuario y necesita una operación de cataratas. Se organiza una rifa solidaria de **200 números** para juntar la plata. Hoy el usuario lleva todo en un Google Sheet y tacha números a mano en una imagen. Queremos una **web estática** que muestre el estado de la rifa en vivo leyendo ese Sheet, y que la gente pueda pedir números por WhatsApp.

**No hay backend ni base de datos.** El Google Sheet ES el panel de administración: el usuario carga ahí las reservas y la web se actualiza sola.

Idioma de toda la interfaz: **español rioplatense** (vos, "elegí", "pedí", etc.). Moneda: pesos argentinos, formato `$7.000` (punto de miles, sin decimales).

## Stack

- **Vite + React** (JavaScript está bien; TypeScript si preferís, pero consistente).
- CSS a elección (CSS modules o Tailwind). Sin librerías de UI pesadas.
- **PapaParse** para leer CSV.
- Deploy en **Netlify, Vercel o GitHub Pages** (plan gratuito, sitio estático). Debe funcionar con `npm run build` y publicar `dist/`.
- Sin servidor, sin base de datos, sin funciones serverless, sin claves secretas.

## Fuente de datos: Google Sheet publicado como CSV

La planilla modelo está en `docs/planilla/Rifa_Lolo.xlsx`. El usuario la sube a Google Sheets y publica **solo dos pestañas** como CSV:

### `Publico` → URL en `VITE_CSV_PUBLICO`
```
numero,estado
1,vendido
2,disponible
151,reservado
...
```
- 200 filas, `numero` del 1 al 200.
- `estado`: `disponible` | `reservado` | `vendido`.

### `Resumen` → URL en `VITE_CSV_RESUMEN`
Formato clave/valor (2 columnas: `clave,valor`). Claves:

| clave | uso en la web |
|---|---|
| `recaudado` | monto cobrado (número entero) → barra de progreso |
| `pendiente` | reservado sin cobrar (opcional mostrar) |
| `objetivo` | meta, hoy 700000 |
| `vendidos`, `reservados`, `disponibles` | contadores |
| `ultima_reserva` | `yyyy-mm-dd hh:mm` o vacío → "Último número pedido hace X" |
| `precio_numero`, `precio_par` | precios (hoy 3500 y 7000) |
| `alias`, `titular` | datos para transferir |
| `whatsapp` | número en formato internacional, ej `5491134940534` |
| `instagram` | usuario sin @ |
| `fecha_sorteo`, `loteria` | texto; si está vacío mostrar "A confirmar" |
| `estado_rifa` | `activa` / `cerrada` / `sorteada` |
| `numero_ganador_1..3` | si hay valores, mostrar sección de ganadores |
| `texto_legal` | texto del pie (autorización de la rifa); si está vacío no mostrar nada |

Reglas de lectura:
- Parsear tolerante: trim de espacios, claves en minúscula, valores numéricos que pueden venir como `153000`, `153.000` o `$153.000` (limpiar todo lo que no sea dígito).
- Si una clave falta o viene vacía, usar el valor por defecto de `src/config.js`.
- Agregar `&_=${Date.now()}` (o `?_=` si no hay query) a la URL para evitar caché del navegador. Google igual cachea unos minutos del lado del servidor: está bien.
- Refrescar cada 60 segundos y al volver a la pestaña (`visibilitychange`).
- Si falla la carga: mostrar los últimos datos buenos (guardar en memoria) y un aviso discreto "No pudimos actualizar, reintentando…". Si nunca cargó, un estado de error amable con el botón de WhatsApp igual visible.
- **Modo desarrollo:** si las variables de entorno no están definidas, leer `docs/datos-ejemplo/publico.csv` y `resumen.csv` (copialos a `public/datos-ejemplo/` o importalos) y mostrar una franja "Datos de ejemplo".

## `src/config.js` (valores por defecto y textos editables)

Centralizá acá todo lo que no viene del Sheet:
- Título: "Rifa Solidaria por Lolo", subtítulo: "Ayudanos a que Lolo vuelva a ver".
- Historia de Lolo: **placeholder** claramente marcado (`[COMPLETAR: historia de Lolo]`), 2–3 párrafos cortos.
- Premios: 1° Freidora de aire, 2° Planchita de pelo, 3° Pava eléctrica.
- Aviso prótesis: "Además de la cirugía ($700.000), las prótesis tienen un costo de USD 100 cada una."
- Defaults: whatsapp `5491134940534`, instagram `soylolo_m`, precio_numero 3500, precio_par 7000, objetivo 700000.
- Lista de fotos (ver abajo).

## Funcionalidades

### 1. Hero
Título, subtítulo, una foto grande de Lolo, y dos botones: **"Pedí tus números"** (scroll a la grilla) y **"Quiero ayudar"** (scroll a la sección de aporte/alias).

### 2. Progreso
- Barra: `recaudado / objetivo`, con el monto en grande ("$153.000 de $700.000") y el porcentaje.
- Contadores: "Quedan **167** números", vendidos, reservados.
- Aviso de las prótesis debajo.
- "Último número pedido hace 3 horas" a partir de `ultima_reserva` (si existe). Formato relativo en español.

### 3. Grilla de números
- 200 casilleros (001–200), responsive: 10 columnas en desktop, 5–6 en mobile, casilleros cómodos para el dedo (mín. 44px).
- Colores: disponible (verde/blanco seleccionable), reservado (amarillo, no seleccionable), vendido (rojo/gris tachado, no seleccionable). Leyenda visible. No depender solo del color: usar también ícono o tachado y `aria-label`.
- Tocar un disponible lo selecciona/deselecciona. Filtro opcional "Ver solo disponibles".
- Barra fija abajo (sticky) cuando hay selección: "3 números · $10.500 · Pedir por WhatsApp".

### 4. Pedido por WhatsApp
- Al tocar "Pedir": modal/drawer con los números elegidos (removibles), campo **Nombre** (obligatorio) y **Teléfono** (opcional), total calculado.
- **Cálculo del total:** pares a `precio_par` y el suelto a `precio_numero`. Con los valores actuales (3500 / 7000) da lo mismo que 3500 por número, pero dejá la lógica para que funcione si el usuario cambia el precio del par. Ej: 3 números = 1 par + 1 suelto.
- Botón **"Enviar pedido por WhatsApp"** → abre `https://wa.me/{whatsapp}?text={mensaje}` con `encodeURIComponent`. Mensaje:
  ```
  ¡Hola! Soy {nombre} y quiero participar de la rifa de Lolo 🐶
  Números: 012, 127, 183
  Total: $10.500
  Ahora te mando el comprobante de la transferencia.
  ```
- Debajo, en el mismo modal: alias con botón **Copiar alias** y titular, para que transfiera y mande el comprobante.
- Dejar claro el texto: "Los números quedan reservados cuando te confirmamos por WhatsApp." (la web no reserva nada por sí misma).
- Máximo 20 números por pedido.
- Si al refrescar datos un número seleccionado dejó de estar disponible, quitarlo de la selección y avisar.

### 5. Aportes / donaciones
Sección "¿No querés números pero querés ayudar?": explicación corta, alias grande con **Copiar alias** (con feedback "¡Copiado!" y fallback si `navigator.clipboard` falla), titular, y botón **"Avisar por WhatsApp"** con mensaje prearmado ("¡Hola! Te hice una donación para Lolo 💙").

### 6. Historia y galería
- Texto de la historia (de `config.js`).
- Galería de fotos de `public/lolo/` (listadas en `config.js`), con lazy loading y lightbox simple. Si no hay fotos, mostrar un placeholder lindo con huellitas en vez de imágenes rotas.

### 7. Premios y sorteo
Tres tarjetas de premios. Fecha del sorteo y lotería ("A confirmar" si vacío). Si `estado_rifa` es `cerrada`, deshabilitar la selección y mostrar "La venta de números terminó". Si es `sorteada` o hay `numero_ganador_*`, mostrar los ganadores arriba de la grilla.

### 8. Pie
Instagram (@soylolo_m) y WhatsApp como botones, `texto_legal` si existe, y "Actualizado hace X min" (hora de la última carga exitosa).

## Lo que NO se hace (decisiones tomadas)

- **No simular actividad falsa**: nada de "12 personas viendo ahora", notificaciones inventadas de compras o donaciones, ni contadores ficticios. Es una campaña donde la gente pone plata; la sensación de movimiento sale de datos reales (barra, "quedan X", último pedido).
- No mostrar nunca nombres ni teléfonos de compradores (no están en los CSV publicados, y así debe quedar).
- No integrar Mercado Pago ni ningún pago online.
- No crear panel de administración en la web: el admin es el Google Sheet.

## Diseño

- Campaña solidaria cálida y emotiva, **no** web genérica de rifas ni casino. Lolo es el protagonista.
- Paleta azul + rosa (pastel/cálida), detalles de huellitas 🐾, bordes redondeados, tipografía amigable de Google Fonts (ej. Nunito / Baloo 2 para títulos).
- **Mobile-first**: casi todos van a entrar desde un link de WhatsApp o Instagram en el celular.
- Accesible: contraste AA, foco visible, `alt` en fotos.
- Si tenés disponible la skill `frontend-design`, usala.
- Meta tags Open Graph (título, descripción, imagen `public/lolo/og.jpg`) para que el link se vea lindo al compartirlo por WhatsApp. Favicon con una huellita.

## Estructura sugerida

```
src/
  config.js            # textos, defaults, lista de fotos
  lib/sheet.js         # fetch + parseo de CSV, normalización, fallbacks
  lib/format.js        # formato de moneda, números 001, tiempo relativo
  lib/pricing.js       # cálculo del total (con tests)
  lib/whatsapp.js      # armado de links wa.me
  hooks/useRaffleData.js  # polling 60s + visibilitychange + último dato bueno
  components/ Hero, Progress, NumberGrid, OrderDrawer, Donate, Story, Gallery, Prizes, Footer
public/lolo/           # fotos (el usuario las agrega)
docs/                  # planilla modelo y CSV de ejemplo (no tocar)
```

## Variables de entorno

`.env.example` (ya existe). Solo variables públicas `VITE_*`, no hay secretos:
```
VITE_CSV_PUBLICO=
VITE_CSV_RESUMEN=
```

## Calidad

- Tests con Vitest para `pricing.js`, el parseo de `sheet.js` (valores con `$`, puntos, vacíos, claves faltantes) y `whatsapp.js`.
- `npm run build` sin warnings importantes. Probar en viewport de 375px.
- Lighthouse razonable: imágenes optimizadas (sugerir al usuario fotos ≤ 300 KB, o convertir a WebP si agregás un paso para eso).

## Orden de trabajo

1. Proponer estructura y plan (breve). Inicializar Vite + React, instalar dependencias.
2. `lib/` + tests, leyendo los CSV de ejemplo.
3. Grilla + pedido por WhatsApp (lo más importante para el usuario: dejar de tachar a mano).
4. Progreso, donaciones/alias, premios, historia, galería, pie.
5. Pulido visual, mobile, accesibilidad, Open Graph.
6. Escribir/actualizar `README.md` con: cómo correr en local, cómo publicar las pestañas del Sheet y pegar las URLs, cómo agregar fotos, cómo deployar en Netlify (o Vercel) desde GitHub y cargar las variables de entorno.

Al terminar cada etapa, contale al usuario en 2–3 líneas qué quedó y qué tiene que hacer él (por ejemplo: pegar las URLs del CSV, agregar fotos).

## Datos que todavía faltan (usar placeholders claros, no inventar)

- Historia de Lolo y fotos.
- Alias y titular (vienen del Sheet; default `COMPLETAR.ALIAS`).
- Fecha del sorteo y lotería.
- Texto legal / autorización de la rifa.
