from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()


class Database:
    """
    Clase para manejar la conexión a la base de datos y las operaciones CRUD.
    """

    def __init__(self):
        self.db_user = os.getenv("DB_USER")
        self.db_password = os.getenv("DB_PASSWORD")
        self.db_host = os.getenv("DB_HOST")
        self.db_name = os.getenv("DB_NAME")
        self.db = SQLAlchemy()

    def init_db(self, app):
        """
        Inicializa la base de datos y crea las tablas necesarias.
        """
        app.config["SQLALCHEMY_DATABASE_URI"] = (
            f"mysql+mysqlconnector://{self.db_user}:{self.db_password}@{self.db_host}/{self.db_name}"
        )
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        self.db.init_app(app)
        with app.app_context():
            self.db.create_all()

        print("Connected to the database!")
