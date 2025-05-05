from flask import Blueprint
from websockets.socketio_intance import socketio

socket_routes = Blueprint("socket_routes", __name__)


@socketio.on("connect")
def handle_connect():
    print("Cliente Conectado!")


@socketio.on("disconnect")
def handle_connect():
    print("Cliente Conectado!")
