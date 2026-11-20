import { Alert, Platform } from 'react-native';

// Alertas que funcionan en celular y en navegador
export function avisar(titulo, texto) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n${texto || ''}`);
  else Alert.alert(titulo, texto);
}

export function confirmar(titulo, texto, alAceptar) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n${texto}`)) alAceptar();
  } else {
    Alert.alert(titulo, texto, [
      { text: 'Cancelar' },
      { text: 'Borrar', style: 'destructive', onPress: alAceptar },
    ]);
  }
}
