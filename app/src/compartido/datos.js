import { diaSemana, redondea, sumaDias } from './logica';

// Negocios de ejemplo para el modo cliente (inventados para la demo)
export const NEGOCIOS_DEMO = [
  {
    id: 'd1', nombre: 'Tacos El Mezquite', tipo: 'Tacos', abre: '18:00', cierra: '01:00',
    ubicacion: 'Col. Centro, Durango', distancia: 0.6,
    menu: [{ nombre: 'Taco de asada', precio: 25 }, { nombre: 'Taco al pastor', precio: 22 }, { nombre: 'Gringa', precio: 55 }],
    oferta: { titulo: 'Gringas 2x1', descripcion: 'Sobró tortilla de harina: 2x1 en gringas.', precio: 55 },
  },
  {
    id: 'd2', nombre: 'Lonchería La Güera', tipo: 'Comida corrida', abre: '08:00', cierra: '17:00',
    ubicacion: 'Col. Guadalupe, Durango', distancia: 1.2,
    menu: [{ nombre: 'Comida corrida', precio: 85 }, { nombre: 'Caldo de res', precio: 70 }, { nombre: 'Enchiladas', precio: 65 }],
    oferta: { titulo: 'Caldo de res + agua', descripcion: 'Caldo con verduras frescas del día y agua de limón.', precio: 79 },
  },
  {
    id: 'd3', nombre: 'Bar El Alacrán', tipo: 'Bar', abre: '17:00', cierra: '02:00',
    ubicacion: 'Col. Zona Centro, Durango', distancia: 0.9,
    menu: [{ nombre: 'Cerveza de barril', precio: 45 }, { nombre: 'Micheladas', precio: 70 }, { nombre: 'Alitas', precio: 120 }],
    oferta: { titulo: 'Michelada + alitas', descripcion: 'Combo para compartir mientras dure el limón.', precio: 160 },
  },
  {
    id: 'd4', nombre: 'Caldos Doña Lupe', tipo: 'Caldos y menudo', abre: '07:00', cierra: '15:00',
    ubicacion: 'Col. Fátima, Durango', distancia: 2.1,
    menu: [{ nombre: 'Menudo', precio: 90 }, { nombre: 'Caldo de pollo', precio: 70 }, { nombre: 'Birria', precio: 95 }],
    oferta: null,
  },
];

const BASE = [
  { nombre: 'Carne asada', unidad: 'kg', minimo: 3, stock: 2.5, base: 6 },
  { nombre: 'Tortillas de maíz', unidad: 'kg', minimo: 4, stock: 10, base: 5 },
  { nombre: 'Limones', unidad: 'kg', minimo: 2, stock: 12, base: 2 },
  { nombre: 'Cerveza', unidad: 'pzas', minimo: 24, stock: 60, base: 40 },
  { nombre: 'Frijoles', unidad: 'kg', minimo: 2, stock: 3.5, base: 3 },
  { nombre: 'Queso', unidad: 'kg', minimo: 2, stock: 4, base: 2.5, caducaEn: 2 },
  { nombre: 'Aguacate', unidad: 'kg', minimo: 1, stock: 6, base: 1.5, caducaEn: 2 },
  { nombre: 'Jitomate', unidad: 'kg', minimo: 2, stock: 8, base: 2.5, caducaEn: 3 },
];
const MULT = [1.1, 0.8, 0.8, 0.9, 1.0, 1.6, 1.8]; // dom..sáb (viernes y sábado se consume más)

// Datos de demostración: 8 insumos y 3 semanas de cierres
export function generarDemo(hoy) {
  const insumos = BASE.map((b, k) => ({
    id: 'i' + (k + 1), nombre: b.nombre, unidad: b.unidad, minimo: b.minimo, stock: b.stock,
    caduca: b.caducaEn != null ? sumaDias(hoy, b.caducaEn) : '',
  }));
  const cierres = [];
  for (let n = 21; n >= 1; n--) {
    const fecha = sumaDias(hoy, -n);
    const dia = diaSemana(fecha);
    const consumo = {};
    BASE.forEach((b, k) => {
      consumo['i' + (k + 1)] = redondea(b.base * MULT[dia] * (0.9 + Math.random() * 0.2));
    });
    cierres.push({ fecha, dia, consumo });
  }
  return { insumos, cierres };
}
