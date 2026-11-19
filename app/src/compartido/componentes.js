import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView,
  Platform, StatusBar, KeyboardAvoidingView,
} from 'react-native';
import { C } from './tema';

export function Pantalla({ children }) {
  return (
    <SafeAreaView style={[s.pantalla, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight || 0 }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Encabezado({ titulo, sub, derecha }) {
  return (
    <View style={s.encabezado}>
      <View style={{ flex: 1 }}>
        <Text style={s.titulo}>{titulo}</Text>
        {sub ? <Text style={s.sub}>{sub}</Text> : null}
      </View>
      {derecha}
    </View>
  );
}

export function Boton({ texto, onPress, tipo = 'primario', deshabilitado, style }) {
  const fondo = { primario: C.verde, suave: C.verdeClaro, peligro: C.chileClaro, maiz: C.maiz }[tipo];
  const color = { primario: C.blanco, suave: C.verde, peligro: C.chile, maiz: C.tinta }[tipo];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={deshabilitado}
      activeOpacity={0.8}
      style={[s.boton, { backgroundColor: fondo, opacity: deshabilitado ? 0.45 : 1 }, style]}
    >
      <Text style={[s.botonTexto, { color }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

export function Tarjeta({ children, onPress, style }) {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp onPress={onPress} activeOpacity={0.85} style={[s.tarjeta, style]}>
      {children}
    </Comp>
  );
}

const TONOS = {
  verde: [C.verdeClaro, C.verde],
  maiz: [C.maizClaro, '#7A5A00'],
  chile: [C.chileClaro, C.chile],
  gris: ['#E9EEEB', C.suave],
};
export function Etiqueta({ texto, tono = 'gris' }) {
  const [fondo, color] = TONOS[tono];
  return (
    <View style={[s.etiqueta, { backgroundColor: fondo }]}>
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{texto}</Text>
    </View>
  );
}

export function Campo({ etiqueta, style, ...props }) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {etiqueta ? <Text style={s.campoEtiqueta}>{etiqueta}</Text> : null}
      <TextInput placeholderTextColor="#9AA8A1" style={s.input} {...props} />
    </View>
  );
}

export function Vacio({ titulo, texto, children }) {
  return (
    <View style={s.vacio}>
      <Text style={[s.titulo, { fontSize: 18, textAlign: 'center' }]}>{titulo}</Text>
      <Text style={[s.sub, { textAlign: 'center', marginVertical: 8 }]}>{texto}</Text>
      {children}
    </View>
  );
}

export function Pestanas({ items, activa, onCambiar }) {
  return (
    <View style={s.pestanas}>
      {items.map((it) => (
        <TouchableOpacity key={it.id} style={s.pestana} onPress={() => onCambiar(it.id)}>
          <View style={[s.pestanaPunto, activa === it.id && { backgroundColor: C.verde }]} />
          <Text style={[s.pestanaTexto, activa === it.id && { color: C.verde, fontWeight: '800' }]}>{it.texto}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32 },
  seccion: { fontSize: 15, fontWeight: '800', color: C.tinta, marginTop: 8, marginBottom: 8 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nombre: { fontSize: 16, fontWeight: '700', color: C.tinta },
  detalle: { fontSize: 13, color: C.suave, marginTop: 2 },
});

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  encabezado: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  titulo: { fontSize: 24, fontWeight: '800', color: C.tinta },
  sub: { fontSize: 14, color: C.suave, marginTop: 2 },
  boton: { paddingVertical: 13, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
  botonTexto: { fontSize: 15, fontWeight: '800' },
  tarjeta: {
    backgroundColor: C.blanco, borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: C.linea,
  },
  etiqueta: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  campoEtiqueta: { fontSize: 13, fontWeight: '700', color: C.suave, marginBottom: 4 },
  input: {
    backgroundColor: C.blanco, borderWidth: 1, borderColor: C.linea, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: C.tinta,
  },
  vacio: { alignItems: 'center', padding: 28 },
  pestanas: { flexDirection: 'row', backgroundColor: C.blanco, borderTopWidth: 1, borderTopColor: C.linea, paddingBottom: 6 },
  pestana: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  pestanaPunto: { width: 22, height: 4, borderRadius: 2, backgroundColor: 'transparent', marginBottom: 5 },
  pestanaTexto: { fontSize: 12, color: C.suave, fontWeight: '600' },
});
