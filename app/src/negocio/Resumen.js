import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Tarjeta, Etiqueta, Vacio, Boton, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { analizar, DIAS, diaSemana, fmt, hoyISO, sumaDias } from '../compartido/logica';
import { C } from '../compartido/tema';

function Contador({ n, texto, fondo, color }) {
  return (
    <View style={{ flex: 1, backgroundColor: fondo, borderRadius: 16, padding: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color }}>{n}</Text>
      <Text style={{ fontSize: 12, fontWeight: '700', color }}>{texto}</Text>
    </View>
  );
}

export default function Resumen({ irA }) {
  const { estado, cargarDemo } = useAlmacen();
  const { insumos, cierres, apartados } = estado;

  if (!insumos.length) {
    return (
      <Vacio icono="📦" titulo="Aún no tienes insumos" texto="Registra tus insumos para ver alertas y predicciones, o carga datos de ejemplo para probar la app.">
        <Boton texto="Agregar insumos" onPress={() => irA('insumos')} style={{ marginBottom: 10, alignSelf: 'stretch' }} />
        <Boton texto="Cargar datos de ejemplo" tipo="suave" onPress={cargarDemo} style={{ alignSelf: 'stretch' }} />
      </Vacio>
    );
  }

  const analisis = analizar(insumos, cierres);
  const criticos = analisis.filter((a) => a.estado === 'critico');
  const faltaran = analisis.filter((a) => a.estado === 'faltara');
  const sobran = analisis.filter((a) => a.estado === 'sobra');
  const manana = sumaDias(hoyISO(), 1);
  const diaManana = DIAS[diaSemana(manana)];
  const cerroHoy = cierres.some((c) => c.fecha === hoyISO());
  const misApartados = apartados.filter((a) => a.negocioId === 'mio' && a.fecha === hoyISO());

  const Fila = ({ a, texto, tono }) => (
    <Tarjeta>
      <View style={e.fila}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={e.nombre}>{a.insumo.nombre}</Text>
          <Text style={e.detalle}>{texto}</Text>
        </View>
        <Etiqueta texto={`${fmt(a.insumo.stock)} ${a.insumo.unidad}`} tono={tono} />
      </View>
    </Tarjeta>
  );

  return (
    <ScrollView contentContainerStyle={e.contenido}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
        <Contador n={criticos.length} texto="Se acaban" fondo={C.chileClaro} color={C.chile} />
        <Contador n={faltaran.length} texto={`Faltan el ${diaManana}`} fondo={C.maizClaro} color="#7A5A00" />
        <Contador n={sobran.length} texto="Te sobran" fondo={C.verdeClaro} color={C.verde} />
      </View>

      {!cerroHoy && (
        <Tarjeta style={{ backgroundColor: '#FFF8E1', borderColor: '#F2D98A', marginTop: 10 }}>
          <Text style={e.nombre}>Falta el cierre de hoy</Text>
          <Text style={e.detalle}>Captura lo que te quedó para que las predicciones estén al día.</Text>
          <Boton texto="Hacer cierre" tipo="maiz" onPress={() => irA('cierre')} style={{ marginTop: 10 }} />
        </Tarjeta>
      )}

      {misApartados.length > 0 && (
        <>
          <Text style={e.seccion}>🎟️ Clientes que apartaron hoy</Text>
          {misApartados.map((a) => (
            <Tarjeta key={a.id} style={{ borderColor: C.maiz }}>
              <View style={e.fila}>
                <Text style={e.nombre}>{a.titulo}</Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: C.verde }}>{a.codigo}</Text>
              </View>
            </Tarjeta>
          ))}
        </>
      )}

      <Text style={e.seccion}>🔴 Se está acabando</Text>
      {criticos.length === 0 && <Text style={e.detalle}>Nada por debajo del mínimo.</Text>}
      {criticos.map((a) => (
        <Fila key={a.insumo.id} a={a} tono="chile" texto={`Mínimo: ${fmt(a.insumo.minimo)} ${a.insumo.unidad}. Compra hoy.`} />
      ))}

      <Text style={e.seccion}>🟡 Predicción para el {diaManana}</Text>
      {faltaran.length === 0 && <Text style={e.detalle}>Con lo que tienes alcanza para mañana.</Text>}
      {faltaran.map((a) => (
        <Fila key={a.insumo.id} a={a} tono="maiz"
          texto={`Se consumen ~${fmt(a.prediccion)} ${a.insumo.unidad} los ${diaManana}. Te faltan ~${fmt(a.prediccion - a.insumo.stock)}.`} />
      ))}

      <Text style={e.seccion}>🟢 Te sobra o está por caducar</Text>
      {sobran.length === 0 && <Text style={e.detalle}>Sin sobrantes por ahora.</Text>}
      {sobran.map((a) => (
        <Fila key={a.insumo.id} a={a} tono="verde"
          texto={a.diasCaducar !== null && a.diasCaducar <= 3
            ? (a.diasCaducar < 0 ? 'Ya caducó.' : `Caduca en ${a.diasCaducar} día(s).`)
            : `Mañana se usan ~${fmt(a.prediccion)} ${a.insumo.unidad}.`} />
      ))}
      {sobran.length > 0 && (
        <Boton texto="Crear especial con lo que sobra" onPress={() => irA('especial')} style={{ marginTop: 4 }} />
      )}
    </ScrollView>
  );
}
