import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { avisar } from '../compartido/aviso';
import { Tarjeta, Etiqueta, Vacio, Boton, Campo, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { calcularConsumo, fmt, hoyISO, num, redondea } from '../compartido/logica';

export default function Cierre({ alTerminar }) {
  const { estado, registrarCierre } = useAlmacen();
  const hoy = hoyISO();
  const previo = estado.cierres.find((c) => c.fecha === hoy);
  const [compras, setCompras] = useState(() =>
    previo ? Object.fromEntries(Object.entries(previo.compras || {}).map(([k, v]) => [k, v ? String(v) : ''])) : {});
  const [quedo, setQuedo] = useState(() =>
    previo ? Object.fromEntries(Object.entries(previo.final || {}).map(([k, v]) => [k, String(v)])) : {});

  if (!estado.insumos.length) {
    return <Vacio titulo="Primero registra tus insumos" texto="Sin insumos no hay nada que cerrar. Ve a la pestaña Insumos." />;
  }

  const base = (i) => previo?.inicial?.[i.id] ?? i.stock;
  const faltan = estado.insumos.filter((i) => (quedo[i.id] ?? '') === '').length;

  const cerrar = () => {
    registrarCierre({ compras, quedo });
    avisar('Cierre guardado', 'Ya actualizamos tu inventario, las alertas y la predicción.');
    alTerminar();
  };

  return (
    <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      <Text style={[e.detalle, { marginBottom: 12 }]}>
        Escribe lo que compraste hoy y lo que te quedó. El consumo se calcula solo: lo que tenías + lo que compraste − lo que quedó.
      </Text>

      {estado.insumos.map((i) => {
        const hayQuedo = (quedo[i.id] ?? '') !== '';
        const consumo = redondea(calcularConsumo(base(i), num(compras[i.id]), num(quedo[i.id])));
        return (
          <Tarjeta key={i.id}>
            <View style={e.fila}>
              <Text style={e.nombre}>{i.nombre}</Text>
              <Text style={e.detalle}>Tenías {fmt(base(i))} {i.unidad}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Campo style={{ flex: 1, marginBottom: 0 }} etiqueta="Compré hoy" keyboardType="decimal-pad" placeholder="0"
                value={compras[i.id] ?? ''} onChangeText={(v) => setCompras({ ...compras, [i.id]: v })} />
              <Campo style={{ flex: 1, marginBottom: 0 }} etiqueta="Me quedó" keyboardType="decimal-pad" placeholder="0"
                value={quedo[i.id] ?? ''} onChangeText={(v) => setQuedo({ ...quedo, [i.id]: v })} />
            </View>
            {hayQuedo && (
              <View style={{ marginTop: 10 }}>
                {consumo < 0
                  ? <Etiqueta tono="chile" texto="Revisa: te quedó más de lo que había" />
                  : <Etiqueta tono="verde" texto={`Consumo de hoy: ${fmt(consumo)} ${i.unidad}`} />}
              </View>
            )}
          </Tarjeta>
        );
      })}

      <Boton texto={previo ? 'Actualizar cierre de hoy' : 'Cerrar el día'} onPress={cerrar} deshabilitado={faltan > 0} />
      {faltan > 0 && <Text style={[e.detalle, { textAlign: 'center', marginTop: 8 }]}>Falta capturar "Me quedó" en {faltan} insumo(s).</Text>}
    </ScrollView>
  );
}
