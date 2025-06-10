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
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_migrate import Migrate


import os

load_dotenv()


def create_app(test_config=None):
    """
    Función de fábrica para crear y configurar la aplicación Flask.
    Permite pasar una configuración de prueba para los tests.
    """
    app = Flask(__name__)

    migrate = Migrate()
    if test_config is None:
        # Cargar la configuración por defecto si no estamos en modo test
        app.config.from_object(Config)
    else:
        # Cargar la configuración de test si se proporciona
        app.config.from_mapping(test_config)

    CORS(app, supports_credentials=True)
    JWTManager(app)
    
    compress = Compress()
    compress.init_app(app)
    
    db_instance.init_db(app)
    migrate.init_app(app, db_instance.db)
    init_executor(app, executor_type="thread", max_workers=4)
    

    # Registra tus Blueprints
    app.register_blueprint(auth_routes)
    app.register_blueprint(socket_routes)
    app.register_blueprint(data_routes)


    
    return app # Retorna app y socketio si lo necesitas en el main o para tests de websockets


def main():
    """
    Función principal que inicializa y ejecuta la aplicación Flask con SocketIO.
    """
    app = create_app()
    socketio = socketio_init(app) 
    register_socketio_events(socketio)
    with app.app_context():

        monitor = create_monitor(app, socketio)
        monitor.start()

    socketio.run(
        app, debug=True, host="0.0.0.0", use_reloader=False, allow_unsafe_werkzeug=True
    )



if __name__ == "__main__":
    main()