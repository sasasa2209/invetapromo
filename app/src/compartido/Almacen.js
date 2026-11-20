import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { diaSemana, hoyISO, num, redondea } from './logica';
import { generarDemo } from './datos';

// Guarda todo en el dispositivo (AsyncStorage). Cuando conecten Supabase, solo hay
// que cambiar las funciones de este archivo: las pantallas no se tocan.
const KEY = 'sobracero:v1';

const inicial = () => ({
  modo: null, // 'negocio' | 'cliente'
  negocio: {
    nombre: '', tipo: '', abre: '09:00', cierra: '22:00', ubicacion: '', menuTexto: '',
    estrella: '', historia: '', etiquetas: [], local: '', whatsapp: '',
  },
  insumos: [],
  cierres: [],
  especial: null, // { titulo, descripcion, precio, porciones, fecha, activo, origen }
  favoritos: [], // ids de negocios
  apartados: [], // { id, negocioId, negocio, titulo, codigo, fecha }
  usadas: { fecha: '', n: {} }, // porciones apartadas hoy por negocio
});

// Porciones ya apartadas hoy { idNegocio: cantidad }
export const usadasHoy = (s) => (s.usadas && s.usadas.fecha === hoyISO() ? s.usadas.n : {});

const Ctx = createContext(null);
export const useAlmacen = () => useContext(Ctx);

export function AlmacenProvider({ children }) {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const base = inicial();
        if (!raw) return setEstado(base);
        const g = JSON.parse(raw);
        setEstado({ ...base, ...g, negocio: { ...base.negocio, ...g.negocio }, usadas: g.usadas || base.usadas });
      })
      .catch(() => setEstado(inicial()));
  }, []);

  useEffect(() => {
    if (estado) AsyncStorage.setItem(KEY, JSON.stringify(estado)).catch(() => {});
  }, [estado]);

  const act = useCallback((fn) => setEstado((s) => fn(s)), []);

  const acciones = {
    setModo: (modo) => act((s) => ({ ...s, modo })),
    guardarNegocio: (negocio) => act((s) => ({ ...s, negocio })),
    guardarInsumo: (ins) =>
      act((s) => {
        const existe = s.insumos.some((i) => i.id === ins.id);
        const insumos = existe
          ? s.insumos.map((i) => (i.id === ins.id ? ins : i))
          : [...s.insumos, { ...ins, id: 'i' + Date.now() }];
        return { ...s, insumos };
      }),
    borrarInsumo: (id) => act((s) => ({ ...s, insumos: s.insumos.filter((i) => i.id !== id) })),
    registrarCierre: ({ compras, quedo }) =>
      act((s) => {
        const hoy = hoyISO();
        const previo = s.cierres.find((c) => c.fecha === hoy);
        const ini = {}, com = {}, fin = {}, consumo = {};
        s.insumos.forEach((i) => {
          const base = previo?.inicial?.[i.id] ?? i.stock;
          ini[i.id] = base;
          com[i.id] = num(compras[i.id]);
          fin[i.id] = num(quedo[i.id]);
          consumo[i.id] = Math.max(0, redondea(base + com[i.id] - fin[i.id]));
        });
        const nuevo = { fecha: hoy, dia: diaSemana(hoy), inicial: ini, compras: com, final: fin, consumo };
        return {
          ...s,
          insumos: s.insumos.map((i) => ({ ...i, stock: fin[i.id] })),
          cierres: [...s.cierres.filter((c) => c.fecha !== hoy), nuevo],
        };
      }),
    publicarEspecial: (e) =>
      act((s) => {
        const hoy = hoyISO();
        const yaApartadas = s.apartados.filter((a) => a.negocioId === 'mio' && a.fecha === hoy).length;
        return {
          ...s,
          especial: { ...e, fecha: hoy, activo: true, porciones: Math.max(1, Math.round(num(e.porciones)) || 10) },
          usadas: { fecha: hoy, n: { ...usadasHoy(s), mio: yaApartadas } },
        };
      }),
    retirarEspecial: () => act((s) => ({ ...s, especial: s.especial ? { ...s.especial, activo: false } : null })),
    toggleFavorito: (id) =>
      act((s) => ({ ...s, favoritos: s.favoritos.includes(id) ? s.favoritos.filter((x) => x !== id) : [...s.favoritos, id] })),
    apartar: (neg, oferta) =>
      act((s) => {
        const hoy = hoyISO();
        const u = usadasHoy(s);
        const ap = {
          id: 'a' + Date.now(), negocioId: neg.id, negocio: neg.nombre, titulo: oferta.titulo,
          codigo: 'SC-' + (100 + Math.floor(Math.random() * 900)), fecha: hoy,
        };
        return { ...s, usadas: { fecha: hoy, n: { ...u, [neg.id]: (u[neg.id] || 0) + 1 } }, apartados: [ap, ...s.apartados] };
      }),
    cargarDemo: () => act((s) => ({ ...s, ...generarDemo(hoyISO()) })),
    reiniciar: () => act(() => inicial()),
  };

  return <Ctx.Provider value={{ estado, ...acciones }}>{children}</Ctx.Provider>;
}
