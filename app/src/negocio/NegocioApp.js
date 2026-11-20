import React, { useState } from 'react';
import { View } from 'react-native';
import { Pantalla, Encabezado, Boton, Pestanas } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import Resumen from './Resumen';
import Insumos from './Insumos';
import Cierre from './Cierre';
import Especial from './Especial';
import MiNegocio from './MiNegocio';

const PESTANAS = [
  { id: 'resumen', texto: 'Resumen', icono: '📋' },
  { id: 'insumos', texto: 'Insumos', icono: '📦' },
  { id: 'cierre', texto: 'Cierre', icono: '🌙' },
  { id: 'especial', texto: 'Especial', icono: '⭐' },
  { id: 'negocio', texto: 'Mi negocio', icono: '🏪' },
];
const TITULOS = {
  resumen: 'Resumen', insumos: 'Insumos', cierre: 'Cierre del día', especial: 'Especial del día', negocio: 'Mi negocio',
};

export default function NegocioApp() {
  const { estado, setModo } = useAlmacen();
  const [tab, setTab] = useState('resumen');

  return (
    <Pantalla>
      <Encabezado
        titulo={TITULOS[tab]}
        sub={estado.negocio.nombre || 'Modo negocio'}
        derecha={<Boton texto="Cambiar modo" tipo="suave" onPress={() => setModo(null)} style={{ paddingVertical: 8 }} />}
      />
      <View style={{ flex: 1 }}>
        {tab === 'resumen' && <Resumen irA={setTab} />}
        {tab === 'insumos' && <Insumos />}
        {tab === 'cierre' && <Cierre alTerminar={() => setTab('resumen')} />}
        {tab === 'especial' && <Especial />}
        {tab === 'negocio' && <MiNegocio />}
      </View>
      <Pestanas items={PESTANAS} activa={tab} onCambiar={setTab} />
    </Pantalla>
  );
}
