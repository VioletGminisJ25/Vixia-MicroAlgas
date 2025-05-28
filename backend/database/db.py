from flask_sqlalchemy import SQLAlchemy
import threading
import time
from sqlalchemy.exc import OperationalError, DatabaseError
from mysql.connector.errors import DatabaseError as MySQLDatabaseError


class Database:
    """
    Clase para manejar la conexión a la base de datos.
    Contiene métodos para inicializar la base de datos y crear las tablas necesarias.
    """
    def __init__(self, db=None):
        """
        Inicializa la clase Database y establece la sesión de la base de datos.
        """
        self.db = db or SQLAlchemy()
        self.connected = False

    def init_db(self, app):
        """
        Inicializa la base de datos y crea las tablas necesarias.
        """
        self.app = app
        self.connection_thread = threading.Thread(
            target=self.connect_to_db, daemon=True
        )
        self.connection_thread.start()

    def connect_to_db(self):
        """
        Intenta conectar a la base de datos en un bucle hasta que tenga éxito.
        """
        while not self.connected:
            try:
                with self.app.app_context():
                    self.db.init_app(self.app)
                    self.db.create_all()
                    self.connected = True
                    print("✔ Conexión a la base de datos establecida.")
            except (OperationalError, DatabaseError, MySQLDatabaseError) as e:
                print(
                    f"Error al conectar a la base de datos. Reintentando en 30 segundos..."
                )
                time.sleep(30)
            except Exception as e:
                print(f"Error inesperado. Reintentando en 30 segundos...")
                time.sleep(30)
