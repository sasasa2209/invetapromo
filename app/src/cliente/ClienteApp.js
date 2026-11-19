import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Modal } from 'react-native';
import { Pantalla, Encabezado, Boton, Pestanas, Tarjeta, Etiqueta, Campo, Vacio, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { NEGOCIOS_DEMO } from '../compartido/datos';
import { estaAbierto, hoyISO, normaliza, num } from '../compartido/logica';
import { C } from '../compartido/tema';

const PESTANAS = [
  { id: 'cerca', texto: 'Cerca de mí' },
  { id: 'ofertas', texto: 'Ofertas de hoy' },
  { id: 'buscar', texto: 'Buscar' },
];

// "Taco de asada 25" -> { nombre, precio }
function parseMenu(txt) {
  return String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(/^(.*?)[\s$]*(\d+(?:[.,]\d+)?)$/);
    return m ? { nombre: m[1].trim(), precio: num(m[2]) } : { nombre: l, precio: null };
  });
}

function useNegocios() {
  const { estado } = useAlmacen();
  return useMemo(() => {
    const lista = [...NEGOCIOS_DEMO];
    const n = estado.negocio;
    if (n.nombre.trim()) {
      const esp = estado.especial;
      lista.unshift({
        id: 'mio', nombre: n.nombre, tipo: n.tipo || 'Comida', abre: n.abre, cierra: n.cierra,
        ubicacion: n.ubicacion || 'Durango', distancia: 0.3, menu: parseMenu(n.menuTexto),
        oferta: esp && esp.activo && esp.fecha === hoyISO() ? { titulo: esp.titulo, descripcion: esp.descripcion, precio: num(esp.precio) } : null,
      });
    }
    return lista.sort((a, b) => a.distancia - b.distancia);
  }, [estado.negocio, estado.especial]);
}

function TarjetaNegocio({ n, onPress }) {
  const abierto = estaAbierto(n.abre, n.cierra);
  return (
    <Tarjeta onPress={onPress}>
      <View style={e.fila}>
        <Text style={[e.nombre, { flex: 1 }]}>{n.nombre}</Text>
        <Etiqueta texto={abierto ? 'Abierto' : 'Cerrado'} tono={abierto ? 'verde' : 'gris'} />
      </View>
      <Text style={e.detalle}>{n.tipo}  ·  {n.distancia} km  ·  {n.abre} a {n.cierra}</Text>
      {n.oferta && (
        <View style={{ marginTop: 8 }}><Etiqueta texto={`Oferta: ${n.oferta.titulo}`} tono="maiz" /></View>
      )}
    </Tarjeta>
  );
}

function TarjetaOferta({ n, onPress }) {
  return (
    <Tarjeta onPress={onPress} style={{ borderColor: C.maiz, backgroundColor: '#FFFBEA' }}>
      <Text style={e.detalle}>{n.nombre}  ·  {n.distancia} km</Text>
      <Text style={[e.nombre, { fontSize: 18, marginTop: 4 }]}>{n.oferta.titulo}</Text>
      <Text style={[e.detalle, { marginTop: 4 }]}>{n.oferta.descripcion}</Text>
      <Text style={[e.nombre, { marginTop: 8 }]}>${n.oferta.precio}</Text>
    </Tarjeta>
  );
}

export default function ClienteApp() {
  const { setModo } = useAlmacen();
  const negocios = useNegocios();
  const [tab, setTab] = useState('cerca');
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState('');

  const conOferta = negocios.filter((n) => n.oferta);
  const t = normaliza(q.trim());
  const resultados = t
    ? negocios
        .map((n) => {
          const platillos = n.menu.filter((m) => normaliza(m.nombre).includes(t));
          const enOferta = n.oferta && normaliza(n.oferta.titulo + ' ' + n.oferta.descripcion).includes(t);
          const porNombre = normaliza(n.nombre + ' ' + n.tipo).includes(t);
          return porNombre || platillos.length || enOferta ? { n, platillos, enOferta } : null;
        })
        .filter(Boolean)
    : [];

  const titulos = { cerca: 'Cerca de mí', ofertas: 'Ofertas de hoy', buscar: 'Buscar' };

  return (
    <Pantalla>
      <Encabezado
        titulo={titulos[tab]} sub="Durango"
        derecha={<Boton texto="Cambiar modo" tipo="suave" onPress={() => setModo(null)} style={{ paddingVertical: 8 }} />}
      />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
          {tab === 'cerca' && negocios.map((n) => <TarjetaNegocio key={n.id} n={n} onPress={() => setSel(n)} />)}

          {tab === 'ofertas' && (
            conOferta.length
              ? conOferta.map((n) => <TarjetaOferta key={n.id} n={n} onPress={() => setSel(n)} />)
              : <Vacio titulo="Sin ofertas por ahora" texto="Los negocios publican sus especiales del día. Vuelve más tarde." />
          )}

          {tab === 'buscar' && (
            <>
              <Campo placeholder="Busca un platillo o tipo de comida (taco, caldo, cerveza...)" value={q} onChangeText={setQ} />
              {t && resultados.length === 0 && <Text style={e.detalle}>Nadie tiene "{q}" por ahora.</Text>}
              {resultados.map(({ n, platillos }) => (
                <Tarjeta key={n.id} onPress={() => setSel(n)}>
                  <Text style={e.nombre}>{n.nombre}</Text>
                  <Text style={e.detalle}>{n.tipo}  ·  {n.distancia} km</Text>
                  {platillos.map((m, k) => (
                    <Text key={k} style={[e.detalle, { color: C.tinta }]}>{m.nombre}{m.precio != null ? `  ·  $${m.precio}` : ''}</Text>
                  ))}
                </Tarjeta>
              ))}
            </>
          )}
        </ScrollView>
      </View>
      <Pestanas items={PESTANAS} activa={tab} onCambiar={setTab} />

      <Modal visible={!!sel} animationType="slide" onRequestClose={() => setSel(null)}>
        <Pantalla>
          {sel && (
            <ScrollView contentContainerStyle={e.contenido}>
              <Text style={[e.nombre, { fontSize: 24 }]}>{sel.nombre}</Text>
              <Text style={[e.detalle, { marginBottom: 12 }]}>{sel.tipo}  ·  {sel.ubicacion}  ·  {sel.distancia} km</Text>
              <Etiqueta texto={`${estaAbierto(sel.abre, sel.cierra) ? 'Abierto ahora' : 'Cerrado ahora'}  (${sel.abre} a ${sel.cierra})`} tono={estaAbierto(sel.abre, sel.cierra) ? 'verde' : 'gris'} />
              {sel.oferta && <View style={{ marginTop: 14 }}><TarjetaOferta n={sel} /></View>}
              <Text style={e.seccion}>Menú</Text>
              {sel.menu.length === 0 && <Text style={e.detalle}>Este negocio aún no publica su menú.</Text>}
              {sel.menu.map((m, k) => (
                <Tarjeta key={k}>
                  <View style={e.fila}>
                    <Text style={e.nombre}>{m.nombre}</Text>
                    {m.precio != null && <Text style={e.nombre}>${m.precio}</Text>}
                  </View>
                </Tarjeta>
              ))}
              <Boton texto="Volver" tipo="suave" onPress={() => setSel(null)} style={{ marginTop: 10 }} />
            </ScrollView>
          )}
        </Pantalla>
      </Modal>
    </Pantalla>
  );
}
