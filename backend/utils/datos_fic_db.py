import random
from datetime import datetime, timedelta


def generar_dato(timestamp):
    return {
        "timestamp": timestamp,
        "rgb": {
            "r": random.randint(0, 255),
            "g": random.randint(0, 255),
            "b": random.randint(0, 255),
        },
        "colors": {
            "blue": random.choice([True, False]),
            "red": random.choice([True, False]),
            "white": random.choice([True, False]),
        },
        "data": {
            "temperature": round(random.uniform(15, 30), 1),
            "ph": round(random.uniform(6.5, 8.5), 1),
        },
        "wave_length": [round(random.uniform(280, 800), 1) for _ in range(288)],
        "periodo_dia": get_periodo_dia(timestamp),
    }


def get_periodo_dia(timestamp):
    """
    Determina el periodo del día basado en la hora del timestamp.
    """
    hora = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S").hour
    if 0 <= hora < 6:
        return "noche"
    elif 6 <= hora < 14:
        return "mañana"
    elif 14 <= hora < 20:
        return "tarde"
    else:
        return "noche"
