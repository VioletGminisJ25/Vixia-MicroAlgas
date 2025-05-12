from flask import Blueprint, request, jsonify
from database.queries import DataQueries
import arduino.monitor_instance
from arduino.util import measurement_config_send
import asyncio
import websockets.socketio_intance

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


@data_routes.route("/wake_up", methods=["GET"])
def wake_up_route():
    """Endpoint para obtener el estado de las luces de los datos de un archivo JSON."""
    try:

        arduino.monitor_instance.monitor.active = (
            not arduino.monitor_instance.monitor.active
        )
        print(arduino.monitor_instance.monitor.active)
        websockets.socketio_intance.socketio.emit(
            "wake_up_state", arduino.monitor_instance.monitor.active
        )
        return jsonify(
            {"status": "success", "message": "Manual measurement command sent."}, 200
        )
    except Exception as e:
        return jsonify(
            {
                "status": "error",
                "message": "Failed to send manual measurement command.",
            },
            500,
        )


@data_routes.route("/get_manual", methods=["GET"])
def manual_mode_route():
    """Endpoint para hacer una medicion manual de arduino"""
    try:
        arduino.monitor_instance.monitor.send_command("M")
        asyncio.run(
            measurement_config_send(arduino.monitor_instance.monitor, manual=True)
        )
        # Add a return statement after the command is sent
        return jsonify(
            {"status": "success", "message": "Manual measurement command sent."}, 200
        )
    except Exception as e:
        # Optional: Add basic error handling in case sending command fails
        print(f"Error sending manual command: {e}")
        return jsonify(
            {
                "status": "error",
                "message": "Failed to send manual measurement command.",
            },
            500,
        )
