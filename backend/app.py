"""
Punto de entrada principal para la aplicación Flask.
Este archivo inicializa la aplicación Flask, configura CORS y registra las rutas de autenticación.
"""

from flask import Flask
from routes.auth_routes import auth_routes
from routes.data_routes import data_routes
from websockets.socketio_intance import socketio_init
from routes.socketio_routes import socket_routes, register_socketio_events
from flask_cors import CORS
from database.db_instance import db_instance
from database.executor_instance import init_executor
from flask_compress import Compress
from config import Config
from dotenv import load_dotenv
from arduino.monitor_instance import create_monitor


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
    socketio = socketio_init(app)
    register_socketio_events(socketio)
    app.register_blueprint(auth_routes)
    app.register_blueprint(socket_routes)
    app.register_blueprint(data_routes)
    with app.app_context():
        monitor = create_monitor(app, socketio)
        monitor.start()
    socketio.run(app, debug=True, host="0.0.0.0", use_reloader=False)
    # IMPORTANTE: Use reloader a false porque crea dos veces y hace dos starts de serial monitor y salta error de que el puerto COM ya está en uso
    # app.run(debug=False, host="0.0.0.0")


if __name__ == "__main__":
    main()
