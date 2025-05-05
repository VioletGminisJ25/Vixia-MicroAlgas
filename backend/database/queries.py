from collections import defaultdict
from flask import jsonify
from database.models import (
    MainDatetime,
    Rgb,
    Colors,
    SensorData,
    WaveLength,
)
from database.db_instance import db_instance

import random
from datetime import datetime, timedelta
from utils.datos_fic_db import generar_dato
from utils.lib import data_handler, get_periodo_dia
from sqlalchemy import extract
from database.executor_instance import executor_instance


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

        selected_data = {}
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
                    Colors.red,
                    Colors.white,
                    Colors.blue,
                )
                .select_from(SensorData)
                .outerjoin(Rgb, SensorData.datetime == Rgb.datetime)
                .outerjoin(Colors, SensorData.datetime == Colors.datetime)
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
            selected_data["rgb"] = {
                "r": main_result.r,
                "g": main_result.g,
                "b": main_result.b,
            }
            selected_data["colors"] = {
                "red": main_result.red,
                "white": main_result.white,
                "blue": main_result.blue,
            }

            # --- Consulta Optimizada para WaveLength (Query 2) ---
            wavelength_results = (
                self.session.query(WaveLength.value)
                .filter(WaveLength.datetime == fecha_dt)
                .order_by(WaveLength.position)
                .all()
            )

            # Extraer solo los valores de la lista de tuplas [(valor,), (valor,), ...]
            selected_data["wave_length"] = [item[0] for item in wavelength_results]

            # --- Obtener Últimos Datos ---
            # Asumiendo que data_handler() es razonablemente rápido. Si no, también necesita optimización.
            last_data = data_handler()

            # --- Devolver Respuesta ---
            return (
                jsonify({"last_data": last_data, "selected_data": selected_data}),
                200,
            )

        except Exception as e:
            # Captura errores inesperados durante la consulta o procesamiento
            self.session.rollback()  # Revertir la transacción si algo falla
            print(f"Error during database query or processing: {e}")  # Loguear el error
            return (
                jsonify(
                    {"error": "Error interno del servidor al procesar la solicitud"}
                ),
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

        for year, datetime, avg in results:
            output[year]["values"].append(
                {"day": str(datetime).split(" ")[0], "value": round(avg, 2)}
            )

        formatted_output = []
        for year, data in output.items():
            formatted_output.append({"year": year, "values": data["values"]})

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

    def insert_data(self, data):
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
                ph=data["ph"],
                temperature=data["temperature"],
            )

            # Agregar la nueva instancia a la sesión

            self.session.add(new_data_main)
            self.session.add(new_data_sensor)
            for position, value in enumerate(data["value"]):
                new_data_wave = WaveLength(
                    datetime=data["datetime"],
                    position=position,
                    value=value,
                )
                # Agregar la nueva instancia a la sesión
                self.session.add(new_data_wave)
            # Confirmar los cambios en la base de datos
            self.session.commit()
            print("✔ Datos insertados en la base de datos.")
        except Exception as e:
            print(f"Error al insertar datos: {e}")
            self.session.rollback()
