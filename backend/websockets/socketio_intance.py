from flask_socketio import SocketIO

socketio = None


def socketio_init(app):
    global socketio
    socketio = SocketIO(
        app,
        cors_allowed_origins=[
            "http://localhost:4321",
            "http://193.146.35.176:4321",
        ],  # Cambiar esto si es necesario al pasar a otro equipo
    )
    return socketio


def get_socketio():
    """Devuelve la instancia de SocketIO si ya ha sido inicializada."""
    if socketio is None:
        raise RuntimeError(
            "SocketIO no ha sido inicializado. Llama a socketio_init(app) primero."
        )
    return socketio
