# Lector de Espectro y Guardado de Datos

## Inicialización
- Definir VID/PID
- Buscar puerto serial (`obtener_puertos_usb`)
- Configurar BAUD y TIMEOUT
- Definir WAVELENGTHS

## Clase: SerialMonitor
### Atributos
- puerto, baud_rate
- buffer, directorio de guardado
- batches: `current_batch`, `manual_batch`
- estado: `is_first_measurement`, `waiting_for_manual`

### Métodos
#### `set_save_directory`
- Usa `tkinter` para elegir carpeta de guardado

#### `start` / `stop`
- Abrir/cerrar el puerto serial
- Inicia `monitor_serial` en un hilo

#### `monitor_serial`
- Lee continuamente del puerto
- Decodifica y acumula en buffer
- Llama a `process_buffer`

#### `process_buffer`
- Busca mensajes entre `'h'` y `'a'`
- Llama a `handle_arduino_message`

#### `handle_arduino_message`
- Convierte datos a: espectro, temperatura, pH
- Lote automático: guarda cada 10 medidas (`save_batch`)
- Lote manual: espera 10 medidas tras comando `M` (`save_manual_batch`)

#### `save_batch`
- Crea archivos Excel: espectro, temperatura, pH
- Usa `append_to_excel`:
  - Preserva comentarios
  - Agrega longitudes de onda si es necesario
  - Comenta lote con timestamp y tipo

#### `save_manual_batch`
- Guarda lote manual en un solo archivo
- Secciones: espectro, temperatura, pH
- Comentarios por sección y lote

#### `send_command`
- Si es `'M'`: prepara lote manual
- Otro: lo envía por serial

#### `get_latest_measurements`
- Devuelve últimas mediciones para interfaz

## Función principal `main`
- Inicializa monitor
- Pide carpeta
- Inicia lectura
- Loop de comandos de usuario
- Finaliza al salir

## Excel
- Comentarios con `openpyxl`
- Preservación de datos previos
- Archivos:
  - `valores_espectro.xlsx`
  - `valores_temperatura.xlsx`
  - `valores_ph.xlsx`
  - `manual_<nombre>.xlsx`
