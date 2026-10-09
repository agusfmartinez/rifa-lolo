// Textos y valores por defecto de la web.
// Todo lo que viene del Google Sheet (pestaña Resumen) pisa estos defaults.

export const CONFIG = {
  titulo: 'Rifa Solidaria por Lolo',
  subtitulo: 'Ayudanos a que Lolo vuelva a ver',

  // Etiqueta chiquita arriba del título (vacía = no se muestra).
  etiqueta: 'Rifa especial Día de la Madre',

  historia: [
    'Soy Lolo, tengo 3 años y padezco de diabetes desde enero. Como consecuencia de mi enfermedad se desarrollaron cataratas y estoy perdiendo la visión.',
    'Necesito la ayuda de ustedes para poder afrontar los gastos de la cirugía. Un pequeño gesto hace una gran diferencia.',
    'Lolo merece seguir viendo un mundo lleno de amor. ¡Gracias por ser parte de esta cadena de amor! 💙',
  ],

  // Texto del recuadro celeste de la imagen para compartir (máx. ~4 líneas).
  textoImagen:
    'Soy Lolo, tengo 3 años y padezco de diabetes desde enero. Como consecuencia de mi enfermedad se desarrollaron cataratas y estoy perdiendo la visión. Necesito la ayuda de ustedes para poder afrontar los gastos de la cirugía.',

  // Fotos en public/premios/. Si alguna no está, se muestra el emoji.
  premios: [
    { puesto: '1°', nombre: 'Freidora de aire', emoji: '🍟', foto: 'premios/freidora.jpg' },
    { puesto: '2°', nombre: 'Planchita de pelo', emoji: '💇', foto: 'premios/planchita.jpg' },
    { puesto: '3°', nombre: 'Pava eléctrica', emoji: '🫖', foto: 'premios/pava.jpg' },
  ],

  avisoProtesis:
    'Además de la cirugía ($700.000), las prótesis tienen un costo de USD 100 cada una.',

  // Se muestra cuando recaudado >= objetivo.
  metaCumplida: {
    titulo: '🎉 ¡Llegamos a la meta de la cirugía!',
    texto: 'Gracias a todos. Lo que sigamos juntando va para las prótesis y los demás gastos de Lolo.',
  },

  totalNumeros: 200,
  maxPorPedido: 20,
  refrescoMs: 60_000,

  // Fotos en public/lolo/. La del hero va aparte; el resto, a la galería.
  // Ejemplo: { src: 'lolo/foto1.jpg', alt: 'Lolo durmiendo en el sillón' }
  fotoHero: { src: 'lolo/hero.jpg', alt: 'Lolo, un perrito gris de pelo enrulado, con un pañuelo azul a cuadritos' },
  // Recorte cuadrado de la cara, para el círculo de la imagen para compartir.
  fotoCompartir: 'lolo/cara.jpg',
  fotos: [
    { src: 'lolo/foto1.jpg', alt: 'Lolo parado en dos patas, con su pañuelo azul a cuadritos' },
    { src: 'lolo/foto2.jpg', alt: 'Lolo sentado al sol, con la lengua afuera' },
    { src: 'lolo/foto3.jpg', alt: 'Lolo sentado mirando a la cámara, con la lengua afuera' },
  ],

  // Valores por defecto si el Sheet no trae la clave o viene vacía.
  defaults: {
    recaudado: 0,
    pendiente: 0,
    objetivo: 700000,
    vendidos: null, // null = se calcula a partir de la grilla
    reservados: null,
    disponibles: null,
    ultima_reserva: null,
    precio_numero: 3500,
    precio_par: 7000,
    alias: 'COMPLETAR.ALIAS',
    titular: '',
    whatsapp: '5491134940534',
    instagram: 'soylolo_m',
    fecha_sorteo: 'A confirmar',
    loteria: 'A confirmar',
    estado_rifa: 'activa',
    texto_legal: '',
    // Aviso destacado arriba de la historia. La clave "aviso" del Sheet lo pisa.
    // Para que no se muestre, dejalo en '' acá y vacío en el Sheet.
    aviso: '¡Ya tenemos fecha para la cirugía! Lolo se opera el miércoles 14/10.',
  },
}
