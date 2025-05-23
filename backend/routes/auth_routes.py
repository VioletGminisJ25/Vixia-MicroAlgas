"""
Este modulo define las rutas para la aplicación Flask.
"""

from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required
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


@auth_routes.route("/check_auth", methods=["GET"])
@jwt_required()  # Esta línea asegura que solo los usuarios con un JWT válido puedan acceder
def check_auth_status():
    """
    Endpoint para que el frontend verifique el estado de autenticación.
    Si la cookie JWT es válida, retorna 200 OK y la identidad del usuario.
    Si no, Flask-JWT-Extended interceptará y retornará un 401 automáticamente.
    """
    current_user_email = get_jwt_identity()
    return jsonify(logged_in_as=current_user_email), 200
