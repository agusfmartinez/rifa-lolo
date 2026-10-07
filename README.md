# Rifa Solidaria por Lolo 🐶💙

Web estática que muestra el estado de la rifa leyendo un Google Sheet. Sin servidor.

## Para arrancar con Claude Code

1. Descomprimí esta carpeta y abrila en VS Code.
2. Poné las fotos de Lolo en `public/lolo/` (ver `LEEME.md` ahí adentro).
3. Abrí Claude Code y escribile: **"Iniciá el proyecto siguiendo el CLAUDE.md"**.

## La planilla

`docs/planilla/Rifa_Lolo.xlsx` es tu nuevo Google Sheet. Subilo a Drive, abrilo con Google Sheets y seguí la pestaña **Instrucciones**. En resumen:

- Cargás una fila por persona en **Reservas** y la grilla se pinta sola.
- Publicás **solo** las pestañas `Publico` y `Resumen` como CSV y pegás los links en `.env` (copiá `.env.example`) y en las variables de entorno del hosting.
- Nunca publiques la pestaña Reservas: tiene nombres y teléfonos.
