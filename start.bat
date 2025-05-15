@echo off
echo Iniciando el frontend...
start "Frontend" cmd /k "cd frontend && call npm run dev"

echo Iniciando el backend...
start "Backend" cmd /k "cd backend && call .venv\Scripts\activate && call python app.py"

echo Abriendo el navegador...
start "" http://localhost:4321

echo Ambos servidores y el navegador deberían estar abriéndose.
pause