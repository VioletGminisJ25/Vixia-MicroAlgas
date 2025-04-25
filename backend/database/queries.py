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
from utils.lib import data_handler


class DataQueries:
    def __init__(self):
        self.session = db_instance.db.session

    def get_sensor_data(self):
        """
        Obtiene todos los datos de la tabla SensorData.
        """
        print(self.session.query(SensorData).all())
        return self.session.query(SensorData).all()

    def insertar_datos_ficticios(self):
        # Fecha de inicio y fin
        inicio = datetime(2025, 1, 1)
        hoy = datetime.now()
        dias_totales = (hoy - inicio).days + 1  # Incluir hoy

        # Obtener la sesión de la base de datos
        session = db_instance.db.session

        for dia in range(dias_totales):
            fecha = inicio + timedelta(days=dia)
            base_time = fecha.replace(hour=0, minute=0, second=0)

            for i in range(20):  # Generar 20 registros por día
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

    def get_sensor_by_date(self, date, hour):
        """
        Obtiene los datos de los sensores por fecha.
        """
        query = self.session.query(SensorData).filter(
            db_instance.db.func.date(SensorData.datetime) == date,
            db_instance.db.func.time_format(SensorData.datetime, "%H:%i:%s") == hour,
        )
        return [
            {"ph": item.ph, "temperature": item.temperature} for item in query.all()
        ]

    def get_rgb_by_date(self, date, hour):
        """
        Obtiene los datos de los sensores por fecha.
        """
        query = self.session.query(Rgb).filter(
            db_instance.db.func.date(Rgb.datetime) == date,
            db_instance.db.func.time_format(Rgb.datetime, "%H:%i:%s") == hour,
        )

        return [{"r": item.r, "g": item.g, "b": item.b} for item in query.all()]

    def get_colors_by_date(self, date, hour):
        """
        Obtiene los datos de los sensores por fecha.
        """
        query = self.session.query(Colors).filter(
            db_instance.db.func.date(Colors.datetime) == date,
            db_instance.db.func.time_format(Colors.datetime, "%H:%i:%s") == hour,
        )

        return [
            {"red": item.red, "white": item.white, "blue": item.blue}
            for item in query.all()
        ]

    def get_wavelength_by_date(self, date, hour):
        """
        Obtiene los datos de la longitud de onda por fecha.
        """
        query = self.session.query(WaveLength.value).filter(
            db_instance.db.func.date(WaveLength.datetime) == date,
            db_instance.db.func.time_format(WaveLength.datetime, "%H:%i:%s") == hour,
        )

        return [item[0] for item in query.order_by(WaveLength.position).all()]

    def get_comparation(self, data):
        """
        Obtiene los datos de los sensores de una fecha determinada y los compara con los datos actuales.
        """
        try:
            fecha_raw = data.get("date")
            if len(fecha_raw) == 19:
                fecha_dt = datetime.strptime(fecha_raw, "%Y-%m-%d %H:%M:%S")
                fecha = fecha_dt.date()
                hora = fecha_dt.time()
            else:
                raise ValueError("Formato de fecha no valido")
        except ValueError:
            return jsonify({"error": "Formato de fecha no valido"}), 400

        selected_data = {
            "data": self.get_sensor_by_date(fecha, hora)[0],
            "rgb": self.get_rgb_by_date(fecha, hora)[0],
            "colors": self.get_colors_by_date(fecha, hora)[0],
            "wave_length": self.get_wavelength_by_date(fecha, hora),
        }
        last_data = data_handler()

        return jsonify({"last_data": last_data, "selected_data": selected_data}), 200
