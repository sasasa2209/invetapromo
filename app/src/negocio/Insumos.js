import React, { useState } from 'react';
import { ScrollView, View, Text, Modal, Alert } from 'react-native';
import { Tarjeta, Etiqueta, Vacio, Boton, Campo, Pantalla, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { fmt, num } from '../compartido/logica';

const VACIO = { id: null, nombre: '', unidad: 'kg', minimo: '', stock: '', caduca: '' };

export default function Insumos() {
  const { estado, guardarInsumo, borrarInsumo, cargarDemo } = useAlmacen();
  const [form, setForm] = useState(null);

  const abrir = (i) =>
    setForm(i ? { ...i, minimo: String(i.minimo), stock: String(i.stock), caduca: i.caduca || '' } : { ...VACIO });
  const guardar = () => {
    if (!form.nombre.trim()) return Alert.alert('Falta el nombre', 'Escribe cómo se llama el insumo.');
    guardarInsumo({ ...form, nombre: form.nombre.trim(), unidad: form.unidad.trim() || 'pzas', minimo: num(form.minimo), stock: num(form.stock) });
    setForm(null);
  };
  const cambia = (k) => (v) => setForm({ ...form, [k]: v });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
        <Boton texto="Agregar insumo" onPress={() => abrir(null)} style={{ marginBottom: 12 }} />
        {estado.insumos.length === 0 && (
          <Vacio titulo="Sin insumos" texto="Agrega carne, tortillas, limones, cerveza... con su unidad y un mínimo de alerta.">
            <Boton texto="Cargar datos de ejemplo" tipo="suave" onPress={cargarDemo} />
          </Vacio>
        )}
        {estado.insumos.map((i) => (
          <Tarjeta key={i.id} onPress={() => abrir(i)}>
            <View style={e.fila}>
              <View style={{ flex: 1 }}>
                <Text style={e.nombre}>{i.nombre}</Text>
                <Text style={e.detalle}>
                  Mínimo {fmt(i.minimo)} {i.unidad}{i.caduca ? `  ·  Caduca ${i.caduca}` : ''}
                </Text>
              </View>
              <Etiqueta texto={`${fmt(i.stock)} ${i.unidad}`} tono={i.stock <= i.minimo ? 'chile' : 'verde'} />
            </View>
          </Tarjeta>
        ))}
      </ScrollView>

      <Modal visible={!!form} animationType="slide" onRequestClose={() => setForm(null)}>
        <Pantalla>
          {form && (
            <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
              <Text style={[e.nombre, { fontSize: 20, marginBottom: 14 }]}>{form.id ? 'Editar insumo' : 'Nuevo insumo'}</Text>
              <Campo etiqueta="Nombre" value={form.nombre} onChangeText={cambia('nombre')} placeholder="Ej. Carne asada" />
              <Campo etiqueta="Unidad" value={form.unidad} onChangeText={cambia('unidad')} placeholder="kg, pzas, litros..." />
              <Campo etiqueta="Mínimo de alerta" value={form.minimo} onChangeText={cambia('minimo')} keyboardType="decimal-pad" placeholder="Avísame cuando quede esto" />
              <Campo etiqueta="Cantidad que tienes ahora" value={form.stock} onChangeText={cambia('stock')} keyboardType="decimal-pad" />
              <Campo etiqueta="Fecha de caducidad (opcional)" value={form.caduca} onChangeText={cambia('caduca')} placeholder="AAAA-MM-DD" />
              <Boton texto="Guardar" onPress={guardar} style={{ marginBottom: 10 }} />
              {form.id && (
                <Boton texto="Borrar insumo" tipo="peligro" onPress={() => { borrarInsumo(form.id); setForm(null); }} style={{ marginBottom: 10 }} />
              )}
              <Boton texto="Cancelar" tipo="suave" onPress={() => setForm(null)} />
            </ScrollView>
          )}
        </Pantalla>
      </Modal>
    </View>
  );
}
