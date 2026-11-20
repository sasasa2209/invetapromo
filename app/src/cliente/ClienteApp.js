import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Modal, Linking, TouchableOpacity } from 'react-native';
import {
  Pantalla, Encabezado, Boton, Pestanas, Tarjeta, Etiqueta, Chip, FilaChips, Porciones, Campo, Vacio, estilos as e,
} from '../compartido/componentes';
import { useAlmacen, usadasHoy } from '../compartido/Almacen';
import { NEGOCIOS_DEMO, ETIQUETAS } from '../compartido/datos';
import { estaAbierto, hoyISO, normaliza, num } from '../compartido/logica';
import { C } from '../compartido/tema';

const PESTANAS = [
  { id: 'cerca', texto: 'Cerca', icono: '📍' },
  { id: 'ofertas', texto: 'Ofertas', icono: '🔥' },
  { id: 'buscar', texto: 'Buscar', icono: '🔎' },
  { id: 'mio', texto: 'Mis lugares', icono: '❤️' },
];

const MOMENTOS = [
  { id: 'todo', texto: 'Todo' },
  { id: 'ahora', texto: 'Abierto ahora' },
  { id: 'desayuno', texto: 'Desayuno', hora: 9 },
  { id: 'comida', texto: 'Comida', hora: 14 },
  { id: 'cena', texto: 'Cena', hora: 20 },
];

function pasaMomento(n, id) {
  if (id === 'todo') return true;
  if (id === 'ahora') return estaAbierto(n.abre, n.cierra);
  const m = MOMENTOS.find((x) => x.id === id);
  return estaAbierto(n.abre, n.cierra, new Date(2000, 0, 1, m.hora, 0));
}

// "Taco de asada 25" -> { nombre, precio }
function parseMenu(txt) {
  return String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(/^(.*?)[\s$]*(\d+(?:[.,]\d+)?)$/);
    return m ? { nombre: m[1].trim(), precio: num(m[2]) } : { nombre: l, precio: null };
  });
}

// Lista de negocios (demo + el del dueño) con porciones restantes de su oferta
function useNegocios() {
  const { estado } = useAlmacen();
  return useMemo(() => {
    const usadas = usadasHoy(estado);
    const conQuedan = (n) =>
      n.oferta ? { ...n, oferta: { ...n.oferta, quedan: Math.max(0, n.oferta.porciones - (usadas[n.id] || 0)) } } : n;
    const lista = NEGOCIOS_DEMO.map(conQuedan);
    const n = estado.negocio;
    if (n.nombre.trim()) {
      const esp = estado.especial;
      const hayOferta = esp && esp.activo && esp.fecha === hoyISO();
      lista.push(conQuedan({
        id: 'mio', nombre: n.nombre, tipo: n.tipo || 'Comida', abre: n.abre, cierra: n.cierra,
        ubicacion: n.ubicacion || 'Durango', distancia: 0.3, menu: parseMenu(n.menuTexto),
        estrella: n.estrella, historia: n.historia, etiquetas: n.etiquetas || [], local: n.local, whatsapp: n.whatsapp,
        oferta: hayOferta ? { titulo: esp.titulo, descripcion: esp.descripcion, precio: num(esp.precio), porciones: esp.porciones || 10 } : null,
      }));
    }
    return lista.sort((a, b) => a.distancia - b.distancia);
  }, [estado.negocio, estado.especial, estado.usadas]);
}

