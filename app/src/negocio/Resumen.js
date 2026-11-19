import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Tarjeta, Etiqueta, Vacio, Boton, estilos as e } from '../compartido/componentes';
import { useAlmacen } from '../compartido/Almacen';
import { analizar, DIAS, diaSemana, fmt, hoyISO, sumaDias } from '../compartido/logica';

export default function Resumen({ irA }) {
  const { estado, cargarDemo } = useAlmacen();
  const { insumos, cierres } = estado;

  if (!insumos.length) {
    return (
      <Vacio titulo="Aún no tienes insumos" texto="Registra tus insumos para ver alertas y predicciones, o carga datos de ejemplo para probar la app.">
        <Boton texto="Agregar insumos" onPress={() => irA('insumos')} style={{ marginBottom: 10 }} />
        <Boton texto="Cargar datos de ejemplo" tipo="suave" onPress={cargarDemo} />
      </Vacio>
    );
  }

  const analisis = analizar(insumos, cierres);
  const criticos = analisis.filter((a) => a.estado === 'critico');
  const faltaran = analisis.filter((a) => a.estado === 'faltara');
  const sobran = analisis.filter((a) => a.estado === 'sobra');
  const diaManana = DIAS[diaSemana(sumaDias(hoyISO(), 1))];
  const cerroHoy = cierres.some((c) => c.fecha === hoyISO());

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
      {!cerroHoy && (
        <Tarjeta style={{ backgroundColor: '#FFF8E1', borderColor: '#F2D98A' }}>
          <Text style={e.nombre}>Falta el cierre de hoy</Text>
          <Text style={e.detalle}>Captura lo que te quedó para que las predicciones estén al día.</Text>
          <Boton texto="Hacer cierre" tipo="maiz" onPress={() => irA('cierre')} style={{ marginTop: 10 }} />
        </Tarjeta>
      )}

      <Text style={e.seccion}>Se está acabando</Text>
      {criticos.length === 0 && <Text style={e.detalle}>Nada por debajo del mínimo.</Text>}
      {criticos.map((a) => (
        <Fila key={a.insumo.id} a={a} tono="chile" texto={`Mínimo: ${fmt(a.insumo.minimo)} ${a.insumo.unidad}. Compra hoy.`} />
      ))}

      <Text style={e.seccion}>Predicción para el {diaManana}</Text>
      {faltaran.length === 0 && <Text style={e.detalle}>Con lo que tienes alcanza para mañana.</Text>}
      {faltaran.map((a) => (
        <Fila
          key={a.insumo.id} a={a} tono="maiz"
          texto={`Se consumen ~${fmt(a.prediccion)} ${a.insumo.unidad} los ${DIAS[diaSemana(sumaDias(hoyISO(), 1))]}. Te faltan ~${fmt(a.prediccion - a.insumo.stock)}.`}
        />
      ))}

      <Text style={e.seccion}>Te sobra o está por caducar</Text>
      {sobran.length === 0 && <Text style={e.detalle}>Sin sobrantes por ahora.</Text>}
      {sobran.map((a) => (
        <Fila
          key={a.insumo.id} a={a} tono="verde"
          texto={a.diasCaducar !== null && a.diasCaducar <= 3
            ? (a.diasCaducar < 0 ? 'Ya caducó.' : `Caduca en ${a.diasCaducar} día(s).`)
            : `Mañana se usan ~${fmt(a.prediccion)} ${a.insumo.unidad}.`}
        />
      ))}
      {sobran.length > 0 && (
        <Boton texto="Crear especial con lo que sobra" onPress={() => irA('especial')} style={{ marginTop: 4 }} />
      )}
    </ScrollView>
  );
}
