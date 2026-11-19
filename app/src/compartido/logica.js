export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const num = (t) => {
  const n = parseFloat(String(t ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
export const redondea = (n) => Math.round(n * 10) / 10;
export const fmt = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(1));

const dos = (n) => String(n).padStart(2, '0');
export const aISO = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const hoyISO = () => aISO(new Date());
export const diaSemana = (iso) => new Date(iso + 'T12:00:00').getDay();
export const sumaDias = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return aISO(d);
};
export const diasEntre = (a, b) =>
  Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);

// consumo = inventario inicial + compras del día - lo que quedó
export const calcularConsumo = (inicial, compras, quedo) => inicial + compras - quedo;

// Promedio de consumo de un insumo en un día de la semana (si no hay datos de ese día, usa todos)
export function promedioConsumo(cierres, insumoId, dia) {
  const todos = cierres
    .filter((c) => typeof c.consumo?.[insumoId] === 'number')
    .map((c) => ({ dia: c.dia, v: c.consumo[insumoId] }));
  const mismos = todos.filter((x) => x.dia === dia);
  const lista = mismos.length ? mismos : todos;
  if (!lista.length) return null;
  return lista.reduce((s, x) => s + x.v, 0) / lista.length;
}

// Estado de cada insumo mirando a mañana:
// critico = bajo el mínimo | faltara = no alcanza para mañana | sobra = sobra o está por caducar
export function analizar(insumos, cierres, hoy = hoyISO()) {
  const manana = sumaDias(hoy, 1);
  const diaManana = diaSemana(manana);
  return insumos.map((i) => {
    const p = promedioConsumo(cierres, i.id, diaManana);
    const prediccion = p === null ? null : redondea(p);
    const diasCaducar = i.caduca ? diasEntre(hoy, i.caduca) : null;
    let estado = 'ok';
    if (i.stock <= i.minimo) estado = 'critico';
    else if (prediccion !== null && i.stock < prediccion) estado = 'faltara';
    else if (
      (diasCaducar !== null && diasCaducar <= 3 && i.stock > 0) ||
      (prediccion !== null && prediccion > 0 && i.stock > prediccion * 2.5 && i.stock > i.minimo * 2)
    )
      estado = 'sobra';
    return { insumo: i, prediccion, diasCaducar, estado };
  });
}

export const normaliza = (s) =>
  String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// "09:00" / "22:00" -> ¿está abierto ahora? (soporta horarios que pasan de medianoche)
export function estaAbierto(abre, cierra, ahora = new Date()) {
  const m = (t) => {
    const [h, mi] = String(t || '0:0').split(':');
    return num(h) * 60 + num(mi);
  };
  const a = m(abre), c = m(cierra), n = ahora.getHours() * 60 + ahora.getMinutes();
  return c > a ? n >= a && n < c : n >= a || n < c;
}
