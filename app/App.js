import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AlmacenProvider, useAlmacen } from './src/compartido/Almacen';
import ElegirModo from './src/compartido/ElegirModo';
import NegocioApp from './src/negocio/NegocioApp';
import ClienteApp from './src/cliente/ClienteApp';
import { C } from './src/compartido/tema';

function Raiz() {
  const { estado } = useAlmacen();
  if (!estado) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: C.fondo }}>
        <ActivityIndicator color={C.verde} size="large" />
      </View>
    );
  }
  if (!estado.modo) return <ElegirModo />;
  return estado.modo === 'negocio' ? <NegocioApp /> : <ClienteApp />;
}

export default function App() {
  return (
    <AlmacenProvider>
      <StatusBar style="dark" />
      <Raiz />
    </AlmacenProvider>
  );
}
