from collections import defaultdict
from flask import jsonify
from database.models import (
    MainDatetime,
    Rgb,
    Colors,
    SensorData,
    WaveLength,
    WaveLength_White,
    Config,
)
from database.db_instance import db_instance
from sqlalchemy.exc import OperationalError, DatabaseError
from mysql.connector.errors import DatabaseError as MySQLDatabaseError

import random
from datetime import datetime, timedelta
from utils.datos_fic_db import generar_dato
from utils.lib import data_handler, get_periodo_dia
from sqlalchemy import extract
from database.executor_instance import executor_instance
import os
from dotenv import load_dotenv
import math

load_dotenv()

WAVELENGTHS = [
    311.93,
    314.64,
    317.34,
    320.05,
    322.75,
    325.45,
    328.14,
    330.84,
    333.53,
    336.21,
    338.90,
    341.58,
    344.26,
    346.94,
    349.61,
    352.28,
    354.95,
    357.62,
    360.28,
    362.94,
    365.59,
    368.24,
    370.89,
    373.54,
    376.18,
    378.82,
    381.45,
    384.08,
    386.71,
    389.34,
    391.96,
    394.57,
    397.19,
    399.80,
    402.40,
    405.00,
    407.60,
    410.20,
    412.79,
    415.37,
    417.96,
    420.53,
    423.11,
    425.68,
    428.25,
    430.81,
    433.36,
    435.92,
    438.47,
    441.01,
    443.55,
    446.09,
    448.62,
    451.15,
    453.67,
    456.19,
    458.70,
    461.21,
    463.71,
    466.21,
    468.71,
    471.20,
    473.68,
    476.16,
    478.64,
    481.11,
    483.57,
    486.04,
    488.49,
    490.94,
    493.39,
    495.83,
    498.27,
    500.70,
    503.12,
    505.54,
    507.96,
    510.37,
    512.77,
    515.17,
    517.57,
    519.96,
    522.34,
    524.72,
    527.09,
    529.46,
    531.82,
    534.18,
    536.53,
    538.88,
    541.22,
    543.55,
    545.88,
    548.20,
    550.52,
    552.83,
    555.14,
    557.44,
    559.74,
    562.03,
    564.31,
    566.59,
    568.86,
    571.13,
    573.39,
    575.64,
    577.89,
    580.13,
    582.37,
    584.60,
    586.83,
    589.05,
    591.26,
    593.47,
    595.67,
    597.87,
    600.06,
    602.24,
    604.42,
    606.59,
    608.75,
    610.91,
    613.06,
    615.21,
    617.35,
    619.49,
    621.62,
    623.74,
    625.85,
    627.96,
    630.07,
    632.16,
    634.26,
    636.34,
    638.42,
    640.49,
    642.56,
    644.62,
    646.67,
    648.72,
    650.76,
    652.79,
    654.82,
    656.84,
    658.86,
    660.87,
    662.87,
    664.87,
    666.86,
    668.84,
    670.82,
    672.79,
    674.76,
    676.71,
    678.67,
    680.61,
    682.55,
    684.48,
    686.41,
    688.33,
    690.24,
    692.15,
    694.05,
    695.94,
    697.83,
    699.71,
    701.59,
    703.46,
    705.32,
    707.18,
    709.02,
    710.87,
    712.70,
    714.53,
    716.36,
    718.18,
    719.99,
    721.79,
    723.59,
    725.38,
    727.17,
    728.94,
    730.72,
    732.48,
    734.24,
    736.00,
    737.74,
    739.48,
    741.22,
    742.95,
    744.67,
    746.38,
    748.09,
    749.79,
    751.49,
    753.18,
    754.86,
    756.54,
    758.21,
    759.88,
    761.54,
    763.19,
    764.83,
    766.47,
    768.11,
    769.73,
    771.36,
    772.97,
    774.58,
    776.18,
    777.78,
    779.37,
    780.95,
    782.53,
    784.11,
    785.67,
    787.23,
    788.79,
    790.33,
    791.88,
    793.41,
    794.94,
    796.47,
    797.98,
    799.50,
    801.00,
    802.50,
    804.00,
    805.49,
    806.97,
    808.45,
    809.92,
    811.39,
    812.85,
    814.30,
    815.75,
    817.19,
    818.63,
    820.06,
    821.49,
    822.91,
    824.32,
    825.73,
    827.13,
    828.53,
    829.92,
    831.31,
    832.69,
    834.07,
    835.44,
    836.81,
    838.17,
    839.52,
    840.87,
    842.22,
    843.55,
    844.89,
    846.22,
    847.54,
    848.86,
    850.17,
    851.48,
    852.79,
    854.08,
    855.38,
    856.67,
    857.95,
    859.23,
    860.50,
    861.77,
    863.04,
    864.30,
    865.55,
    866.80,
    868.05,
    869.29,
    870.53,
    871.76,
    872.99,
    874.21,
    875.43,
    876.64,
    877.85,
    879.06,
    880.26,
    881.46,
    882.65,
    883.84,
]


