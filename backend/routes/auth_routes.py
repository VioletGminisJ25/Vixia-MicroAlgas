"""
Este modulo define las rutas para la aplicación Flask.
"""

from flask import Blueprint
from utils.lib import (
    file_path_handler,
    data_handler,
    get_hours,
    get_comparation,
    get_ph_temp_average,
)
from utils.auth import register_handler, login_handler
from flask import jsonify, request
from markupsafe import escape
from database.queries import DataQueries

queries = DataQueries()

auth_routes = Blueprint("routes", __name__)


@auth_routes.route("/")
def inicio():
    return jsonify({"message": "The app is on"})


@auth_routes.route("/data", methods=["GET"])
def data_route():
    """Ruta para obtener los datos mas actuales del arduino cada 15 minutos."""
    return jsonify(data_handler()), 200


@auth_routes.route("/file_path", methods=["POST"])
def file_path_route():
    return file_path_handler(escape(request.data.decode("utf-8")))


@auth_routes.route("/register", methods=["POST"])
def register_route():
    """
    Endpoint para registrar un nuevo usuario.

    JSON esperado:
        {
            "name": "usuario",
            "password": "contraseña",
            "email": "correo@example.com"
        }

    Returns:
        JSON con mensaje de éxito o error.
    """
    data = request.json
    return register_handler(data)


@auth_routes.route("/login", methods=["POST"])
def login_route():
    """
    Endpoint para iniciar sesión de un usuario existente.
    JSON esperado:
        {
            "email": "correo@example.com"
            "password": "contraseña",
        }
    """
    data = request.json
    return login_handler(data)


@auth_routes.route("/get_hours", methods=["POST"])
def get_hours_route():
    """Endpoint para obtener las horas de los datos de un archivo JSON."""
    data = request.json
    print(data)
    return queries.get_hours_bd(data)


@auth_routes.route("/get_comparation", methods=["POST"])
def get_comparation_route():
    """Endpoint para obtener la comparacion de los datos de un archivo JSON."""
    data = request.json
    print(data)
    result = queries.get_comparation(data)
    print(result)
    return result


@auth_routes.route("/ph_temp", methods=["POST"])
def get_ph_temp_route():
    """Endpoint para obtener la temperatura y pH promedio diaria de los datos de un archivo JSON."""
    data = request.json
    print(data)
    return get_ph_temp_average(data)


@auth_routes.route("/ph", methods=["POST"])
def get_ph_route():
    """Endpoint para obtener el pH promedio diario de los datos de un archivo JSON."""
    return queries.get_ph()


@auth_routes.route("/insert", methods=["POST"])
def insert_data_route():
    """Endpoint para obtener el pH promedio diario de los datos de un archivo JSON."""
    # return queries.insertar_datos_ficticios()
    pass
