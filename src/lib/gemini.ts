// Generación de contenido con Google Gemini (API REST, compatible con Cloudflare Workers).
// Modelo barato por defecto. Cambia a "gemini-2.0-flash-lite" para abaratar aún más.
const GEMINI_MODEL = 'gemini-2.0-flash';

export interface ArticuloGenerado {
  titulo: string;
  resumen: string;
  cuerpo: string; // párrafos separados por una línea en blanco (texto plano)
  tag: string;
  emoji: string;
}

const SYSTEM_PROMPT = `Eres redactor del portal informativo sobre el A.H. Enrique Milla Ochoa, ubicado en el distrito de Los Olivos, Lima, Perú.
Redactas noticias en español neutro, claras, concisas y con tono periodístico sobrio.

REGLA CRÍTICA: usa ÚNICAMENTE la información presente en la fuente proporcionada.
- No inventes fechas, nombres, cifras ni declaraciones.
- Si un dato no aparece en la fuente, omítelo; no rellenes con suposiciones.
- Si la fuente no tiene relación con Enrique Milla Ochoa o Los Olivos, igual redacta con lo que haya, sin forzar conexiones.

Formato del campo "cuerpo": texto plano de 2 a 4 párrafos separados por UNA línea en blanco. Sin markdown, sin viñetas, sin títulos.
"resumen": una o dos frases. "tag": categoría corta (ej. "Comunidad", "Seguridad", "Obras", "Cultura"). "emoji": un único emoji representativo.`;

// Esquema OpenAPI (subset que acepta Gemini). Los tipos van en MAYÚSCULAS.
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    titulo: { type: 'STRING' },
    resumen: { type: 'STRING' },
    cuerpo: { type: 'STRING' },
    tag: { type: 'STRING' },
    emoji: { type: 'STRING' },
  },
  required: ['titulo', 'resumen', 'cuerpo', 'tag', 'emoji'],
  propertyOrdering: ['titulo', 'resumen', 'cuerpo', 'tag', 'emoji'],
};

export async function generarArticulo(
  apiKey: string,
  fuente: { titulo: string; texto: string; url?: string },
): Promise<ArticuloGenerado> {
  const userContent = [
    `Titular de la alerta: ${fuente.titulo}`,
    fuente.url ? `URL: ${fuente.url}` : '',
    '',
    'Contenido de la fuente:',
    fuente.texto,
  ]
    .filter(Boolean)
    .join('\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${detalle.slice(0, 300)}`);
  }

  const data = (await res.json()) as any;
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texto) {
    throw new Error('Gemini devolvió una respuesta vacía');
  }

  const parsed = JSON.parse(texto) as ArticuloGenerado;
  // Saneamiento mínimo
  return {
    titulo: String(parsed.titulo ?? '').trim(),
    resumen: String(parsed.resumen ?? '').trim(),
    cuerpo: String(parsed.cuerpo ?? '').trim(),
    tag: String(parsed.tag ?? 'Alerta').trim() || 'Alerta',
    emoji: String(parsed.emoji ?? '📰').trim() || '📰',
  };
}
