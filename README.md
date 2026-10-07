# Rifa Solidaria por Lolo 🐶💙

Web estática que muestra el estado de la rifa leyendo un Google Sheet. Sin servidor ni base de datos: **el Sheet es el panel de administración**. Cargás las reservas ahí y la web se actualiza sola (cada 60 segundos, y Google tarda unos minutos más en publicar los cambios).

## Correr en local

Necesitás [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
npm run dev      # abre http://localhost:5173
npm test         # corre los tests
npm run build    # genera la web final en dist/
```

Si `.env` no tiene las URLs del Sheet, la web usa los datos de ejemplo de `docs/datos-ejemplo/` y muestra una franja amarilla "Datos de ejemplo".

## La planilla (Google Sheet)

`docs/planilla/Rifa_Lolo.xlsx` es la planilla modelo. Subila a Drive, abrila con Google Sheets y seguí la pestaña **Instrucciones**.

- Cargás una fila por persona en **Reservas** y la grilla se pinta sola.
- En **Resumen** editás precios, alias, titular, fecha del sorteo, lotería, estado de la rifa (`activa` / `cerrada` / `sorteada`), números ganadores y texto legal.

### Publicar las pestañas como CSV

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**.
2. Elegí la pestaña **Publico** y el formato **Valores separados por comas (.csv)** → **Publicar**. Copiá el link.
3. Repetí con la pestaña **Resumen**.
4. Copiá `.env.example` como `.env` y pegá los links:

```
VITE_CSV_PUBLICO=https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
VITE_CSV_RESUMEN=https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
```

> ⚠️ **Nunca publiques la pestaña Reservas**: tiene nombres y teléfonos. Publicá solo `Publico` y `Resumen`.

## Fotos de Lolo

Poné las fotos en `public/lolo/` (JPG o WebP, idealmente de menos de 300 KB cada una; podés achicarlas en [squoosh.app](https://squoosh.app)).

- `hero.jpg`: la foto grande de arriba (vertical queda mejor, formato 4:5).
- `og.jpg`: la que aparece al compartir el link por WhatsApp (1200×630).
- Para la galería, agregalas a la lista `fotos` en `src/config.js`:

```js
fotos: [
  { src: 'lolo/foto1.jpg', alt: 'Lolo durmiendo en el sillón' },
  { src: 'lolo/foto2.jpg', alt: 'Lolo en la plaza' },
],
```

Si falta alguna foto, la web muestra un dibujo de huellita en su lugar (nunca una imagen rota).

## Compartir la rifa como imagen

En la sección **Compartí la rifa** de la web, el botón **Crear imagen para compartir** arma una imagen vertical (1080×1920, formato estado/historia) con la grilla, lo recaudado, precios, sorteo, premios y alias, **siempre con los datos actuales del Sheet**. En el celular se comparte directo a WhatsApp (Mi estado) o Instagram (Historia); en la compu se descarga.

Ya no hace falta editar la imagen a mano: cargás la reserva en el Sheet, esperás unos minutos y generás la imagen de nuevo. Si `hero.jpg` existe, la foto de Lolo aparece en la imagen.

## Textos

En `src/config.js` están la historia de Lolo (hoy con `[COMPLETAR]`), los premios, el aviso de las prótesis y los valores por defecto que se usan si el Sheet no trae algún dato.

## Publicar en Netlify (gratis)

1. Subí este proyecto a un repo de GitHub (el `.env` **no** se sube; está en `.gitignore`).
2. En [netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub** y elegí el repo. El build ya está configurado en `netlify.toml` (`npm run build`, carpeta `dist`).
3. En **Site configuration → Environment variables**, cargá `VITE_CSV_PUBLICO` y `VITE_CSV_RESUMEN` con los mismos links del `.env`.
4. **Deploy**. Cada vez que hagas push a GitHub se vuelve a publicar.

Si cambiás las variables de entorno, hacé **Deploys → Trigger deploy** para que se apliquen. Los cambios en el Sheet **no** necesitan redeploy.

### Alternativa: Vercel

Igual que Netlify: importá el repo en [vercel.com](https://vercel.com), framework **Vite**, y cargá las dos variables en **Settings → Environment Variables**. Si querés que la imagen al compartir funcione bien, agregá también `VITE_SITE_URL` con la URL final del sitio.
