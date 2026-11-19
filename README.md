# invetapromo
**App para negocios de comida y bebida de Durango que les ayuda a saber qué se les está acabando y qué les sobra, y que muestra a los clientes qué hay disponible y qué ofertas del día tienen cerca.**

## Problema

- Los restaurantes, loncherías y bares pequeños no tienen un sistema de inventario. Llevan todo de memoria o en libretas.
- Se quedan sin insumos en pleno servicio (pierden ventas) o compran de más y tiran comida (pierden dinero).
- Los clientes no saben qué lugares hay cerca, si están abiertos ni qué tienen ese día.

## Solución

Una sola app con dos modos.

### Modo negocio

1. Registra sus insumos (carne, tortillas, limones, cerveza, etc.) con unidad y un mínimo de alerta.
2. Cada día, **al cerrar, captura lo que queda**. El sistema calcula el consumo del día:
   `consumo = inventario inicial + compras del día - lo que quedó`
3. Ve alertas de "se está acabando".
4. Recibe la **predicción de faltantes** y el **especial del día** generado con IA.

### Modo cliente

1. Ve los negocios cercanos con horario, ubicación y menú.
2. Ve las **ofertas del día** (los especiales que salen del inventario).
3. Busca un platillo o tipo de comida y ve quién lo tiene.

## Qué nos hace diferentes

El inventario del negocio alimenta directamente lo que ve el cliente:

- La **IA predice** qué insumos van a faltar según el día de la semana (viernes y sábado se consume mucho más).
- La **IA sugiere un especial del día** con los insumos que sobran o están por caducar, y el cliente lo ve como oferta.
- Resultado: el negocio **tira menos comida y vende más**, y el cliente **encuentra ofertas reales**.

## Retos que resolvemos

- **Control de inventarios en pequeños negocios:** ¿cómo podría un negocio pequeño saber qué se le está acabando? Cierre del día, alertas y predicción.
- **Conexión entre productores y consumidores locales:** ¿cómo podríamos descubrir más de lo que se produce cerca de nosotros? App del cliente con negocios, menú y ofertas del día.

## Alcance del prototipo (hackathon de 20 horas)

**Incluye:**

- Elegir modo (negocio o cliente)
- Lista de insumos
- Cierre del día y consumo calculado
- Alertas de faltantes
- Predicción simple de faltantes
- Especial del día con IA
- Lista de negocios y ofertas para el cliente

**Trabajo futuro:**

- Conteo de inventario por foto o voz
- Mapa interactivo
- Apartar mesas o productos
- Detección de mermas sospechosas
- Más giros de negocio

## Tecnologías

- **App:** React Native con Expo
- **Base de datos y login:** Supabase (o Firebase)
- **IA:** predicción por promedio de consumo por día de la semana + modelo de lenguaje para el especial del día

## Estructura del proyecto

```
.
├── app/
│   └── src/
│       ├── negocio/      # Pantallas del modo negocio
│       ├── cliente/      # Pantallas del modo cliente
│       └── compartido/   # Navegación, conexión a la base de datos, componentes comunes
├── .gitignore
└── README.md
```

## Cómo correr el proyecto

1. Instalar Node.js (versión LTS) y la app **Expo Go** en el celular.
2. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPO.git
   cd TU_REPO/app
   ```
3. Instalar dependencias e iniciar:
   ```bash
   npm install
   npx expo start
   ```
4. Escanear el código QR con Expo Go (el celular y la laptop deben estar en la misma red WiFi).

## Flujo de trabajo en equipo

- Antes de empezar a trabajar: `git pull`
- Al terminar algo que funcione:
  ```bash
  git add .
  git commit -m "Descripción de lo que cambié"
  git push
  ```
- Cada quien trabaja en su carpeta (`negocio/` o `cliente/`). Los archivos compartidos los edita una persona a la vez.

## Pitch

> En Durango, los restaurantes y bares pequeños tiran comida o se quedan sin insumos porque no tienen cómo llevar su inventario. Nuestra app les permite hacer un cierre de día en minutos, y con eso la IA les avisa qué les va a faltar y qué especial del día pueden ofrecer con lo que les sobra. Los clientes ven esas ofertas en tiempo real. Menos desperdicio para el negocio, mejores opciones para quien busca dónde comer.

## Equipo

- Bruno Cortez Gamboa
- Cristopher Uriel Hernandez Alvarado