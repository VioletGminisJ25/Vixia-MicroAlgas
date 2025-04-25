import random
import json
import os
import re
from datetime import datetime, timedelta


def generar_dato(timestamp):
    return {
        timestamp: {
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
            "wave_lenght": [round(random.uniform(280, 800), 1) for _ in range(288)],
            "periodo_dia": get_periodo_dia(timestamp),
        }
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


def compactar_longitud_onda(json_str):
    def _compactar(match):
        lista = json.loads(match.group(1))
        return f'"longitud_onda": {json.dumps(lista)}'

    return re.sub(
        r'"longitud_onda": (\[\s+(?:[0-9\.,\s]+?)\])',
        _compactar,
        json_str,
        flags=re.DOTALL,
    )


# Fecha de inicio y fin
inicio = datetime(2025, 1, 1)
hoy = datetime.now()
dias_totales = (hoy - inicio).days + 1  # Incluir hoy

for dia in range(dias_totales):
    datos = {}
    fecha = inicio + timedelta(days=dia)
    base_time = fecha.replace(hour=0, minute=0, second=0)

    for i in range(20):
        timestamp = (base_time + timedelta(minutes=i * 15)).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        datos.update(generar_dato(timestamp))

    # Serializar
    json_str = json.dumps(datos, indent=4)
    json_str = compactar_longitud_onda(json_str)

    # Crear rutas
    año = fecha.strftime("%Y")
    mes = fecha.strftime("%m")
    semana = fecha.isocalendar()[1]
    nombre_archivo = fecha.strftime("%Y_%m_%d.json")
    ruta = os.path.join("bd/data/2025", mes, f"semana_{semana:02d}")
    os.makedirs(ruta, exist_ok=True)

    # Guardar
    with open(os.path.join(ruta, nombre_archivo), "w") as f:
        f.write(json_str)

print("✔ Datos simulados generados por día desde 2025 hasta hoy.")
