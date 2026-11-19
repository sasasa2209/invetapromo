import { ANTHROPIC_API_KEY, MODELO } from './config';

// Devuelve { titulo, descripcion, precio, origen } usando los insumos que sobran.
// Si no hay clave o falla la red, usa una plantilla local para que la demo nunca se caiga.
export async function generarEspecial({ negocio, sobrantes, dia }) {
  if (ANTHROPIC_API_KEY) {
    try {
      const lista = sobrantes
        .map((s) => {
          const cad = s.diasCaducar !== null && s.diasCaducar <= 3 ? `, caduca en ${s.diasCaducar} días` : '';
          return `${s.insumo.nombre} (${s.insumo.stock} ${s.insumo.unidad}${cad})`;
        })
        .join('; ');
      const prompt =
        `Eres un chef consultor de un negocio pequeño de comida en Durango, México. ` +
        `Negocio: ${negocio.nombre || 'un negocio de comida'} (${negocio.tipo || 'restaurante'}). Mañana es ${dia}. ` +
        `Insumos que sobran o están por caducar: ${lista}. ` +
        `Inventa UN especial del día atractivo, fácil de preparar, que use esos insumos. ` +
        `Responde SOLO un JSON sin texto extra: {"titulo": "...", "descripcion": "frase apetitosa de máximo 25 palabras", "precio": número en pesos mexicanos}`;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model: MODELO, max_tokens: 400, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await r.json();
      const texto = data.content.map((b) => b.text || '').join('');
      const json = JSON.parse(texto.match(/\{[\s\S]*\}/)[0]);
      return {
        titulo: String(json.titulo),
        descripcion: String(json.descripcion),
        precio: String(json.precio),
        origen: 'ia',
      };
    } catch (e) {
      // sigue a la plantilla
    }
  }
  return especialLocal(sobrantes, dia);
}

function especialLocal(sobrantes, dia) {
  const nombres = sobrantes.slice(0, 3).map((s) => s.insumo.nombre.toLowerCase());
  const lista = nombres.length > 1 ? nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1] : nombres[0];
  return {
    titulo: `Especial del ${dia}: platillo con ${lista}`,
    descripcion: `Preparado hoy con ${lista} bien frescos. Solo mientras dure.`,
    precio: '79',
    origen: 'plantilla',
  };
}
