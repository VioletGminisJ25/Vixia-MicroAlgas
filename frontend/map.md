# Proyecto: Vixia-MicroAlgas
## Index.astro
- Importa:
  - `IndexData` (desde `./components/IndexData.astro`)
    - **Props**:
      - Ninguna (usa `client:only="react"` para cargar `GraficaIndex`).
  - `Toastify` (desde `./componentes_react/Ui/Toastify`)
    - **Props**:
      - Ninguna (configuración interna de `Toastify`).

## IndexData.astro
- Importa:
  - `GraficaIndex` (desde `./componentes_react/Graficas/GraficaIndex.tsx`)
    - **Props**:
      - Ninguna (usa `client:only="react"` para cargar el componente).
  - `BotonesEstados` (desde `./componentes_react/BotonesEstados.tsx`)
    - **Props**:
      - `isManual` (boolean, recibido desde `useWebSocket_lastData`).

## GraficaIndex.tsx
- Usa:
  - `useWebSocket_lastData` (desde `../../../hooks/WebSockect_lasData.js`)
    - **Retorna**:
      - `data` → Pasado como `datos` a `LastCurrentData`.
      - `lights_state` → Pasado como `lights` a `LastCurrentData`.
      - `isManual` → Pasado como `isManual` a `BotonesEstados`.
  - `LastCurrentData` (desde `../Nivo/ComponenteGrafico_Nivo_LongitudDeOnda.tsx`)
    - **Props**:
      - `titulo` (string, valor fijo: `'FECHA MAS RECIENTE'`).
      - `datos` (data recibido desde `useWebSocket_lastData`).
      - `lights` (estado de luces recibido desde `useWebSocket_lastData`).
  - `BotonesEstados` (desde `../BotonesEstados.tsx`)
    - **Props**:
      - `isManual` (boolean, recibido desde `useWebSocket_lastData`).

## BotonesEstados.tsx
- **Props**:
  - `isManual` (boolean, determina el estado manual de los botones).

## ComponenteGrafico_Nivo_LongitudDeOnda.tsx
- **Props**:
  - `datos` (data para graficar, recibido desde `GraficaIndex`).
  - `titulo` (string, recibido desde `GraficaIndex`).
  - `lights` (estado de luces, recibido desde `GraficaIndex`).

## WebSockect_lasData.js
- **Retorna**:
  - `data` → Datos en tiempo real.
  - `lights_state` → Estado de las luces.
  - `isManual` → Estado manual.
  - `isConnected` → Estado de conexión.
  - `error` → Errores de conexión.