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
        <Text style={s.lema}>La comida de barrio de Durango, sin desperdicio.</Text>

        <TouchableOpacity style={[s.opcion, { backgroundColor: C.maiz }]} onPress={() => setModo('cliente')} activeOpacity={0.9}>
          <Text style={s.icono}>🍲</Text>
          <Text style={[s.opcionTitulo, { color: C.tinta }]}>Quiero comer rico</Text>
          <Text style={[s.opcionTexto, { color: '#4A3A00' }]}>Descubre negocios de la ciudad y aparta las ofertas de hoy.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.opcion, { backgroundColor: C.verde }]} onPress={() => setModo('negocio')} activeOpacity={0.9}>
          <Text style={s.icono}>🏪</Text>
          <Text style={[s.opcionTitulo, { color: C.blanco }]}>Tengo un negocio</Text>
          <Text style={[s.opcionTexto, { color: '#CBE7DB' }]}>Controla tu inventario, evita faltantes y vende lo que te sobra.</Text>
        </TouchableOpacity>
      </View>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  caja: { flex: 1, justifyContent: 'center', padding: 22 },
  marca: { fontSize: 44, fontWeight: '900', color: C.tinta, letterSpacing: -1.5 },
  lema: { fontSize: 17, color: C.suave, marginTop: 6, marginBottom: 30, lineHeight: 24 },
  opcion: { borderRadius: 22, padding: 22, marginBottom: 14 },
  icono: { fontSize: 34, marginBottom: 8 },
  opcionTitulo: { fontSize: 22, fontWeight: '800' },
  opcionTexto: { fontSize: 14, marginTop: 6, lineHeight: 20 },
});