class DataQueries:
    """
    Clase para manejar las consultas a la base de datos.
    Esta clase contiene métodos para obtener datos de las tablas SensorData, Rgb, Colors y MainDatetime.
    También incluye métodos para insertar datos ficticios y realizar comparaciones de datos.
    """

    def __init__(self):
        """
        Inicializa la clase DataQueries y establece la sesión de la base de datos.
        """
        self.session = db_instance.db.session

    def get_sensor_data(self):
        """
        Obtiene todos los datos de la tabla SensorData.
        """
        print(self.session.query(SensorData).all())
        return self.session.query(SensorData).all()

    def insertar_datos_ficticios(self):
        """
        Inserta datos ficticios en la base de datos para las tablas MainDatetime, SensorData, Rgb, Colors y WaveLength.
        Genera datos aleatorios para cada tabla y los inserta en la base de datos.
        """
        # Fecha de inicio y fin
        inicio = datetime(2025, 1, 1)
        hoy = datetime.now()
        dias_totales = (hoy - inicio).days + 1  # Incluir hoy

        # Obtener la sesión de la base de datos
        session = db_instance.db.session

        for dia in range(dias_totales):
            fecha = inicio + timedelta(days=dia)
            base_time = fecha.replace(hour=0, minute=0, second=0)

            for i in range(96):  # Generar 96 registros por día
                timestamp = (base_time + timedelta(minutes=i * 15)).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                dato = generar_dato(timestamp)

                # Insertar en la tabla MainDatetime
                main_datetime = MainDatetime(
                    datetime=timestamp, period_day=dato["periodo_dia"]
                )
                session.add(main_datetime)

                # Insertar en la tabla SensorData
                sensor_data = SensorData(
                    datetime=timestamp,
                    ph=dato["data"]["ph"],
                    temperature=dato["data"]["temperature"],
                )
                session.add(sensor_data)

                # Insertar en la tabla Rgb
                rgb = Rgb(
                    datetime=timestamp,
                    r=dato["rgb"]["r"],
                    g=dato["rgb"]["g"],
                    b=dato["rgb"]["b"],
                )
                session.add(rgb)

                # Insertar en la tabla Colors
                colors = Colors(
                    datetime=timestamp,
                    red=dato["colors"]["red"],
                    white=dato["colors"]["white"],
                    blue=dato["colors"]["blue"],
                )
                session.add(colors)

                # Insertar en la tabla WaveLength
                for position, value in enumerate(dato["wave_length"]):
                    wave_length = WaveLength(
                        datetime=timestamp, position=position, value=value
                    )
                    session.add(wave_length)

            # Confirmar los cambios en la base de datos
            session.commit()

        print("✔ Datos ficticios insertados en la base de datos.")

    def get_hours_bd(self, data):
        """
        Obtiene las horas de los datos de la base de datos en funcion de la fecha proporcionada. Desde la tabla MainDatetime.
        """
        fecha = data.get("date")
        try:

            if len(fecha) == 10:
                # Solo tiene año-mes-día
                fecha = datetime.strptime(fecha, "%Y-%m-%d").date()
            else:
                # Tiene año-mes-día hora:min:seg
                fecha = datetime.strptime(fecha.split(" ")[0], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Formato de datos invalido"}, 400)
        hours = (
            self.session.query(
                db_instance.db.func.time_format(MainDatetime.datetime, "%H:%i:%s")
            )
            .filter(db_instance.db.func.date(MainDatetime.datetime) == fecha)
            .distinct()
            .order_by(MainDatetime.datetime)
            .all()
        )
        list_hours = [hour[0] for hour in hours]
        print(list_hours)
        if not list_hours:
            return (
                jsonify(
                    {"error": "No se encontraron datos para la fecha proporcionada."}
                ),
                404,
            )

        return jsonify(list_hours), 200

    def get_comparation(self, data):
        """
        Obtiene los datos de los sensores, RGB, colores y longitud de onda
        de una fecha/hora determinada y los compara con los datos actuales.
        Optimizado para rendimiento.
        """
        try:
            fecha_raw = data.get("date")
            if not fecha_raw or len(fecha_raw) != 19:  # Validar formato esperado
                raise ValueError(
                    "Formato de fecha no valido, se requiere 'YYYY-MM-DD HH:MM:SS'"
                )
            # Parsear directamente al objeto datetime completo
            fecha_dt = datetime.strptime(fecha_raw, "%Y-%m-%d %H:%M:%S")

        except (ValueError, TypeError) as e:
            print(f"Error parsing date: {e}")  # Loguear el error ayuda a depurar
            return (
                jsonify(
                    {
                        "error": "Formato de fecha no valido o ausente. Se requiere 'YYYY-MM-DD HH:MM:SS'"
                    }
                ),
                400,
            )

        selected_data = {"x": WAVELENGTHS}
        try:
            # --- Consulta Principal Optimizada (Query 1) ---
            # Une SensorData, Rgb y Colors filtrando por el timestamp exacto
            main_result = (
                self.session.query(
                    SensorData.ph,
                    SensorData.temperature,
                    Rgb.r,
                    Rgb.g,
                    Rgb.b,
                )
                .select_from(SensorData)
                .outerjoin(Rgb, SensorData.datetime == Rgb.datetime)
                .filter(SensorData.datetime == fecha_dt)
                .first()
            )  # Usamos first() porque esperamos un único resultado para un timestamp exacto

            print(main_result)

            if not main_result:
                # No se encontraron datos para ese timestamp exacto
                return (
                    jsonify(
                        {
                            "error": f"No se encontraron datos para la fecha y hora: {fecha_raw}"
                        }
                    ),
                    404,
                )

            # Construir parte del diccionario selected_data
            selected_data["data"] = {
                "ph": main_result.ph,
                "temperature": main_result.temperature,
            }
            # --- Consulta Optimizada para WaveLength (Query 2) ---
            wavelength_results = (
                self.session.query(WaveLength.value)
                .filter(WaveLength.datetime == fecha_dt)
                .order_by(WaveLength.position)
                .all()
            )
            selected_data["rgb"] = calculate_rgb(
                [item[0] for item in wavelength_results],
                self.get_reference_wavelength_white(),
            )

            # Extraer solo los valores de la lista de tuplas [(valor,), (valor,), ...]
            selected_data["wave_length"] = [item[0] for item in wavelength_results]
            selected_data["nc"] = calculate_nc(selected_data["wave_length"])

            if selected_data == []:
                return jsonify({"Datos corruptos"}), 400

            # --- Obtener Últimos Datos ---
            # Asumiendo que data_handler() es razonablemente rápido. Si no, también necesita optimización.

            # --- Devolver Respuesta ---
            return (
                jsonify(
                    {
                        "selected_data": selected_data,
                    }
                ),
                200,
            )

        except Exception as e:
            # Captura errores inesperados durante la consulta o procesamiento
            self.session.rollback()  # Revertir la transacción si algo falla
            print(f"Error during database query or processing: {e}")  # Loguear el error
            return (
                jsonify({"error": "Internal Server Error"}),
                500,
            )

    def calendar(self, datatype):
        """
        Obtiene los datos de pH o temperatura promedio diario de la base de datos.
        """
        if datatype not in ["ph", "temperature"]:
            return jsonify({"error": "Tipo de dato no valido"}), 400
        colum_to_avg = getattr(SensorData, datatype)
        results = (
            self.session.query(
                extract("year", SensorData.datetime).label("year"),
                SensorData.datetime.label("datetime"),
                db_instance.db.func.avg(colum_to_avg).label("avg"),
            )
            .group_by(
                extract("year", SensorData.datetime),
                extract("month", SensorData.datetime),
                extract("day", SensorData.datetime),
            )
            .order_by(
                extract("year", SensorData.datetime),
                extract("month", SensorData.datetime),
                extract("day", SensorData.datetime),
            )
            .all()
        )

        output = defaultdict(lambda: {"values": []})
        avgs = []
        for year, datetime, avg in results:
            avgs.append(avg)
            output[year]["values"].append(
                {
                    "day": str(datetime).split(" ")[0],
                    "value": round(avg, 2),
                }
            )
        years_to_add = [2026, 2027, 2028]  # Cambia este valor al año que quieras añadir
        for year_to_add in years_to_add:
            if year_to_add not in output:
                output[year_to_add] = {
                    "values": [
                        {f"day": "{year_to_add}-01-01", "value": 7.2},
                        {f"day": "{year_to_add}-01-02", "value": 7.4},
                        {f"day": "{year_to_add}-01-03", "value": 7.1},
                    ]
                }

        formatted_output = []
        for year, data in output.items():
            formatted_output.append(
                {
                    "year": year,
                    "values": data["values"],
                    "min": min(avgs),
                    "max": max(avgs),
                }
            )

        return formatted_output

    def responsive_line(self, datatype):
        """
        Obtiene los datos de pH o temperatura promedio semanal de la base de datos.
        """
        if datatype not in ["ph", "temperature"]:
            return jsonify({"error": "Tipo de dato no valido"}), 400
        colum_obj = getattr(SensorData, datatype)
        results = (
            self.session.query(
                db_instance.db.func.year(SensorData.datetime).label("year"),
                db_instance.db.func.week(SensorData.datetime).label("week"),
                db_instance.db.func.min(colum_obj).label("min_value"),
                db_instance.db.func.max(colum_obj).label("max_value"),
            )
            .group_by("year", "week")
            .order_by("year", "week")
            .all()
        )
        min_data = defaultdict(list)
        max_data = defaultdict(list)
        for year, week, min_value, max_value in results:
            min_data[year].append({"x": week, "y": round(min_value, 2)})
            max_data[year].append({"x": week, "y": round(max_value, 2)})
            formatted_output = [
                {
                    "id": "min",
                    "data": [
                        item
                        for sublist in [data for data in min_data.values()]
                        for item in sublist
                    ],
                },
                {
                    "id": "max",
                    "data": [
                        item
                        for sublist in [data for data in max_data.values()]
                        for item in sublist
                    ],
                },
            ]
        return formatted_output

    def bullet_chart(self, datatype):

        if datatype not in ["ph", "temperature"]:
            return jsonify({"error": "Tipo de dato no valido"}), 400
        colum_obj = getattr(SensorData, datatype)
        results = (
            self.session.query(
                db_instance.db.func.year(SensorData.datetime).label("year"),
                db_instance.db.func.week(SensorData.datetime).label("week"),
                db_instance.db.func.avg(colum_obj).label("avg_value"),
            )
            .group_by("year", "week")
            .order_by("year", "week")
            .all()
        )

    def swarm_plot(self, datatype):
        """
        Obtiene los datos de pH o temperatura agrupados por hora y cuenta la cantidad de ocurrencias de cada valor.
        """
        if datatype not in ["ph", "temperature"]:
            return jsonify({"error": "Tipo de dato no valido"}), 400

        # --- Query ---
        colum_obj = getattr(SensorData, datatype)
        results = self.session.query(
            db_instance.db.func.hour(SensorData.datetime).label("hour"),
            colum_obj.label("value"),
        ).all()

        value_counts = {}
        time_day = ["Manana", "Tarde", "Noche"]

        for hour, value in results:
            if value is None:
                continue
            value = round(value, 1)

            # Determinar el grupo (Mañana, Tarde, Noche)
            hour_int = int(hour)  # Asegurarse de que la hora es un entero
            if hour_int >= 6 and hour_int < 14:
                day_out = time_day[0]
            elif hour_int >= 14 and hour_int < 20:
                day_out = time_day[1]
            else:
                day_out = time_day[2]

            if day_out not in value_counts:
                value_counts[day_out] = {}
            if value not in value_counts[day_out]:
                value_counts[day_out][value] = 0

            # Incrementar el contador para esta combinación (grupo, valor)
            value_counts[day_out][value] += 1

        # --- Generación de la Salida Agregada ---
        output = {}
        output_aggregated = []

        # Ordenar los grupos para una salida consistente
        sorted_groups = sorted(value_counts.keys(), key=lambda g: time_day.index(g))

        item_prices = []
        items_volume = []
        for group in sorted_groups:
            group_index = time_day.index(group) + 1
            item_counter_in_group = 0  # Contador para ID dentro del grupo
            # Ordenar valores dentro del grupo para consistencia
            sorted_values = sorted(value_counts[group].keys())

            for value in sorted_values:
                count = value_counts[group][value]
                # Generar un nuevo ID basado en el grupo y el índice del valor único dentro de ese grupo
                item_id = f"{group_index}:{item_counter_in_group:02d}"
                item_prices.append(value)
                items_volume.append(count)
                output_aggregated.append(
                    {
                        "id": item_id,  # Nuevo ID basado en la agregación
                        "price": value,  # El valor único
                        "volume": count,  # El recuento de cuántas veces apareció
                        "group": group,  # El grupo (Mañana, Tarde, Noche)
                    }
                )
                item_counter_in_group += 1

        output = {
            "ID": str(datatype).title(),
            "datos": output_aggregated,
            "values": {
                "volume": [min(items_volume), max(items_volume)],
                "price": [min(item_prices) * 0.95, max(item_prices) * 1.05],
            },
        }

        return output  # Devolver la lista agregada

    def get_data(self, datatype):
        """
        Obtiene los datos de pH de la base de datos.
        Utiliza un executor para ejecutar las consultas en segundo plano y mejorar el rendimiento.
        """

        if datatype not in ["ph", "temperature"]:
            return jsonify({"error": "Tipo de dato no valido"}), 400
        futures = {
            "ResponsiveLine": executor_instance.submit(self.responsive_line, datatype),
            "Calendar": executor_instance.submit(self.calendar, datatype),
            "SwarmPlot": executor_instance.submit(self.swarm_plot, datatype),
        }
        ph_data = {}
        for key, future in futures.items():
            try:
                ph_data[key] = future.result()
            except Exception as e:
                print(f"Error en la tarea {key}: {e}")
                ph_data[key] = None
        if ph_data == {}:
            return jsonify({"error": "No hay datos para la medicion"}), 404
        return jsonify(ph_data), 200

    def insert_data(self, data, is_first_measurement):
        """
        Inserta datos en la base de datos.
        """
        try:
            # Crear una nueva instancia de SensorData
            new_data_main = MainDatetime(
                datetime=data["datetime"],
                period_day=get_periodo_dia(data["datetime"]),
            )
            new_data_sensor = SensorData(
                datetime=data["datetime"],
                ph=float(data["ph"]),
                temperature=float(data["temperature"]),
            )

            # Agregar la nueva instancia a la sesión

            for position, value in enumerate(data["value"]):
                if not is_first_measurement:
                    new_data_wave = WaveLength(
                        datetime=data["datetime"],
                        position=position,
                        value=float(value),
                    )
                    self.session.add(new_data_main)
                    self.session.add(new_data_sensor)
                else:
                    new_data_wave = WaveLength_White(
                        datetime=data["datetime"],
                        position=position,
                        value=float(value),
                        is_reference=False,
                    )
                    # Agregar la nueva instancia a la sesión
                self.session.add(new_data_wave)
            # Confirmar los cambios en la base de datos
            self.session.commit()
            print("✔ Datos insertados en la base de datos.")
        except Exception as e:
            print(f"Error al insertar datos: {e}")
            self.session.rollback()

    def get_latest_data(self):
        try:
            result = (
                self.session.query(
                    SensorData.datetime,
                    SensorData.ph,
                    SensorData.temperature,
                )
                .select_from(SensorData)
                .order_by(SensorData.datetime.desc())
                .first()
            )
            result_wavelength = (
                self.session.query(WaveLength.value)
                .select_from(WaveLength)
                .filter(WaveLength.datetime == result.datetime)
                .order_by(WaveLength.position)
                .all()
            )
            if not result:
                return 404

            last_data = {
                "colors": None,
                "rgb": calculate_rgb(
                    [item[0] for item in result_wavelength],
                    self.get_reference_wavelength_white(),
                ),
                "data": {"temperature": result.temperature, "ph": result.ph},
                "wave_length": [item[0] for item in result_wavelength],
                "x": WAVELENGTHS,
                "nc": calculate_nc([item[0] for item in result_wavelength]),
            }
            print(last_data)
            return last_data
        except (OperationalError, DatabaseError, MySQLDatabaseError) as e:
            print(f"Error al conectar a la base de datos.")
        except Exception as e:
            print(f"Error inesperado.")

    def insert_lights_state_sync(self, lights_state):
        """
        Inserta el estado de los luces en la base de datos.
        """
        try:
            new_LightsState = Colors(
                datetime=datetime.now(),
                roja=lights_state["roja"],
                azul=lights_state["azul"],
                blanca=lights_state["blanca"],
            )
            self.session.add(new_LightsState)
            self.session.commit()
            print("✔ Lights state inserted in the database.")
        except Exception as e:
            print(f"Error al insertar datos: {e}")
            self.session.rollback()

    def get_latest_color(self):
        """Devuelve el último valor de los colores de la tabla Colors."""
        try:
            latest_color = (
                self.session.query(Colors).order_by(Colors.datetime.desc()).first()
            )
            return {
                "roja": latest_color.roja,
                "azul": latest_color.azul,
                "blanca": latest_color.blanca,
            }
        except Exception as e:
            print(f"Error al obtener los colores: {e}")
            self.session.rollback()

    def get_config(self):
        try:
            config = self.session.query(Config).order_by(Config.datetime.desc()).first()
            return (
                {
                    "time_between_measurements": config.time_between_measurements,
                    "time_light": config.time_light,
                    "time_dark": config.time_dark,
                    "light_white": config.light_white,
                    "light_red": config.light_red,
                    "light_blue": config.light_blue,
                },
                200,
            )
        except Exception as e:
            print(f"Error al obtener la configuracion: {e}")
            self.session.rollback()
            return (
                {
                    "time_between_measurements": os.getenv("TIME_BETWEEN_MEASURAMENTS"),
                    "time_light": os.getenv("TIME_LIGHT"),
                    "time_dark": os.getenv("TIME_DARK"),
                    "light_white": os.getenv("LIGHT_WHITE"),
                    "light_red": os.getenv("LIGHT_RED"),
                    "light_blue": os.getenv("LIGHT_BLUE"),
                },
                200,
            )

    def insert_config(
        self,
        time_between_measurements,
        time_light,
        time_dark,
        light_white,
        light_red,
        light_blue,
    ):
        try:
            last_config = (
                self.session.query(Config).order_by(Config.datetime.desc()).first()
            )
            if (
                last_config
                and last_config.time_between_measurements == time_between_measurements
                and last_config.time_light == time_light
                and last_config.time_dark == time_dark
                and last_config.light_white == light_white
                and last_config.light_red == light_red
                and last_config.light_blue == light_blue
            ):
                print(
                    "ℹ La configuración es idéntica a la última guardada. No se insertará."
                )
                return {
                    "status": "info",
                    "message": "La configuración es idéntica a la última guardada. No se insertó.",
                }, 200
            new_config = Config(
                time_between_measurements=time_between_measurements,
                time_light=time_light,
                time_dark=time_dark,
                light_white=light_white,
                light_red=light_red,
                light_blue=light_blue,
                datetime=datetime.now(),
            )
            self.session.add(new_config)
            self.session.commit()
            print("✔ Configuración insertada en la base de datos.")
            return {
                "status": "success",
                "message": "Configuración insertada en la base de datos.",
            }, 200
        except Exception as e:
            print(f"Error al insertar configuración: {e}")
            self.session.rollback()
            return {
                "status": "error",
                "message": "Error al insertar configuración en la base de datos.",
            }, 500

    def get_last_wavelength_white(self):
        try:
            # Recuperar todos los valores correspondientes al último datetime
            last_datetime = (
                self.session.query(WaveLength_White.datetime)
                .order_by(WaveLength_White.datetime.desc())
                .first()
            )

            if not last_datetime:
                print("ℹ No se encontraron datos en WaveLength_White.")
                return []

            # Recuperar los valores ordenados por posición
            values = (
                self.session.query(WaveLength_White.value)
                .filter(WaveLength_White.datetime == last_datetime[0])
                .order_by(WaveLength_White.position)
                .all()
            )

            # Extraer los valores de la lista de tuplas
            return [value[0] for value in values]
        except Exception as e:
            print(f"Error al obtener el último valor de WaveLength_White: {e}")
            self.session.rollback()
            return []

    def get_reference_wavelength_white(self):
        try:
            last_datetime = (
                self.session.query(WaveLength_White.datetime)
                .filter(WaveLength_White.is_reference == True)
                .order_by(WaveLength_White.datetime.desc())
                .first()
            )
            # Recuperar los valores de referencia marcados como is_reference = TRUE
            values = (
                self.session.query(WaveLength_White.value)
                .filter(WaveLength_White.datetime == last_datetime[0])
                .order_by(WaveLength_White.position)
                .all()
            )

            # Extraer los valores de la lista de tuplas
            return [value[0] for value in values]
        except Exception as e:
            print(
                f"Error al obtener los valores de referencia de WaveLength_White: {e}"
            )
            self.session.rollback()
            return []


def calculate_nc(wave_length):
    """
    Calcula el número de componentes de una onda.
    """
    return round(
        math.pow(wave_length[WAVELENGTHS.index(541.22)], -2.28) * math.pow(10, 12), 2
    )


def calculate_rgb(wave_length, wave_length_white):
    if wave_length_white == []:
        return None
    closest_index_white = min(
        range(len(WAVELENGTHS)), key=lambda i: abs(WAVELENGTHS[i] - 650)
    )
    closest_index_green = min(
        range(len(WAVELENGTHS)), key=lambda i: abs(WAVELENGTHS[i] - 546)
    )
    closest_index_red = min(
        range(len(WAVELENGTHS)), key=lambda i: abs(WAVELENGTHS[i] - 450)
    )
    print(closest_index_white)
    print(closest_index_green)
    print(closest_index_red)

    wave_length_white_white = wave_length_white[closest_index_white]
    wave_length_white_green = wave_length_white[closest_index_green]
    wave_length_white_red = wave_length_white[closest_index_red]

    print(wave_length_white_white)
    print(wave_length_white_green)
    print(wave_length_white_red)

    print(WAVELENGTHS.index(701.59))
    print(WAVELENGTHS.index(545.88))
    print(WAVELENGTHS.index(435.92))

    wave_length_white = wave_length[closest_index_white]
    wave_length_green = wave_length[closest_index_green]
    wave_length_red = wave_length[closest_index_red]

    red = (255 * wave_length_red) / wave_length_white_red
    green = (255 * wave_length_green) / wave_length_white_green
    white = (255 * wave_length_white) / wave_length_white_white

    return {"r": red, "g": green, "b": white}
