import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Boton, Campo, Chip, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { ETIQUETAS } from '../compartido/datos';
import { avisar, confirmar } from '../compartido/aviso';

export default function MiNegocio() {
  const { estado, guardarNegocio, reiniciar } = useAlmacen();
  const [f, setF] = useState(estado.negocio);
  const cambia = (k) => (v) => setF({ ...f, [k]: v });
  const alterna = (t) =>
    setF({ ...f, etiquetas: f.etiquetas.includes(t) ? f.etiquetas.filter((x) => x !== t) : [...f.etiquetas, t] });

  return (
    <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
      <Text style={[e.detalle, { marginBottom: 12 }]}>Esto es lo que verán tus clientes. Entre más real y cercano, mejor.</Text>

      <Campo etiqueta="Nombre del negocio" value={f.nombre} onChangeText={cambia('nombre')} placeholder="Ej. Tacos Don Beto" />
      <Campo etiqueta="Tipo de comida" value={f.tipo} onChangeText={cambia('tipo')} placeholder="Tacos, bar, comida corrida..." />
      <Campo etiqueta="Tu platillo estrella" value={f.estrella} onChangeText={cambia('estrella')} placeholder="Ej. Caldillo duranguense" />
      <Campo etiqueta="Tu historia (2 líneas)" multiline style={{ minHeight: 70 }} value={f.historia} onChangeText={cambia('historia')} placeholder="Desde cuándo, quién cocina, qué los hace especiales" />

      <Text style={[e.nombre, { marginBottom: 8 }]}>¿Cómo es tu comida?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {ETIQUETAS.map((t) => <Chip key={t} texto={t} activo={f.etiquetas.includes(t)} onPress={() => alterna(t)} />)}
      </View>

      <Campo etiqueta="Ingredientes de la región (opcional)" value={f.local} onChangeText={cambia('local')} placeholder="Ej. Queso y chile de productores locales" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Campo style={{ flex: 1 }} etiqueta="Abre (HH:MM)" value={f.abre} onChangeText={cambia('abre')} placeholder="09:00" />
        <Campo style={{ flex: 1 }} etiqueta="Cierra (HH:MM)" value={f.cierra} onChangeText={cambia('cierra')} placeholder="22:00" />
      </View>
      <Campo etiqueta="Ubicación" value={f.ubicacion} onChangeText={cambia('ubicacion')} placeholder="Calle y colonia" />
      <Campo etiqueta="WhatsApp (con lada, solo números)" keyboardType="phone-pad" value={f.whatsapp} onChangeText={cambia('whatsapp')} placeholder="526181234567" />
      <Campo
        etiqueta="Menú (un platillo por línea: nombre y precio)"
        multiline style={{ minHeight: 100 }}
        value={f.menuTexto} onChangeText={cambia('menuTexto')}
        placeholder={'Taco de asada 25\nGringa 55'}
      />

      <Boton texto="Guardar" onPress={() => { guardarNegocio(f); avisar('Guardado', 'Tu negocio ya aparece en el modo cliente.'); }} style={{ marginBottom: 24 }} />
      <Boton texto="Borrar todos los datos" tipo="peligro" onPress={() => confirmar('¿Borrar todo?', 'Se borran insumos, cierres y tu negocio.', reiniciar)} />
    </ScrollView>
  );
}
