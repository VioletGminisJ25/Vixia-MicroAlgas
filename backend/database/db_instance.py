from database.db import Database
from flask_executor import Executor
from flask import current_app

db_instance = Database()


def init_executor(app):
    """
    Inicializa el Executor para manejar tareas en segundo plano.
    """
    executor = Executor(app)
    return executor
