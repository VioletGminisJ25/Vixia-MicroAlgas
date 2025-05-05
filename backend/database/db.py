from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()


class Database:
    """
    Clase para manejar la conexión a la base de datos y las operaciones CRUD.
    """

    def __init__(self):
        self.db = SQLAlchemy()

    def init_db(self, app):
        """
        Inicializa la base de datos y crea las tablas necesarias.
        """
        try:
            with app.app_context():
                self.db.init_app(app)
                self.db.create_all()

            print("Connected to the database!")
        except Exception as e:
            print(f"Error connecting to the database: {e}")
