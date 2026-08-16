import type { APIRoute } from 'astro';

// Esta ruta se ejecuta en el servidor (función serverless en Vercel).
// El resto del sitio sigue siendo estático.
export const prerender = false;

// Base de datos "Tareas pendientes" (página Avanteam) en Notion.
const NOTION_DATABASE_ID = 'd8417c8a-d9c8-45c1-986c-f7ad517c53eb';
const NOTION_VERSION = '2022-06-28';

// La columna "Área" hace las veces de responsable en esta base.
const RESPONSABLES = ['Kathe', 'Gustavo', 'Kelly'];

const CORREO_DESTINO = 'gerencia@avantilogistica.com';

// Etiquetas legibles para los valores que envían los <select> del formulario.
const SERVICIOS: Record<string, string> = {
  'maritimo-fcl': 'Marítimo FCL (contenedor completo)',
  'maritimo-lcl': 'Marítimo LCL (carga consolidada)',
  aereo: 'Aéreo',
  terrestre: 'Terrestre',
  aduanero: 'Trámite aduanero',
  courier: 'Courier / mensajería',
  almacenamiento: 'Almacenamiento',
  otro: 'Otro',
};

const OPERACIONES: Record<string, string> = {
  importacion: 'Importación',
  exportacion: 'Exportación',
  nacional: 'Nacional',
};

/** Notion rechaza los rich_text de más de 2000 caracteres. */
function texto(valor: string) {
  return [{ type: 'text', text: { content: valor.slice(0, 2000) } }];
}

function parrafo(etiqueta: string, valor: string) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        { type: 'text', text: { content: `${etiqueta}: ` }, annotations: { bold: true } },
        { type: 'text', text: { content: valor.slice(0, 1900) } },
      ],
    },
  };
}

async function crearTareaEnNotion(campos: Record<string, string>) {
  const token = process.env.NOTION_TOKEN ?? import.meta.env.NOTION_TOKEN;
  if (!token) throw new Error('Falta la variable de entorno NOTION_TOKEN');

  const cliente = campos.empresa || campos.nombre || 'Cliente sin identificar';
  const ruta = [campos.origen, campos.destino].filter(Boolean).join(' → ');
  const servicio = SERVICIOS[campos.servicio] ?? campos.servicio ?? '';
  const operacion = OPERACIONES[campos.operacion] ?? campos.operacion ?? '';

  const titulo = `Cotización — ${cliente}${ruta ? ` · ${ruta}` : ''}`;
  const objetivo = `Cotizar ${servicio}${operacion ? ` (${operacion})` : ''}${
    campos.mercancia ? ` de ${campos.mercancia}` : ''
  }`;

  const contacto = [campos.nombre, campos.email, campos.telefono].filter(Boolean).join(' · ');

  const detalle: Array<[string, string]> = [
    ['Nombre', campos.nombre],
    ['Empresa', campos.empresa],
    ['Correo', campos.email],
    ['Teléfono', campos.telefono],
    ['Tipo de servicio', servicio],
    ['Operación', operacion],
    ['Origen', campos.origen],
    ['Destino', campos.destino],
    ['Mercancía', campos.mercancia],
    ['Peso (kg)', campos.peso],
    ['Volumen (m³)', campos.volumen],
    ['Incoterm', campos.incoterm],
    ['Fecha estimada de embarque', campos.fecha],
    ['Comentarios', campos.comentarios],
  ];

  const respuesta = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Tarea: { title: texto(titulo) },
        Estado: { select: { name: 'Por hacer' } },
        Prioridad: { select: { name: 'Alta' } },
        'Área': { multi_select: RESPONSABLES.map((name) => ({ name })) },
        Inicio: { date: { start: new Date().toISOString().slice(0, 10) } },
        Objetivo: { rich_text: texto(objetivo) },
        Notas: { rich_text: texto(contacto) },
      },
      children: [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: { rich_text: texto('Solicitud de cotización desde la página web') },
        },
        ...detalle
          .filter(([, valor]) => valor && valor.trim() !== '')
          .map(([etiqueta, valor]) => parrafo(etiqueta, valor)),
      ],
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Notion respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
}

async function enviarCorreo(campos: Record<string, string>, origen: string) {
  const respuesta = await fetch(`https://formsubmit.co/ajax/${CORREO_DESTINO}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Sin estas dos cabeceras FormSubmit rechaza las llamadas hechas
      // desde un servidor ("will not work in pages browsed as HTML files").
      Origin: origen,
      Referer: `${origen}/cotiza`,
    },
    body: JSON.stringify({
      _subject: 'Nueva solicitud de cotización - Avanti Logística',
      _captcha: 'false',
      ...campos,
    }),
  });

  // FormSubmit devuelve 200 incluso cuando falla: el resultado real va
  // en el cuerpo. Sin esta comprobación los errores pasan desapercibidos.
  const resultado = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || resultado.success !== 'true') {
    throw new Error(`FormSubmit no envió el correo: ${resultado.message ?? respuesta.status}`);
  }
}

export const POST: APIRoute = async ({ request, url }) => {
  let campos: Record<string, string> = {};

  try {
    const datos = await request.formData();
    campos = Object.fromEntries(
      [...datos.entries()]
        .filter(([clave]) => !clave.startsWith('_'))
        .map(([clave, valor]) => [clave, typeof valor === 'string' ? valor : ''])
    );
  } catch {
    return new Response(null, { status: 303, headers: { Location: '/cotiza?error=1' } });
  }

  // Se intentan ambos destinos por separado: que uno falle no debe tumbar al otro.
  const resultados = await Promise.allSettled([
    crearTareaEnNotion(campos),
    enviarCorreo(campos, url.origin),
  ]);

  resultados.forEach((resultado, i) => {
    if (resultado.status === 'rejected') {
      console.error(`[cotizar] Falló ${i === 0 ? 'Notion' : 'el correo'}:`, resultado.reason);
    }
  });

  // Solo se confirma al cliente si la solicitud quedó registrada en algún lado.
  const registrada = resultados.some((r) => r.status === 'fulfilled');

  return new Response(null, {
    status: 303,
    headers: { Location: registrada ? '/gracias' : '/cotiza?error=1' },
  });
};
