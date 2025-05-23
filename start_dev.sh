#!/bin/bash

# Activar el entorno virtual al principio
# Es crucial que el `source` se haga en el mismo subshell que los comandos
# Si se hace en un cd y luego se cambia de directorio, el activate no afectará a los siguientes comandos
# Por eso, es mejor activar el venv y luego usar rutas completas para los ejecutables si cambias de directorio,
# o asegurarte de que el venv esté activo en cada bloque de cd.
# Alternativa: Activar una vez y luego usar rutas absolutas para los ejecutables (ej. /home/javier/Vixia-MicroAlgas/backend/.venv/bin/flask)
# Para este script, asumo que cada bloque cd/source es independiente para su proceso.

# --- Backend Flask ---
echo "Iniciando backend Flask..."
(
    cd /home/javier/Vixia-MicroAlgas/backend
    source .venv/bin/activate
    # Sintaxis correcta: nohup [comando] > logfile 2>&1 &
    # Usamos 'exec' dentro del subshell para que el 'flask run' sea el PID principal del subshell.
    # Pero para nohup, simplemente lanzarlo correctamente.
    FLASK_RUN_PORT=5000 nohup python app.py > flask_logs.log 2>&1 &
    FLASK_PID=$!
    echo "Flask backend iniciado con PID: $FLASK_PID" # Esto se imprimirá en el log del start_dev.sh
    echo "$FLASK_PID" > /tmp/flask_dev_pid.txt
) # El paréntesis crea un subshell, aislando el cd y source

# --- Frontend Astro ---
echo "Iniciando frontend Astro..."
(
    cd /home/javier/Vixia-MicroAlgas/frontend # Asegúrate de que esta sea la ruta correcta
    # No necesita activar venv de Python, pero si tiene alguna configuración de Node/NVM, etc., iría aquí.
    nohup npm run dev > astro_logs.log 2>&1 &
    ASTRO_PID=$!
    echo "Astro frontend iniciado con PID: $ASTRO_PID"
    echo "$ASTRO_PID" > /tmp/astro_dev_pid.txt
)

# --- Frontend Vite (descomentar si es necesario) ---
echo "Iniciando frontend Vite..."
(
    cd /home/javier/Vixia-MicroAlgas/frontend-vite # Ruta para Vite
    nohup npm run dev > vite_logs.log 2>&1 &
    VITE_PID=$!
    echo "Vite frontend iniciado con PID: $VITE_PID"
    echo "$VITE_PID" > /tmp/vite_dev_pid.txt
)

echo "Servicios de desarrollo iniciados. Usa 'stop_dev.sh' para detenerlos."
echo "Para ver los logs de Flask: tail -f /home/javier/Vixia-MicroAlgas/backend/flask_logs.log"
echo "Para ver los logs de Astro: tail -f /home/javier/Vixia-MicroAlgas/frontend-astro/astro_logs.log"
echo "Para ver los logs de Vite: tail -f /home/javier/Vixia-MicroAlgas/frontend-vite/vite_logs.log"

# El comando 'wait' ya no es necesario aquí.
# El script principal simplemente terminará después de lanzar los nohup.
# Los procesos persistirán en segundo plano.

wait $FLASK_SUBSHELL_PID $ASTRO_SUBSHELL_PID $VITE_SUBSHELL_PID # Espera por los PIDs de los subshells

echo "Servicios de desarrollo detenidos por Ctrl+C o por cierre de uno de ellos."
