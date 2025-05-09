import serial
import threading
import time
from datetime import datetime
import os
import pandas as pd
import serial.tools.list_ports
import serial
from arduino.util import obtener_puertos_usb, measurement_config_send
from dotenv import load_dotenv
import asyncio
from database.queries import DataQueries

load_dotenv()


# Valores de longitud de onda proporcionados
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


class SerialMonitor:
    def __init__(self, baud_rate, app, socketio):
        self.baud_rate = baud_rate
        self.serial_port = None
        self.running = False
        self.monitor_thread = None
        self.buffer = ""
        self.save_dir = None
        self.is_first_measurement = True
        self.measurement_count = 0
        self.current_batch = []
        self.manual_batch = []
        self.waiting_for_manual = False
        self.manual_name = None
        self.port = obtener_puertos_usb(os.getenv("VID"), os.getenv("PID"))
        self.timeout = int(os.getenv("TIMEOUT"))
        self.app = app
        self.socketio = socketio
        self.automatic_mode = False
        self.in_manual_mode = False
        self.active = True
        self.white_measurement_started = False

    def start(self):
        try:
            self.serial_port = serial.Serial(
                self.port, self.baud_rate, timeout=self.timeout
            )
            print(self.serial_port)
            print(f"Puerto {self.port} abierto.")
            self.running = True

            self.monitor_thread = threading.Thread(
                target=self.monitor_serial, daemon=True
            )
            self.monitor_thread.start()
        except serial.SerialException as e:
            print(f"Error al abrir el puerto {self.port}: {e}")
        asyncio.run(measurement_config_send(self, manual=False))

    def stop(self):
        self.running = False
        if self.monitor_thread:
            self.monitor_thread.join()
        if self.serial_port and self.serial_port.is_open:
            self.serial_port.close()
            print("Puerto cerrado.")

    def monitor_serial(self):
        with self.app.app_context():
            self.queries = DataQueries()
            while self.running:
                if self.serial_port.in_waiting > 0:
                    data = self.serial_port.read(self.serial_port.in_waiting).decode(
                        "utf-8", errors="ignore"
                    )
                    print(data, end="")

                    self.buffer += data
                    self.lights_handler()
                    self.process_buffer()

                time.sleep(0.01)

    def lights_handler(self):
        buffer2 = self.buffer
        while "\n" in buffer2:  # Procesar cualquier línea completa en el buffer
            try:
                # Buscar el final de línea
                end_of_line = buffer2.find("\n")
                if end_of_line != -1:  # Si hay un mensaje completo
                    # Extraer el mensaje completo hasta el final de línea
                    line = buffer2[:end_of_line].strip().lower()
                    # Eliminar el mensaje procesado del buffer
                    buffer2 = buffer2[end_of_line + 1 :]

                    lights_state = {"roja": 0, "azul": 0, "blanca": 0}

                    # Procesar el mensaje
                    if (
                        line
                        == "antes de empezar el programa es necesario medir el blanco..."
                    ):
                        self.white_measurement_started = True
                        self.buffer = ""
                    elif line == "luces apagadas (oscuridad)":
                        # Guardar inmediatamente el estado de luces apagadas
                        self.queries.insert_lights_state_sync(lights_state)
                        self.socketio.emit("lights_state", lights_state)
                        self.buffer = ""
                    elif "luz" in line and "encendida" in line:
                        parts = line.split(" ")
                        if (
                            len(parts) == 3
                            and parts[0] == "luz"
                            and parts[2] == "encendida"
                        ):
                            color = parts[1]
                            if color in lights_state:
                                lights_state[color] = 1
                                self.queries.insert_lights_state_sync(lights_state)
                                self.socketio.emit("lights_state", lights_state)
                                self.buffer = ""
                            else:
                                print(f"Color de luz desconocido: {color}")
                else:
                    break  # Salir del bucle si no hay un mensaje completo
            except Exception as e:
                print(f"Error al procesar el mensaje de luces: {e}")

    def process_buffer(self):

        # print(f"\nBuffer actual: {self.buffer}\n")  # Depuración

        start_idx = self.buffer.find("h")
        end_idx = self.buffer.find("a", start_idx)
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            if not self.automatic_mode:
                self.socketio.emit("manual_mode", "False")
            self.automatic_mode = True
        while True:
            start_idx = self.buffer.find("h")
            end_idx = self.buffer.find("a", start_idx)
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                message = self.buffer[start_idx : end_idx + 1]
                self.buffer = self.buffer[end_idx + 1 :]
                self.handle_arduino_message(message)
            else:
                break

    def handle_arduino_message(self, message):
        datos = message.split(",")
        if len(datos) < 4 or datos[0] != "h" or datos[-1] != "a":
            print("Formato de datos inválido.")
            # self.in_automatic_measurement = False
            # self.socketio.emit("manual_mode", "True")
            return

        try:
            espectrometro = [float(x) for x in datos[1:-3] if x.strip()]
            temperatura = float(datos[-3])
            ph = float(datos[-2])
        except ValueError as e:
            print(f"Error al convertir datos a números: {e}")
            return

        if self.waiting_for_manual:
            self.manual_batch.append((espectrometro, temperatura, ph))
            print(f"Medición manual {len(self.manual_batch)}/10 recibida.")
            if len(self.manual_batch) == 10:
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.save_manual_batch(timestamp)
                self.manual_batch = []
                self.waiting_for_manual = False
                self.manual_name = None
        else:
            self.measurement_count += 1
            self.current_batch.append((espectrometro, temperatura, ph))
            print(
                f"Medición automática {self.measurement_count % 10 if self.measurement_count % 10 != 0 else 10}/10 recibida."
            )
            if self.measurement_count % 10 == 0:
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                tipo = (
                    "CALIBRACION DEL BLANCO"
                    if self.is_first_measurement
                    else "MEDICION"
                )
                self.save_batch(timestamp, tipo)
                self.current_batch = []
                if self.is_first_measurement:
                    self.is_first_measurement = False
                    print("Calibración del blanco completada.")

    def save_batch(self, timestamp, tipo):
        # Crear DataFrame para el espectrómetro
        espectro_data = []
        for espectrometro, _, _ in self.current_batch:
            espectro_data.append(espectrometro)
        espectro_df = pd.DataFrame(espectro_data)
        espectro_avg = espectro_df.mean(axis=0).values
        print(espectro_avg)

        # Crear DataFrame para la temperatura
        temp_data = [temp for _, temp, _ in self.current_batch]
        temp_df = pd.DataFrame(temp_data, columns=["Temperatura"])
        temp_avg = temp_df.mean().values[0]
        print(temp_avg)

        # Crear DataFrame para el pH
        ph_data = [ph for _, _, ph in self.current_batch]
        ph_df = pd.DataFrame(ph_data, columns=["pH"])
        ph_avg = ph_df.mean().values[0]
        print(ph_avg)

        datetime_med = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data = {
            "datetime": datetime_med,
            "value": espectro_avg,
            "temperature": temp_avg,
            "ph": ph_avg,
        }

        if self.active:
            self.socketio.emit(
                "arduino_data",
                {
                    "colors": None,
                    "rgb": None,
                    "data": {"ph": float(ph_avg), "temperature": float(temp_avg)},
                    "wave_length": espectro_avg.tolist(),
                },
            )
        self.queries.insert_data(data, self.is_first_measurement)
        print("Datos guardados en la base de datos.")
        self.automatic_mode = False
        if not self.white_measurement_started:
            self.socketio.emit("manual_mode", "True")

        # Guardar en archivos Excel
        # espectro_file = os.path.join(self.save_dir, "valores_espectro.xlsx")
        # temp_file = os.path.join(self.save_dir, "valores_temperatura.xlsx")
        # ph_file = os.path.join(self.save_dir, "valores_ph.xlsx")

        # Función para agregar datos sin sobrescribir y preservar comentarios

    def save_manual_batch(self, timestamp):
        print("✔ Manual measurement success")
        self.active = False
        self.socketio.emit("wake_up_state", self.active)

        # Crear DataFrame para el espectrómetro
        espectro_data = []
        for espectrometro, _, _ in self.manual_batch:
            espectro_data.append(espectrometro)
        espectro_df = pd.DataFrame(espectro_data)
        espectro_avg = espectro_df.mean(axis=0).values

        # Crear DataFrame para la temperatura
        temp_data = [temp for _, temp, _ in self.manual_batch]
        temp_df = pd.DataFrame(temp_data, columns=["Temperatura"])
        temp_avg = temp_df.mean().values[0]

        # Crear DataFrame para el pH
        ph_data = [ph for _, _, ph in self.manual_batch]
        ph_df = pd.DataFrame(ph_data, columns=["pH"])
        ph_avg = ph_df.mean().values[0]

        datetime_med = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data = {
            "datetime": datetime_med,
            "value": espectro_avg,
            "temperature": temp_avg,
            "ph": ph_avg,
        }

        if self.automatic_mode:
            self.socketio.emit(
                "arduino_data",
                {
                    "colors": None,
                    "rgb": None,
                    "data": {"ph": float(ph_avg), "temperature": float(temp_avg)},
                    "wave_length": espectro_avg.tolist(),
                },
            )
        self.queries.insert_data(data, self.is_first_measurement)
        print("Datos guardados en la base de datos.")

        # Guardar en base de datos

    def send_command(self, command):
        if self.serial_port and self.serial_port.is_open:
            if command.strip().upper() == "M":
                self.waiting_for_manual = True
                self.manual_batch = []
                # self.manual_name = input(
                #     "Introduce un nombre para esta muestra manual: "
                # ).strip()
                print(f"Enviando 'M' al Arduino")
                self.serial_port.write("M\n".encode("utf-8"))
            else:
                self.serial_port.write(f"{command}\n".encode("utf-8"))

    def get_latest_measurements(self):
        """Return the latest batch of measurements for the dashboard."""
        return {
            "current_batch": self.current_batch,
            "manual_batch": self.manual_batch,
            "measurement_count": self.measurement_count,
            "is_first_measurement": self.is_first_measurement,
        }


# def main():


#     try:
#         print(" Escribe comandos para enviar al Arduino (Ctrl+C para salir):")
#         while True:
#             comando = input()
#             monitor.send_command(comando)
#     except KeyboardInterrupt:
#         print("\nInterrupción por usuario.")
#     finally:
#         monitor.stop()
