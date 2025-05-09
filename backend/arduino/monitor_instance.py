from arduino.SerialMonitor import SerialMonitor
from dotenv import load_dotenv

load_dotenv()
import os

# Variable global para la instancia de monitor
monitor = None


def create_monitor(app, socketio):
    """
    Crea y configura la instancia global de SerialMonitor.
    """
    global monitor
    if monitor is None:  # Evitar múltiples inicializaciones
        monitor = SerialMonitor(os.getenv("BAUD_RATE"), app, socketio)
    return monitor
