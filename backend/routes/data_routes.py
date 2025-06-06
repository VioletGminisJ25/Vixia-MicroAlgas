from datetime import datetime
from flask import Blueprint, abort, request, jsonify
from database.queries import DataQueries
import arduino.monitor_instance
from arduino.util import async_measurement_config_send, reboot_arduino
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
            async_measurement_config_send(
                arduino.monitor_instance.monitor, reboot=False, manual=True
            )
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


@data_routes.route("/get_config", methods=["GET"])
def get_config_route():
    """Endpoint para obtener la configuracion de los datos de un archivo JSON."""
    data, error = queries.get_config()
    return jsonify(data), error


@data_routes.route("/change_config", methods=["POST"])
def change_config():
    data = request.json
    message, status = asyncio.run(reboot_arduino(False, data))
    return jsonify(message), status


@data_routes.route("/get_name", methods=["GET"])
def get_route_name():
    message, status = queries.get_proc_name()
    return jsonify(message), status


@data_routes.route("/get_all_names", methods=["GET"])
def get_route_names():
    message, status = queries.get_proc_names()
    return jsonify(message), status


@data_routes.route("/proc")
def get_route_proc():
    """Endpoint para obtener el proceso de los datos de un archivo JSON."""
    proc_name = request.args.get("name")
    message, status = queries.get_proc(proc_name)
    return jsonify(message), status


@data_routes.route("/export", methods=["GET"])
def export_route():
    fecha_str = request.args.get("fecha")  # Lee el parámetro `fecha` de la URL

    if not fecha_str:
        abort(400, description="Falta el parámetro 'fecha' en la URL.")

    try:
        # Intenta convertirlo a un objeto datetime (ISO 8601)
        fecha_obj = datetime.fromisoformat(fecha_str)
    except ValueError:
        abort(
            400,
            description="Formato de fecha inválido. Usa formato ISO 8601 (ej. 2025-05-21T14:30:00).",
        )

    # Pasa el datetime a tu función de exportación
    return queries.export_all_data_to_excel(fecha_obj)


@data_routes.route("/export/proc", methods=["GET"])
def export_process_route():
    name = request.args.get("name")  # Lee el parámetro `fecha` de la URL

    if not name:
        abort(400, description="Falta el parámetro 'fecha' en la URL.")

    # Pasa el datetime a tu función de exportación
    return queries.export_process_to_excel(name)