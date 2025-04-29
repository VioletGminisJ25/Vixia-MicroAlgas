from flask import Flask
from flask_executor import Executor

executor_instance = Executor()


def init_executor(app: Flask, executor_type="thread", max_workers=4):
    """
    Inicializa la instancia del Executor con la aplicación Flask y la configuración.
    """
    app.config["EXECUTOR_TYPE"] = executor_type
    app.config["EXECUTOR_MAX_WORKERS"] = max_workers
    executor_instance.init_app(app)
    print("Executor initialized!")
