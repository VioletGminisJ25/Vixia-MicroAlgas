# Arduino - Lectura de Sensores

## Setup
- Serial iniciado a 9600
- Pines analógicos:
  - `SensorPH` (A1)
  - `SensorTemp` (A2)
  - `SensorColor` (A3)

## Variables
- `float sensorValuePH`
- `float sensorValueTemp`
- `float sensorValueColor`
- Buffers y flags:
  - `int flag = 0`
  - `char command`
  - `int contador = 0`

## Loop principal
- Lee del puerto serial
- Si `command == 'M'`:
  - `flag = 1` (inicio de lote manual)

## Lectura de sensores
- `readPH()`
- `readTemp()`
- `readColor()`

## Envío de datos al PC
- Encabezado con `h`
- Datos separados por comas
- Valores:
  - Espectro (288 valores aprox.)
  - Temperatura
  - pH
- Terminador `a`

## Función `readPH()`
- Lee valor del pin
- Convierte a voltaje
- Escala a rango de pH (0–14)

## Función `readTemp()`
- Lee valor del pin
- Escala de 0–5 V a 0–100 °C

## Función `readColor()`
- Lee 288 valores espectrales
- (Simulados o leídos de sensor)

## Envío de datos
- Cada 3 segundos (modo automático)
- O 10 veces (modo manual, `flag == 1`)
- Incrementa `contador`

## Comandos por serial
- `'M'`: activa modo manual

## Fin de lote manual
- Si `contador == 10`, `flag = 0`

