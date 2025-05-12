"""
Este modulo define las rutas para la aplicación Flask.
"""

from flask import Blueprint
from utils.lib import file_path_handler
from auth.auth import register_handler, login_handler
from flask import jsonify, request
from markupsafe import escape


auth_routes = Blueprint("routes", __name__)


@auth_routes.route("/")
def inicio():
    return jsonify({"message": "The app is on"})


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
