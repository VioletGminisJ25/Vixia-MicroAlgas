# 🌿 Vixia Microalgas

**Vixia Microalgas** es una plataforma de monitoreo y visualización de cultivos de microalgas. Integra sensores físicos conectados a un Arduino para la recolección de datos como temperatura, pH y espectros, procesados y visualizados a través de una arquitectura moderna con un frontend en **Vite** y un backend en **Flask**.

---

## ⚙️ Tecnologías

- 🌐 **Frontend:** [Vite](https://vite.dev/guide/)
- 🧠 **Backend:** [Flask](https://flask.palletsprojects.com/)
- 🧪 **Sensores:** Arduino (temperatura, pH, espectros)
- 📁 **Formato de datos:** Archivos JSON 
- 🐍 **Lenguaje principal:** Python

---

## 📂 Estructura del proyecto

```bash
vixia-microalgas/
├── backend/              # Lógica del servidor Flask y procesamiento de datos
│   ├── app.py            # Punto de entrada de la app
│   ├── routes/           # Módulos de rutas y controladores
│   ├── utils/            # Funciones auxiliares (lectura de sensores, cálculo de promedios)
│   ├── otherFiles/       # Archivo provisional de conexión con arduino y script de arduino
│   ├── requirements.txt      # Dependencias del backend
│   └── bd/               # Almacenamiento de datos recolectados (JSONs diarios)
├── frontend-vite/             # Proyecto Astro para la interfaz de usuario
│   ├── src/              # Componentes, páginas y estilos
│   └── public/           # Recursos estáticos
├── README.md             # Documentación del proyecto
└── .gitignore            # Archivos y carpetas ignoradas por Git
```

---

## 🚀 Cómo ejecutar el proyecto

### 🧠 Backend (Flask)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # En Windows
# source .venv/bin/activate  # En Mac/Linux
pip install -r requirements.txt
flask run
```

### 🌐 Frontend (Vite)

```bash
cd frontend-vite
npm install
npm run dev
```

---

## 📊 Funcionalidades

- Lectura y almacenamiento de datos de sensores físicos
- Promedios diarios de temperatura y pH
- Visualización de los datos recolectados desde el frontend
- Gestión de archivos organizados por fecha

---

## ✨ Autor

- Desarrollado por:
    - **Javier Santos Rodal**(BackEnd) 
    - **F.Javier García González** (FrontEnd) 
    
