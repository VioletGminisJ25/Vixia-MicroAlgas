"""
Punto de entrada principal para la aplicación Flask.
Este archivo inicializa la aplicación Flask, configura CORS y registra las rutas de autenticación.
"""

from flask import Flask
from routes.auth_routes import auth_routes
from flask_cors import CORS
from database.db_instance import db_instance
from database.executor_instance import init_executor
from flask_compress import Compress
from config import Config
from arduino.SerialMonitor import SerialMonitor
from dotenv import load_dotenv
import os

load_dotenv()


def main():
    """
    Función principal que inicializa la aplicación Flask y configura las rutas y la base de datos.
    """

    app = Flask(__name__)
    app.config.from_object(Config)  # Carga la configuración desde el archivo config.py
    CORS(app)
    compress = (
        Compress()
    )  # Inicializa la compresión de respuestas para comprimir json y html
    compress.init_app(app)
    db_instance.init_db(app)
    init_executor(app, executor_type="thread", max_workers=4)
    app.register_blueprint(auth_routes)

    monitor = SerialMonitor(os.getenv("BAUD_RATE"))
    monitor.start()
    # IMPORTANTE: Use reloader a false porque crea dos veces y hace dos starts de serial monitor y salta error de que el puerto COM ya está en uso
    app.run(debug=True, host="0.0.0.0", use_reloader=False)
    # app.run(debug=False, host="0.0.0.0")


if __name__ == "__main__":
    main()
