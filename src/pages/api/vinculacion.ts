import type { APIRoute } from 'astro';
import { createSign } from 'node:crypto';
import {
  DOCUMENTOS,
  FORMATOS_FIRMADOS,
  CAMPOS_EMPRESA,
  SUBCARPETA_FIRMADOS,
  limpiarNombre,
  type CampoDocumento,
} from '../../data/vinculacion';

export const prerender = false;

// Carpeta de Drive donde se crea una subcarpeta por cada envío.
const CARPETA_PADRE = '13as04GA6vQE7P6-g177tgtKcgHAg1qYl';

const NOTION_DATABASE_ID = 'd8417c8a-d9c8-45c1-986c-f7ad517c53eb';
const NOTION_VERSION = '2022-06-28';
const RESPONSABLES = ['Kathe', 'Gustavo', 'Kelly'];
const CORREO_DESTINO = 'gerencia@avantilogistica.com';

const CARPETA_MIME = 'application/vnd.google-apps.folder';

interface ArchivoDeclarado {
  campo: string;
  filename: string;
  mimeType: string;
  size: number;
}

function env(clave: string): string {
  const valor = process.env[clave] ?? (import.meta.env as Record<string, string>)[clave];
  if (!valor) throw new Error(`Falta la variable de entorno ${clave}`);
  return valor;
}

/**
 * Autentica con la cuenta de servicio: firma un JWT con su clave privada
 * y lo canjea por un access token. Funciona contra unidades compartidas
 * porque los archivos los posee la unidad, no la cuenta de servicio.
 */
async function accessTokenDeGoogle(): Promise<string> {
  const credencial = JSON.parse(env('GOOGLE_SERVICE_ACCOUNT_JSON'));
  const ahora = Math.floor(Date.now() / 1000);

  const base64url = (objeto: unknown) => Buffer.from(JSON.stringify(objeto)).toString('base64url');

  const sinFirmar =
    base64url({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    base64url({
      iss: credencial.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      iat: ahora,
      exp: ahora + 3600,
    });

  const firma = createSign('RSA-SHA256').update(sinFirmar).sign(credencial.private_key, 'base64url');

  const respuesta = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${sinFirmar}.${firma}`,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Google OAuth respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
  return (await respuesta.json()).access_token as string;
}

// Sin supportsAllDrives=true la API se comporta como si las unidades
// compartidas no existieran y rechaza el padre.
const PARAM_UNIDADES = 'supportsAllDrives=true';

async function crearCarpeta(token: string, nombre: string, padre: string): Promise<string> {
  const respuesta = await fetch(`https://www.googleapis.com/drive/v3/files?fields=id&${PARAM_UNIDADES}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre, mimeType: CARPETA_MIME, parents: [padre] }),
  });

  if (!respuesta.ok) {
    throw new Error(`Drive no pudo crear la carpeta "${nombre}" (${respuesta.status}): ${await respuesta.text()}`);
  }
  return (await respuesta.json()).id as string;
}

/** Sube un archivo de texto pequeño directamente (no necesita sesión reanudable). */
async function subirTexto(token: string, nombre: string, padre: string, contenido: string) {
  const limite = 'limite-avanti-' + Math.random().toString(36).slice(2);
  const cuerpo =
    `--${limite}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ name: nombre, parents: [padre] }) +
    `\r\n--${limite}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n` +
    contenido +
    `\r\n--${limite}--`;

  const respuesta = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&${PARAM_UNIDADES}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${limite}`,
      },
      body: cuerpo,
    }
  );

  if (!respuesta.ok) {
    throw new Error(`Drive no pudo crear ${nombre} (${respuesta.status})`);
  }
}

/**
 * Abre una sesión de subida reanudable y devuelve su URL.
 * El navegador sube los bytes directamente ahí, sin pasar por Vercel
 * (que solo admite 4.5 MB por petición).
 */
async function sesionDeSubida(
  token: string,
  origen: string,
  nombre: string,
  padre: string,
  mimeType: string,
  size: number
): Promise<string> {
  const respuesta = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&${PARAM_UNIDADES}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType || 'application/octet-stream',
        'X-Upload-Content-Length': String(size),
        // Sin este encabezado Google no devuelve permisos CORS y el
        // navegador no puede subir a la sesión desde otro dominio.
        Origin: origen,
      },
      body: JSON.stringify({ name: nombre, parents: [padre] }),
    }
  );

  const url = respuesta.headers.get('location');
  if (!respuesta.ok || !url) {
    throw new Error(`Drive no abrió la subida de "${nombre}" (${respuesta.status})`);
  }
  return url;
}

function extension(filename: string): string {
  const punto = filename.lastIndexOf('.');
  return punto > 0 ? filename.slice(punto) : '';
}

/** "01 Certificado Cámara de Comercio.pdf" */
function nombreDestino(campo: CampoDocumento, indice: number, filename: string): string {
  const numero = String(indice + 1).padStart(2, '0');
  return limpiarNombre(`${numero} ${campo.label}${extension(filename)}`);
}

function resumen(datos: Record<string, string>, urlCarpeta: string): string {
  const lineas = [
    'SOLICITUD DE VINCULACIÓN — AVANTI LOGÍSTICA',
    `Recibida: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`,
    '',
    ...CAMPOS_EMPRESA.filter((c) => datos[c.name]?.trim()).map((c) => `${c.label}: ${datos[c.name]}`),
    '',
    `Carpeta: ${urlCarpeta}`,
  ];
  return lineas.join('\r\n');
}

