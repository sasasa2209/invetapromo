import React, { useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { Tarjeta, Etiqueta, Boton, Campo, Vacio, Porciones, estilos as e } from '../compartido/componentes';
import { useAlmacen, usadasHoy } from '../compartido/Almacen';
import { analizar, DIAS, diaSemana, fmt, hoyISO, sumaDias } from '../compartido/logica';
import { generarEspecial } from '../compartido/ia';
import { C } from '../compartido/tema';

export default function Especial() {
  const { estado, publicarEspecial, retirarEspecial } = useAlmacen();
  const [cargando, setCargando] = useState(false);
  const [borrador, setBorrador] = useState(null);

  const sobrantes = analizar(estado.insumos, estado.cierres).filter((a) => a.estado === 'sobra');
  const publicado = estado.especial?.activo && estado.especial.fecha === hoyISO() ? estado.especial : null;
  const apartadas = usadasHoy(estado).mio || 0;
  const diaManana = DIAS[diaSemana(sumaDias(hoyISO(), 1))];

  const generar = async () => {
    setCargando(true);
    const r = await generarEspecial({ negocio: estado.negocio, sobrantes, dia: diaManana });
    setBorrador({ ...r, porciones: '10' });
    setCargando(false);
  };

  if (!estado.insumos.length) {
    return <Vacio icono="⭐" titulo="Sin insumos" texto="Registra tus insumos y haz un cierre para generar un especial." />;
  }

  return (
    <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      {publicado && (
        <Tarjeta style={{ backgroundColor: C.verdeClaro, borderColor: C.verde }}>
          <Etiqueta texto="Publicado para clientes" tono="verde" />
          <Text style={[e.nombre, { marginTop: 8, fontSize: 18 }]}>{publicado.titulo}</Text>
          <Text style={e.detalle}>{publicado.descripcion}</Text>
          <Text style={[e.nombre, { marginVertical: 6 }]}>${publicado.precio}</Text>
          <Porciones quedan={Math.max(0, publicado.porciones - apartadas)} total={publicado.porciones} />
          <Boton texto="Retirar oferta" tipo="peligro" onPress={retirarEspecial} style={{ marginTop: 12 }} />
        </Tarjeta>
      )}

      <Text style={e.seccion}>Lo que te sobra o está por caducar</Text>
      {sobrantes.length === 0 && <Text style={e.detalle}>No hay sobrantes ahora mismo. Haz tu cierre del día para actualizar.</Text>}
      {sobrantes.map((a) => (
        <Tarjeta key={a.insumo.id}>
          <View style={e.fila}>
            <Text style={e.nombre}>{a.insumo.nombre}</Text>
            <Etiqueta tono="verde" texto={`${fmt(a.insumo.stock)} ${a.insumo.unidad}`} />
          </View>
        </Tarjeta>
      ))}

      <Boton texto={cargando ? 'Pensando...' : '✨ Generar especial con IA'} onPress={generar} deshabilitado={cargando || sobrantes.length === 0} style={{ marginTop: 6 }} />
      {cargando && <ActivityIndicator color={C.verde} style={{ marginTop: 12 }} />}

      {borrador && !cargando && (
        <View style={{ marginTop: 16 }}>
          <Text style={e.seccion}>Tu especial (puedes editarlo)</Text>
          <Etiqueta texto={borrador.origen === 'ia' ? 'Generado con IA' : 'Sugerencia (sin clave de IA, usando plantilla)'} tono={borrador.origen === 'ia' ? 'verde' : 'gris'} />
          <View style={{ height: 10 }} />
          <Campo etiqueta="Nombre del especial" value={borrador.titulo} onChangeText={(v) => setBorrador({ ...borrador, titulo: v })} />
          <Campo etiqueta="Descripción" multiline value={borrador.descripcion} onChangeText={(v) => setBorrador({ ...borrador, descripcion: v })} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Campo style={{ flex: 1 }} etiqueta="Precio (MXN)" keyboardType="decimal-pad" value={borrador.precio} onChangeText={(v) => setBorrador({ ...borrador, precio: v })} />
            <Campo style={{ flex: 1 }} etiqueta="Porciones disponibles" keyboardType="number-pad" value={borrador.porciones} onChangeText={(v) => setBorrador({ ...borrador, porciones: v })} />
          </View>
          <Boton texto="Publicar para clientes" onPress={() => { publicarEspecial(borrador); setBorrador(null); }} style={{ marginBottom: 8 }} />
          <Boton texto="Generar otro" tipo="suave" onPress={generar} />
        </View>
      )}
    </ScrollView>
  );
}
