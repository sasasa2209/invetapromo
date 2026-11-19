import React, { useState } from 'react';
import { ScrollView, Text, Alert } from 'react-native';
import { Boton, Campo, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';

export default function MiNegocio() {
  const { estado, guardarNegocio, reiniciar } = useAlmacen();
  const [f, setF] = useState(estado.negocio);
  const cambia = (k) => (v) => setF({ ...f, [k]: v });

  return (
    <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      <Text style={[e.detalle, { marginBottom: 12 }]}>Esto es lo que verán tus clientes.</Text>
      <Campo etiqueta="Nombre del negocio" value={f.nombre} onChangeText={cambia('nombre')} placeholder="Ej. Tacos Don Beto" />
      <Campo etiqueta="Tipo de comida" value={f.tipo} onChangeText={cambia('tipo')} placeholder="Tacos, bar, comida corrida..." />
      <Campo etiqueta="Abre (HH:MM)" value={f.abre} onChangeText={cambia('abre')} placeholder="09:00" />
      <Campo etiqueta="Cierra (HH:MM)" value={f.cierra} onChangeText={cambia('cierra')} placeholder="22:00" />
      <Campo etiqueta="Ubicación" value={f.ubicacion} onChangeText={cambia('ubicacion')} placeholder="Colonia y calle" />
      <Campo
        etiqueta="Menú (un platillo por línea: nombre y precio)"
        multiline style={{ minHeight: 100 }}
        value={f.menuTexto} onChangeText={cambia('menuTexto')}
        placeholder={'Taco de asada 25\nGringa 55'}
      />
      <Boton texto="Guardar" onPress={() => { guardarNegocio(f); Alert.alert('Guardado', 'Tu negocio ya aparece en el modo cliente.'); }} style={{ marginBottom: 24 }} />
      <Boton texto="Borrar todos los datos" tipo="peligro" onPress={() => Alert.alert('¿Borrar todo?', 'Se borran insumos, cierres y tu negocio.', [{ text: 'Cancelar' }, { text: 'Borrar', style: 'destructive', onPress: reiniciar }])} />
    </ScrollView>
  );
}
