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
from backend.utils.datos_fic_db import generar_dato


class DataQueries:
    def __init__(self):
        self.session = db_instance.db.session

    def get_sensor_data(self):
        """
        Obtiene todos los datos de la tabla SensorData.
        """
        print(self.session.query(SensorData).all())
        return self.session.query(SensorData).all()

    def insertar_datos(self):
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
