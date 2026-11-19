import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pantalla } from './componentes';
import { useAlmacen } from './Almacen';
import { C } from './tema';

export default function ElegirModo() {
  const { setModo } = useAlmacen();
  return (
    <Pantalla>
      <View style={s.caja}>
        <Text style={s.marca}>Sobra Cero</Text>
        <Text style={s.lema}>Que no te falte nada hoy y no te sobre nada mañana.</Text>

        <TouchableOpacity style={[s.opcion, { backgroundColor: C.verde }]} onPress={() => setModo('negocio')}>
          <Text style={[s.opcionTitulo, { color: C.blanco }]}>Tengo un negocio</Text>
          <Text style={[s.opcionTexto, { color: '#CBE7DB' }]}>Controla tu inventario, recibe alertas y publica tu especial del día.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.opcion, { backgroundColor: C.maiz }]} onPress={() => setModo('cliente')}>
          <Text style={[s.opcionTitulo, { color: C.tinta }]}>Busco dónde comer</Text>
          <Text style={[s.opcionTexto, { color: '#4A3A00' }]}>Mira qué hay cerca y las ofertas de hoy en Durango.</Text>
        </TouchableOpacity>
      </View>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  caja: { flex: 1, justifyContent: 'center', padding: 22 },
  marca: { fontSize: 40, fontWeight: '900', color: C.tinta },
  lema: { fontSize: 16, color: C.suave, marginTop: 6, marginBottom: 32 },
  opcion: { borderRadius: 18, padding: 22, marginBottom: 14 },
  opcionTitulo: { fontSize: 22, fontWeight: '800' },
  opcionTexto: { fontSize: 14, marginTop: 6, lineHeight: 20 },
});