function Corazon({ id }) {
  const { estado, toggleFavorito } = useAlmacen();
  const es = estado.favoritos.includes(id);
  return (
    <TouchableOpacity onPress={() => toggleFavorito(id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={{ fontSize: 24, color: es ? C.chile : '#A9B6AF' }}>{es ? '♥' : '♡'}</Text>
    </TouchableOpacity>
  );
}

// Boleto con código si ya apartó; botón si quedan porciones; "Agotado" si no
function Apartar({ n }) {
  const { estado, apartar } = useAlmacen();
  const mio = estado.apartados.find((a) => a.negocioId === n.id && a.fecha === hoyISO());
  if (mio) {
    return (
      <View style={{ backgroundColor: C.verdeClaro, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: C.verde }}>Tu porción está apartada. Dile este código al negocio:</Text>
        <Text style={{ fontSize: 32, fontWeight: '900', color: C.verde, letterSpacing: 2, marginTop: 4 }}>{mio.codigo}</Text>
      </View>
    );
  }
  if (n.oferta.quedan <= 0) return <View style={{ marginTop: 10 }}><Etiqueta texto="Agotado" tono="chile" /></View>;
  return <Boton texto="Apartar mi porción" tipo="maiz" onPress={() => apartar(n, n.oferta)} style={{ marginTop: 10 }} />;
}

function BloqueOferta({ n }) {
  return (
    <View style={{ backgroundColor: '#FFFBEA', borderColor: C.maiz, borderWidth: 1.5, borderRadius: 16, padding: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: '#7A5A00' }}>🔥 OFERTA DE HOY</Text>
      <Text style={[e.nombre, { fontSize: 18, marginTop: 4 }]}>{n.oferta.titulo}</Text>
      <Text style={[e.detalle, { marginBottom: 8 }]}>{n.oferta.descripcion}</Text>
      <View style={[e.fila, { marginBottom: 8 }]}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: C.tinta }}>${n.oferta.precio}</Text>
      </View>
      <Porciones quedan={n.oferta.quedan} total={n.oferta.porciones} />
      <Apartar n={n} />
    </View>
  );
}

function TarjetaNegocio({ n, onPress }) {
  const abierto = estaAbierto(n.abre, n.cierra);
  return (
    <Tarjeta onPress={onPress}>
      <View style={e.fila}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[e.nombre, { fontSize: 18 }]}>{n.nombre}</Text>
          <Text style={e.detalle}>{n.tipo} · {n.distancia} km</Text>
        </View>
        <Corazon id={n.id} />
      </View>
      {n.estrella ? <Text style={{ fontSize: 15, color: C.tinta, marginTop: 8 }}>🍲 <Text style={{ fontWeight: '700' }}>{n.estrella}</Text></Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        <Etiqueta texto={abierto ? `Abierto hasta ${n.cierra}` : `Abre a las ${n.abre}`} tono={abierto ? 'verde' : 'gris'} />
        {n.etiquetas.slice(0, 2).map((t) => <Etiqueta key={t} texto={t} />)}
      </View>
      {n.oferta && (
        <View style={{ marginTop: 12, backgroundColor: '#FFFBEA', borderRadius: 12, padding: 10 }}>
          <Text style={{ fontWeight: '800', color: C.tinta }}>🔥 {n.oferta.titulo} · ${n.oferta.precio}</Text>
          <View style={{ marginTop: 6 }}><Porciones quedan={n.oferta.quedan} total={n.oferta.porciones} /></View>
        </View>
      )}
    </Tarjeta>
  );
}

function Detalle({ n, onCerrar }) {
  const mapa = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.ubicacion + ' Durango')}`);
  const wa = () => Linking.openURL(`https://wa.me/${String(n.whatsapp).replace(/\D/g, '')}`);
  const abierto = estaAbierto(n.abre, n.cierra);
  return (
    <ScrollView contentContainerStyle={e.contenido}>
      <View style={e.fila}>
        <Text style={[e.nombre, { fontSize: 26, flex: 1, fontWeight: '900' }]}>{n.nombre}</Text>
        <Corazon id={n.id} />
      </View>
      <Text style={[e.detalle, { marginBottom: 10 }]}>{n.tipo} · {n.ubicacion} · {n.distancia} km</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        <Etiqueta texto={`${abierto ? 'Abierto ahora' : 'Cerrado ahora'} (${n.abre} a ${n.cierra})`} tono={abierto ? 'verde' : 'gris'} />
        {n.etiquetas.map((t) => <Etiqueta key={t} texto={t} />)}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <Boton texto="📍 Cómo llegar" tipo="suave" onPress={mapa} style={{ flex: 1 }} />
        {n.whatsapp ? <Boton texto="💬 WhatsApp" tipo="suave" onPress={wa} style={{ flex: 1 }} /> : null}
      </View>

      {n.oferta && <View style={{ marginBottom: 14 }}><BloqueOferta n={n} /></View>}

      {n.estrella ? (
        <Tarjeta>
          <Text style={{ fontSize: 12, fontWeight: '800', color: C.suave }}>EL PLATILLO DE LA CASA</Text>
          <Text style={[e.nombre, { fontSize: 18, marginTop: 4 }]}>🍲 {n.estrella}</Text>
        </Tarjeta>
      ) : null}
      {n.historia ? (
        <Tarjeta>
          <Text style={{ fontSize: 12, fontWeight: '800', color: C.suave }}>SU HISTORIA</Text>
          <Text style={[e.detalle, { color: C.tinta, fontSize: 15, marginTop: 4 }]}>{n.historia}</Text>
        </Tarjeta>
      ) : null}
      {n.local ? (
        <Tarjeta style={{ backgroundColor: C.verdeClaro, borderColor: C.verdeClaro }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: C.verde }}>🌽 HECHO CON LO DE AQUÍ</Text>
          <Text style={[e.detalle, { color: C.tinta, fontSize: 15, marginTop: 4 }]}>{n.local}</Text>
        </Tarjeta>
      ) : null}

      <Text style={e.seccion}>Menú</Text>
      {n.menu.length === 0 && <Text style={e.detalle}>Este negocio aún no publica su menú.</Text>}
      {n.menu.map((m, k) => (
        <Tarjeta key={k} style={{ padding: 12 }}>
          <View style={e.fila}>
            <Text style={[e.nombre, { flex: 1 }]}>{m.nombre}</Text>
            {m.precio != null && <Text style={e.nombre}>${m.precio}</Text>}
          </View>
        </Tarjeta>
      ))}
      <Boton texto="Volver" tipo="suave" onPress={onCerrar} style={{ marginTop: 10 }} />
    </ScrollView>
  );
}

