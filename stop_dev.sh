#!/bin/bash

echo "Deteniendo servicios de desarrollo..."

# --- Detener Backend Flask (esto ya funciona, pero lo mantenemos) ---
if [ -f /tmp/flask_dev_pid.txt ]; then
    FLASK_PID=$(cat /tmp/flask_dev_pid.txt)
    if ps -p $FLASK_PID > /dev/null; then # Verifica si el proceso todavía existe
        kill $FLASK_PID
        echo "Backend Flask (PID: $FLASK_PID) detenido."
    else
        echo "Backend Flask (PID: $FLASK_PID) no encontrado o ya detenido."
    fi
    rm /tmp/flask_dev_pid.txt
fi

# --- Detener Frontend Astro por puerto ---
ASTRO_PORT=4321 # O el puerto real de Astro
PID_ASTRO=$(lsof -t -i :$ASTRO_PORT)
if [ -n "$PID_ASTRO" ]; then # Si se encontró un PID
    kill $PID_ASTRO
    echo "Frontend Astro (puerto $ASTRO_PORT, PID: $PID_ASTRO) detenido."
    if [ -f /tmp/astro_dev_pid.txt ]; then rm /tmp/astro_dev_pid.txt; fi
else
    echo "Frontend Astro (puerto $ASTRO_PORT) no encontrado o ya detenido."
fi

# --- Detener Frontend Vite por puerto ---
VITE_PORT=4000 # O el puerto real de Vite
PID_VITE=$(lsof -t -i :$VITE_PORT)
if [ -n "$PID_VITE" ]; then # Si se encontró un PID
    kill $PID_VITE
    echo "Frontend Vite (puerto $VITE_PORT, PID: $PID_VITE) detenido."
    if [ -f /tmp/vite_dev_pid.txt ]; then rm /tmp/vite_dev_pid.txt; fi
else
    echo "Frontend Vite (puerto $VITE_PORT) no encontrado o ya detenido."
fi

echo "Servicios de desarrollo detenidos."