async function crearTareaEnNotion(datos: Record<string, string>, urlCarpeta: string) {
  const token = env('NOTION_TOKEN');
  const empresa = datos.razon_social || 'Empresa sin identificar';
  const tipo = datos.tipo_vinculacion === 'proveedor' ? 'proveedor' : 'cliente';

  const texto = (v: string) => [{ type: 'text', text: { content: v.slice(0, 2000) } }];

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
        Tarea: { title: texto(`Vinculación ${tipo} — ${empresa}`) },
        Estado: { select: { name: 'Por hacer' } },
        Prioridad: { select: { name: 'Media' } },
        'Área': { multi_select: RESPONSABLES.map((name) => ({ name })) },
        Inicio: { date: { start: new Date().toISOString().slice(0, 10) } },
        Objetivo: { rich_text: texto(`Revisar documentación de vinculación de ${empresa}`) },
        Notas: { rich_text: texto([datos.representante, datos.email, datos.telefono].filter(Boolean).join(' · ')) },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { type: 'text', text: { content: 'Documentos en Drive', link: { url: urlCarpeta } } },
            ],
          },
        },
        ...CAMPOS_EMPRESA.filter((c) => datos[c.name]?.trim()).map((c) => ({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { type: 'text', text: { content: `${c.label}: ` }, annotations: { bold: true } },
              { type: 'text', text: { content: datos[c.name].slice(0, 1900) } },
            ],
          },
        })),
      ],
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Notion respondió ${respuesta.status}: ${await respuesta.text()}`);
  }
}

async function enviarCorreo(datos: Record<string, string>, urlCarpeta: string) {
  await fetch(`https://formsubmit.co/ajax/${CORREO_DESTINO}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `Nueva vinculación - ${datos.razon_social ?? 'sin empresa'}`,
      _captcha: 'false',
      ...datos,
      carpeta_drive: urlCarpeta,
    }),
  });
}

export const POST: APIRoute = async ({ request, url }) => {
  const fallo = (mensaje: string, estado = 500) =>
    new Response(JSON.stringify({ ok: false, error: mensaje }), {
      status: estado,
      headers: { 'Content-Type': 'application/json' },
    });

  let datos: Record<string, string>;
  let archivos: ArchivoDeclarado[];

  try {
    const cuerpo = await request.json();
    datos = cuerpo.datos ?? {};
    archivos = Array.isArray(cuerpo.archivos) ? cuerpo.archivos : [];
  } catch {
    return fallo('No se pudo leer la solicitud.', 400);
  }

  if (!datos.razon_social || !datos.nit) {
    return fallo('Faltan la razón social o el NIT.', 400);
  }

  try {
    const token = await accessTokenDeGoogle();

    // 2026-08-16 — TRANSPORTES ACME SAS (901234567-1)
    const fecha = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    const nombreCarpeta = limpiarNombre(`${fecha} — ${datos.razon_social} (${datos.nit})`);

    const idCarpeta = await crearCarpeta(token, nombreCarpeta, CARPETA_PADRE);
    const urlCarpeta = `https://drive.google.com/drive/folders/${idCarpeta}`;

    // La subcarpeta solo se crea si de verdad viene algún formato firmado.
    const hayFirmados = archivos.some((a) => FORMATOS_FIRMADOS.some((f) => f.name === a.campo));
    const idFirmados = hayFirmados
      ? await crearCarpeta(token, SUBCARPETA_FIRMADOS, idCarpeta)
      : idCarpeta;

    const origen = url.origin;
    const subidas = [];

    for (const archivo of archivos) {
      const enDocumentos = DOCUMENTOS.findIndex((d) => d.name === archivo.campo);
      const enFirmados = FORMATOS_FIRMADOS.findIndex((f) => f.name === archivo.campo);

      let nombre: string;
      let destino: string;

      if (enDocumentos >= 0) {
        nombre = nombreDestino(DOCUMENTOS[enDocumentos], enDocumentos, archivo.filename);
        destino = idCarpeta;
      } else if (enFirmados >= 0) {
        nombre = limpiarNombre(FORMATOS_FIRMADOS[enFirmados].label + extension(archivo.filename));
        destino = idFirmados;
      } else {
        continue; // campo desconocido: se ignora
      }

      subidas.push({
        campo: archivo.campo,
        url: await sesionDeSubida(token, origen, nombre, destino, archivo.mimeType, archivo.size),
      });
    }

    await subirTexto(token, 'RESUMEN.txt', idCarpeta, resumen(datos, urlCarpeta));

    // Notion y el correo no deben tumbar el envío si fallan.
    const avisos = await Promise.allSettled([
      crearTareaEnNotion(datos, urlCarpeta),
      enviarCorreo(datos, urlCarpeta),
    ]);
    avisos.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[vinculacion] Falló ${i === 0 ? 'Notion' : 'el correo'}:`, r.reason);
      }
    });

    return new Response(JSON.stringify({ ok: true, carpeta: urlCarpeta, subidas }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[vinculacion]', error);
    return fallo('No pudimos preparar la carga de documentos. Inténtalo de nuevo.');
  }
};
