import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { diaSemana, hoyISO, num, redondea } from './logica';
import { generarDemo } from './datos';

// Guarda todo en el celular (AsyncStorage). Cuando conecten Supabase, solo hay
// que cambiar las funciones de este archivo: las pantallas no se tocan.
const KEY = 'sobracero:v1';

const inicial = () => ({
  modo: null, // 'negocio' | 'cliente'
  negocio: { nombre: '', tipo: '', abre: '09:00', cierra: '22:00', ubicacion: '', menuTexto: '' },
  insumos: [],
  cierres: [],
  especial: null, // { titulo, descripcion, precio, fecha, activo, origen }
});

const Ctx = createContext(null);
export const useAlmacen = () => useContext(Ctx);

export function AlmacenProvider({ children }) {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setEstado(raw ? { ...inicial(), ...JSON.parse(raw) } : inicial()))
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
    publicarEspecial: (e) => act((s) => ({ ...s, especial: { ...e, fecha: hoyISO(), activo: true } })),
    retirarEspecial: () => act((s) => ({ ...s, especial: s.especial ? { ...s.especial, activo: false } : null })),
    cargarDemo: () => act((s) => ({ ...s, ...generarDemo(hoyISO()) })),
    reiniciar: () => act(() => inicial()),
  };

  return <Ctx.Provider value={{ estado, ...acciones }}>{children}</Ctx.Provider>;
}
