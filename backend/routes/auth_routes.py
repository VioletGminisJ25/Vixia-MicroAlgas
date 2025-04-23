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

auth_routes = Blueprint("routes", __name__)


@auth_routes.route("/")
def inicio():
    return jsonify({"message": "The app is on"})


@auth_routes.route("/data", methods=["GET"])
def data_route():
    return jsonify(data_handler()), 200


@auth_routes.route("/file_path", methods=["POST"])
def file_path_route():
    return file_path_handler(escape(request.data.decode("utf-8")))


@auth_routes.route("/register", methods=["POST"])
def register_route():
    data = request.json
    return register_handler(data)


@auth_routes.route("/login", methods=["POST"])
def login_route():
    data = request.json
    return login_handler(data)


@auth_routes.route("/get_hours", methods=["POST"])
def get_hours_route():
    data = request.json
    print(data)
    return get_hours(data)


@auth_routes.route("/get_comparation", methods=["POST"])
def get_comparation_route():
    data = request.json
    print(data)
    return get_comparation(data)


@auth_routes.route("/ph_temp", methods=["POST"])
def get_ph_temp_route():
    data = request.json
    print(data)
    return get_ph_temp_average(data)
