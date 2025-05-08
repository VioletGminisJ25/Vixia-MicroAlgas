from flask import Blueprint, request, jsonify
from database.queries import DataQueries

queries = DataQueries()

data_routes = Blueprint("data_routes", __name__)


@data_routes.route("/get_hours", methods=["POST"])
def get_hours_route():
    """Endpoint para obtener las horas de los datos de un archivo JSON."""
    data = request.json
    print(data)
    return queries.get_hours_bd(data)


@data_routes.route("/get_comparation", methods=["POST"])
def get_comparation_route():
    """Endpoint para obtener la comparacion de los datos de un archivo JSON."""
    data = request.json
    print(data)
    result = queries.get_comparation(data)
    print(result)
    return result


@data_routes.route("/ph", methods=["POST"])
def get_ph_route():
    """Endpoint para obtener el pH promedio diario de los datos de un archivo JSON."""
    return queries.get_data("ph")


@data_routes.route("/temp", methods=["POST"])
def get_temp_route():
    """Endpoint para obtener el pH promedio diario de los datos de un archivo JSON."""
    return queries.get_data("temperature")


@data_routes.route("/wake_up", methods=["POST"])
def wake_up_route():
    """Endpoint para obtener el estado de las luces de los datos de un archivo JSON."""
    pass
