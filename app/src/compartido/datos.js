import { diaSemana, redondea, sumaDias } from './logica';

export const ETIQUETAS = ['Comida corrida', 'Desayunos', 'Hecho en casa', 'Tradicional', 'Antojitos', 'Para llevar', 'Cenas', 'Bar'];

// Negocios de ejemplo para el modo cliente (inventados para la demo)
export const NEGOCIOS_DEMO = [
  {
    id: 'd2', nombre: 'Lonchería La Güera', tipo: 'Comida corrida', abre: '08:00', cierra: '17:00',
    ubicacion: 'Col. Guadalupe, Durango', distancia: 0.8,
    estrella: 'Caldillo duranguense', etiquetas: ['Comida corrida', 'Hecho en casa', 'Tradicional'],
    historia: 'Desde 1998. Doña Rosa cocina cada día la sopa, el guisado y el caldillo como en casa.',
    local: 'Carne y chile de productores de la región',
    menu: [{ nombre: 'Comida corrida', precio: 85 }, { nombre: 'Caldillo duranguense', precio: 75 }, { nombre: 'Enchiladas', precio: 65 }],
    oferta: { titulo: 'Caldillo + agua fresca', descripcion: 'Caldillo duranguense con tortillas hechas a mano y agua de limón.', precio: 79, porciones: 8 },
  },
  {
    id: 'd4', nombre: 'Caldos Doña Lupe', tipo: 'Desayunos y caldos', abre: '07:00', cierra: '15:00',
    ubicacion: 'Col. Fátima, Durango', distancia: 2.1,
    estrella: 'Menudo de los domingos', etiquetas: ['Desayunos', 'Hecho en casa', 'Tradicional'],
    historia: 'Un puesto de familia que empezó en la esquina del mercado. El menudo se cuece desde las 4 de la mañana.',
    local: 'Maíz y chile de la sierra',
    menu: [{ nombre: 'Menudo', precio: 90 }, { nombre: 'Caldo de pollo', precio: 70 }, { nombre: 'Birria', precio: 95 }],
    oferta: { titulo: 'Menudo + tortillas', descripcion: 'Plato grande de menudo con tortillas calientes.', precio: 85, porciones: 6 },
  },
  {
    id: 'd5', nombre: 'Gorditas La Abuela', tipo: 'Antojitos', abre: '09:00', cierra: '20:00',
    ubicacion: 'Col. Centro, Durango', distancia: 0.5,
    estrella: 'Gordita de chicharrón', etiquetas: ['Antojitos', 'Hecho en casa', 'Para llevar'],
    historia: 'Masa hecha a diario y guisados de olla. Lo que se acaba, se acaba.',
    local: 'Masa de maíz de molino local',
    menu: [{ nombre: 'Gordita de chicharrón', precio: 28 }, { nombre: 'Gordita de queso', precio: 28 }, { nombre: 'Gordita de picadillo', precio: 30 }],
    oferta: null,
  },
  {
    id: 'd6', nombre: 'Panadería La Espiga', tipo: 'Pan de pueblo', abre: '06:00', cierra: '14:00',
    ubicacion: 'Col. Silvestre Dorador, Durango', distancia: 1.6,
    estrella: 'Pan de pueblo recién horneado', etiquetas: ['Desayunos', 'Tradicional', 'Para llevar'],
    historia: 'Horno de leña y receta de tres generaciones. El pan sale por tandas toda la mañana.',
    local: 'Harina y piloncillo de la región',
    menu: [{ nombre: 'Pan de pueblo (pieza)', precio: 8 }, { nombre: 'Empanada', precio: 18 }, { nombre: 'Café de olla', precio: 25 }],
    oferta: { titulo: 'Bolsa de 8 panes del día', descripcion: 'Pan surtido de la última tanda, a precio especial.', precio: 49, porciones: 10 },
  },
  {
    id: 'd1', nombre: 'Tacos El Mezquite', tipo: 'Tacos', abre: '18:00', cierra: '01:00',
    ubicacion: 'Col. Centro, Durango', distancia: 0.6,
    estrella: 'Taco de asada al mezquite', etiquetas: ['Cenas', 'Antojitos', 'Para llevar'],
    historia: 'Don Beto asa la carne sobre leña de mezquite todas las noches desde hace 20 años.',
    local: 'Carne de ranchos de la región',
    menu: [{ nombre: 'Taco de asada', precio: 25 }, { nombre: 'Taco al pastor', precio: 22 }, { nombre: 'Gringa', precio: 55 }],
    oferta: { titulo: 'Gringas 2x1', descripcion: 'Sobró tortilla de harina: 2x1 en gringas.', precio: 55, porciones: 5 },
  },
  {
    id: 'd3', nombre: 'Bar El Alacrán', tipo: 'Bar', abre: '17:00', cierra: '02:00',
    ubicacion: 'Zona Centro, Durango', distancia: 0.9,
    estrella: 'Michelada de la casa', etiquetas: ['Bar', 'Cenas', 'Antojitos'],
    historia: 'Un bar de barrio con botanas caseras y cerveza bien fría.',
    local: '',
    menu: [{ nombre: 'Cerveza de barril', precio: 45 }, { nombre: 'Michelada', precio: 70 }, { nombre: 'Alitas', precio: 120 }],
    oferta: { titulo: 'Michelada + alitas', descripcion: 'Combo para compartir mientras dure el limón.', precio: 160, porciones: 4 },
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
