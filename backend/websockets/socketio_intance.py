from flask_socketio import SocketIO

socketio = None


def socketio_init(app):
    global socketio
    socketio = SocketIO(app, cors_allowed_origins="*")
    return socketio
