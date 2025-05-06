from flask import Blueprint, request
from database.queries import DataQueries

queries = DataQueries()
socket_routes = Blueprint("socket_routes", __name__)


def register_socketio_events(socketio):
    """Registra los eventos de SocketIO."""

    @socketio.on("connect")
    def handle_connect():
        sid = request.sid
        socketio.emit("arduino_data", queries.get_latest_data(), to=sid)

    @socketio.on("disconnect")
    def handle_disconnect():
        print("Cliente desconectado!")
