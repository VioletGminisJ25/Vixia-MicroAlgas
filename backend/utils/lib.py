from flask import jsonify
import random
import os
from utils.wave_lenght import WAVELENGTHS
import math
from datetime import datetime
import json
from statistics import mean
from collections import defaultdict


colors = {"white": False, "blue": False, "red": False}
ph = 0.0
temp = 0


def get_colors():
    for color in colors:
        colors[color] = random.choice([True, False])
    return colors


def get_ph_temp():
    ph = random.uniform(0, 14)
    temp = random.uniform(0, 40)
    details = {"ph": round(ph, 2), "temperature": round(temp, 2)}
    return details


def get_rgb():
    color = {}
    color.update(
        {
            "r": random.randrange(0, 256),
            "g": random.randrange(0, 256),
            "b": random.randrange(0, 256),
        }
    )
    return color


def file_path_handler(path):
    try:
        os.startfile(path)
        return jsonify({"message": "La ruta es correcta"}), 200
    except FileNotFoundError as e:
        return jsonify({"error": f"No se encuenta la ruta {e}"}), 404
    except PermissionError as e:
        return jsonify({"error": f"No tienes permisos en el directorio {e}"}), 403
    except OSError as e:
        return jsonify({"error": f"No se puedo abir la ruta{e}"}), 400


def data_handler():
    return {
        "colors": get_colors(),
        "rgb": get_rgb(),
        "data": get_ph_temp(),
        "wave_lenght": WAVELENGTHS,
    }


def get_hours(data):

    path, status, date = generate_path_file(data)
    if status != 200:
        return jsonify(path), status

    file_data, status = get_file_data(path)
    if status != 200:
        return jsonify(file_data), status

    hours = []
    for key in file_data.keys():
        hour = key.split(" ")[1]
        hours.append(hour)

    return jsonify(hours), 200


def get_comparation(data):
    path, status, date = generate_path_file(data)
    if status != 200:
        return jsonify(path), status
    file, status = get_file_data(path)
    if status != 200:
        return jsonify(file), status

    try:
        comparation = file[date]
    except KeyError:
        return jsonify({"error": f"No hay datos para la hora {date}"}), 404

    return jsonify({"last_data": data_handler(), "selected_data": comparation}), 200


def get_file_data(path):
    print(path)
    try:
        with open(path, "r") as f:
            return json.load(f), 200
    except FileNotFoundError:
        return {"error": "No se encuentra la medicion"}, 404
    except IOError:
        return {"error": "INTERNAL SERVER ERROR"}, 400


def generate_path_file(data):
    raw_date = data.get("date")
    try:
        if len(raw_date) == 10:
            # Solo tiene año-mes-día
            date = datetime.strptime(raw_date, "%Y-%m-%d")
        else:
            # Tiene año-mes-día hora:min:seg
            date = datetime.strptime(raw_date, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return {"error": "INTERNAL SERVER ERROR"}, 400
    month = str(date.month).zfill(2)
    day = str(date.day).zfill(2)
    week = str(date.isocalendar().week).zfill(2)
    path = f"bd/data/{date.year}/{month}/semana_{week}/{date.year}_{month}_{day}.json"
    return path, 200, str(date)


def get_ph_temp_average(data):
    daily_values = defaultdict(lambda: {"temperature": [], "ph": []})
    year = data.get("year")
    base_path = f"bd/data/{year}"
    month, week = 1, 1
    week_found = False
    while os.path.exists(f"{base_path}/{month:02d}"):
        day = 1
        while os.path.exists(f"{base_path}/{month:02d}/semana_{week:02d}"):
            week_found = True
            while True:
                path = f"{base_path}/{month:02d}/semana_{week:02d}/{year}_{month:02d}_{day:02d}.json"
                print(path)
                if not os.path.exists(path):
                    break
                else:
                    with open(path, "r") as f:
                        data = json.load(f)
                        for timestamp, value in data.items():
                            date = timestamp.split()[0]
                            temp = value.get("data", {}).get("temperature")
                            ph = value.get("data", {}).get("ph")
                            if temp is not None and ph is not None:
                                daily_values[date]["temperature"].append(temp)
                                daily_values[date]["ph"].append(ph)
                day += 1
            if os.path.exists(f"{base_path}/{month+1:02d}/semana_{week:02d}"):
                break
            week += 1
        month += 1
    daily_averages = {}
    for date, value in daily_values.items():
        daily_averages[date] = {
            "temperature_average": round(mean(value["temperature"]), 2),
            "ph_average": round(mean(value["ph"]), 2),
        }

    if daily_averages == {}:
        return jsonify({"error": "No hay datos para la medicion"}), 404
    else:
        return jsonify(daily_averages), 200
