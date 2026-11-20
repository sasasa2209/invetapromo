import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView,
  Platform, StatusBar, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { C } from './tema';

export function Pantalla({ children }) {
  return (
    <SafeAreaView style={[s.pantalla, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight || 0 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Encabezado({ titulo, sub, derecha }) {
  return (
    <View style={s.encabezado}>
      <View style={{ flex: 1, paddingRight: 8 }}>
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
    <Comp onPress={onPress} activeOpacity={0.9} style={[s.tarjeta, style]}>
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

// Botón de filtro que se enciende y se apaga
export function Chip({ texto, activo, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[s.chip, activo && s.chipActivo]}>
      <Text style={[s.chipTexto, activo && { color: C.blanco }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

export function FilaChips({ children }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 10 }} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
      {children}
    </ScrollView>
  );
}

// Barra de porciones: "Quedan 6 de 10" / "¡Últimas 2!"
export function Porciones({ quedan, total }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, quedan / total)) : 0;
  const poco = quedan <= 3;
  return (
    <View>
      <View style={s.barraFondo}>
        <View style={{ height: 8, borderRadius: 4, width: `${pct * 100}%`, backgroundColor: poco ? C.chile : C.verde }} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '800', color: poco ? C.chile : C.suave, marginTop: 5 }}>
        {quedan <= 0 ? 'Agotado' : quedan <= 3 ? `¡Últimas ${quedan}!` : `Quedan ${quedan} de ${total}`}
      </Text>
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

export function Vacio({ icono, titulo, texto, children }) {
  return (
    <View style={s.vacio}>
      {icono ? <Text style={{ fontSize: 42, marginBottom: 6 }}>{icono}</Text> : null}
      <Text style={[s.titulo, { fontSize: 18, textAlign: 'center' }]}>{titulo}</Text>
      <Text style={[s.sub, { textAlign: 'center', marginVertical: 8 }]}>{texto}</Text>
      {children}
    </View>
  );
}

export function Pestanas({ items, activa, onCambiar }) {
  return (
    <View style={s.pestanas}>
      {items.map((it) => {
        const on = activa === it.id;
        return (
          <TouchableOpacity key={it.id} style={s.pestana} onPress={() => onCambiar(it.id)} activeOpacity={0.7}>
            <View style={[s.pestanaIcono, on && { backgroundColor: C.verdeClaro }]}>
              <Text style={{ fontSize: 20 }}>{it.icono}</Text>
            </View>
            <Text style={[s.pestanaTexto, on && { color: C.verde, fontWeight: '800' }]}>{it.texto}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 40 },
  seccion: { fontSize: 17, fontWeight: '800', color: C.tinta, marginTop: 14, marginBottom: 8 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nombre: { fontSize: 16, fontWeight: '700', color: C.tinta },
  detalle: { fontSize: 14, color: C.suave, marginTop: 2, lineHeight: 20 },
});

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  encabezado: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  titulo: { fontSize: 26, fontWeight: '900', color: C.tinta, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: C.suave, marginTop: 2, lineHeight: 20 },
  boton: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, alignItems: 'center' },
  botonTexto: { fontSize: 15, fontWeight: '800' },
  tarjeta: { backgroundColor: C.blanco, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.linea },
  etiqueta: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: C.blanco, borderWidth: 1, borderColor: C.linea },
  chipActivo: { backgroundColor: C.verde, borderColor: C.verde },
  chipTexto: { fontSize: 14, fontWeight: '700', color: C.tinta },
  barraFondo: { height: 8, borderRadius: 4, backgroundColor: '#E3E9E5', overflow: 'hidden' },
  campoEtiqueta: { fontSize: 13, fontWeight: '700', color: C.suave, marginBottom: 5 },
  input: { backgroundColor: C.blanco, borderWidth: 1, borderColor: C.linea, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: C.tinta },
  vacio: { alignItems: 'center', padding: 28 },
  pestanas: { flexDirection: 'row', backgroundColor: C.blanco, borderTopWidth: 1, borderTopColor: C.linea, paddingBottom: 8, paddingTop: 6 },
  pestana: { flex: 1, alignItems: 'center' },
  pestanaIcono: { width: 46, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  pestanaTexto: { fontSize: 11, color: C.suave, fontWeight: '600', marginTop: 2 },
});