export default function ClienteApp() {
  const { estado, setModo } = useAlmacen();
  const negocios = useNegocios();
  const [tab, setTab] = useState('cerca');
  const [selId, setSelId] = useState(null);
  const [momento, setMomento] = useState('todo');
  const [etiqueta, setEtiqueta] = useState(null);
  const [q, setQ] = useState('');
  const sel = negocios.find((n) => n.id === selId) || null;

  const filtrados = negocios.filter((n) => pasaMomento(n, momento) && (!etiqueta || n.etiquetas.includes(etiqueta)));
  const conOferta = negocios.filter((n) => n.oferta);
  const favoritos = negocios.filter((n) => estado.favoritos.includes(n.id));
  const misApartados = estado.apartados.filter((a) => a.fecha === hoyISO());
  const negociosApoyados = new Set(estado.apartados.map((a) => a.negocioId)).size;

  const t = normaliza(q.trim());
  const resultados = t
    ? negocios.map((n) => {
        const platillos = n.menu.filter((m) => normaliza(m.nombre).includes(t));
        const otros = normaliza([n.nombre, n.tipo, n.estrella, n.etiquetas.join(' '), n.oferta ? n.oferta.titulo + ' ' + n.oferta.descripcion : ''].join(' ')).includes(t);
        return platillos.length || otros ? { n, platillos } : null;
      }).filter(Boolean)
    : [];

  const titulos = { cerca: 'Hoy en Durango', ofertas: 'Ofertas de hoy', buscar: 'Buscar', mio: 'Mis lugares' };
  const subs = {
    cerca: 'Comida de barrio y lo que está disponible ahora.',
    ofertas: 'Lo que sobró hoy, a mejor precio. Apártalo antes de que se acabe.',
    buscar: 'Un platillo, un tipo de comida o un negocio.',
    mio: 'Tus apartados y los negocios que te gustan.',
  };

  return (
    <Pantalla>
      <Encabezado
        titulo={titulos[tab]} sub={subs[tab]}
        derecha={<Boton texto="Cambiar" tipo="suave" onPress={() => setModo(null)} style={{ paddingVertical: 8 }} />}
      />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={e.contenido} keyboardShouldPersistTaps="handled">
          {tab === 'cerca' && (
            <>
              <FilaChips>
                {MOMENTOS.map((m) => <Chip key={m.id} texto={m.texto} activo={momento === m.id} onPress={() => setMomento(m.id)} />)}
              </FilaChips>
              <FilaChips>
                {ETIQUETAS.map((x) => <Chip key={x} texto={x} activo={etiqueta === x} onPress={() => setEtiqueta(etiqueta === x ? null : x)} />)}
              </FilaChips>
              {filtrados.length === 0 && (
                <Vacio icono="🍽️" titulo="Nada con ese filtro" texto="Prueba otro momento del día o quita la etiqueta." />
              )}
              {filtrados.map((n) => <TarjetaNegocio key={n.id} n={n} onPress={() => setSelId(n.id)} />)}
            </>
          )}

          {tab === 'ofertas' && (
            conOferta.length
              ? conOferta.map((n) => (
                  <Tarjeta key={n.id}>
                    <TouchableOpacity onPress={() => setSelId(n.id)} activeOpacity={0.8} style={{ marginBottom: 10 }}>
                      <Text style={e.nombre}>{n.nombre}</Text>
                      <Text style={e.detalle}>{n.tipo} · {n.distancia} km</Text>
                    </TouchableOpacity>
                    <BloqueOferta n={n} />
                  </Tarjeta>
                ))
              : <Vacio icono="🔥" titulo="Sin ofertas por ahora" texto="Los negocios publican su especial del día cuando les sobran ingredientes. Vuelve más tarde." />
          )}

          {tab === 'buscar' && (
            <>
              <Campo placeholder="Caldillo, gorditas, tacos, pan..." value={q} onChangeText={setQ} />
              {!t && <Text style={e.detalle}>Prueba con "caldo", "taco" o "pan".</Text>}
              {t && resultados.length === 0 && <Vacio icono="🤷" titulo="Nadie lo tiene por ahora" texto={`No encontramos "${q}". Prueba con otra palabra.`} />}
              {resultados.map(({ n, platillos }) => (
                <Tarjeta key={n.id} onPress={() => setSelId(n.id)}>
                  <Text style={[e.nombre, { fontSize: 17 }]}>{n.nombre}</Text>
                  <Text style={e.detalle}>{n.tipo} · {n.distancia} km</Text>
                  {platillos.map((m, k) => (
                    <Text key={k} style={[e.detalle, { color: C.tinta }]}>• {m.nombre}{m.precio != null ? ` · $${m.precio}` : ''}</Text>
                  ))}
                </Tarjeta>
              ))}
            </>
          )}

          {tab === 'mio' && (
            <>
              <View style={{ backgroundColor: C.verde, borderRadius: 18, padding: 16, marginBottom: 12 }}>
                {estado.apartados.length ? (
                  <>
                    <Text style={{ color: C.blanco, fontSize: 30, fontWeight: '900' }}>{negociosApoyados}</Text>
                    <Text style={{ color: '#CBE7DB', fontSize: 14, lineHeight: 20 }}>
                      {negociosApoyados === 1 ? 'negocio local apoyado' : 'negocios locales apoyados'} y {estado.apartados.length} {estado.apartados.length === 1 ? 'porción rescatada' : 'porciones rescatadas'} de la basura.
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: C.blanco, fontSize: 15, lineHeight: 22 }}>
                    Aparta tu primera porción y ayuda a un negocio local a no tirar comida.
                  </Text>
                )}
              </View>

              <Text style={e.seccion}>🎟️ Mis apartados de hoy</Text>
              {misApartados.length === 0 && <Text style={e.detalle}>Aún no has apartado nada hoy. Mira las ofertas.</Text>}
              {misApartados.map((a) => (
                <Tarjeta key={a.id} style={{ borderColor: C.verde }}>
                  <View style={e.fila}>
                    <View style={{ flex: 1 }}>
                      <Text style={e.nombre}>{a.titulo}</Text>
                      <Text style={e.detalle}>{a.negocio}</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: C.verde }}>{a.codigo}</Text>
                  </View>
                </Tarjeta>
              ))}

              <Text style={e.seccion}>❤️ Mis lugares</Text>
              {favoritos.length === 0 && <Text style={e.detalle}>Toca el corazón en un negocio para guardarlo aquí.</Text>}
              {favoritos.map((n) => <TarjetaNegocio key={n.id} n={n} onPress={() => setSelId(n.id)} />)}
            </>
          )}
        </ScrollView>
      </View>
      <Pestanas items={PESTANAS} activa={tab} onCambiar={setTab} />

      <Modal visible={!!sel} animationType="slide" onRequestClose={() => setSelId(null)}>
        <Pantalla>{sel && <Detalle n={sel} onCerrar={() => setSelId(null)} />}</Pantalla>
      </Modal>
    </Pantalla>
  );
}
