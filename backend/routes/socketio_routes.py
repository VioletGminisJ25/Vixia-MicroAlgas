from flask import Blueprint, request
from database.queries import DataQueries
import arduino.monitor_instance

queries = DataQueries()
socket_routes = Blueprint("socket_routes", __name__)


def register_socketio_events(socketio):
    """Registra los eventos de SocketIO."""

    @socketio.on("connect")
    def handle_connect():
        sid = request.sid
        print(queries.get_latest_data())
        socketio.emit("arduino_data", queries.get_latest_data(), to=sid)
        socketio.emit("lights_state", queries.get_latest_color(), to=sid)
        socketio.emit(
            "manual_mode",
            not arduino.monitor_instance.monitor.automatic_mode,
            to=sid,
        )
        socketio.emit("wake_up_state", arduino.monitor_instance.monitor.active, to=sid)

    @socketio.on("disconnect")
    def handle_disconnect():
        print("Cliente desconectado!")
