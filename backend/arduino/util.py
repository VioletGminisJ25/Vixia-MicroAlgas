import serial.tools.list_ports

from dotenv import load_dotenv
import os
import asyncio
import websockets.socketio_intance
from database.queries import DataQueries
import arduino.monitor_instance

queries = DataQueries()

load_dotenv()


def obtener_puertos_usb(vid, pid):
    puertos = serial.tools.list_ports.comports()
    for puerto in puertos:
        # Extraer VID y PID desde el puerto en formato hexadecimal
        puerto_vid = puerto.vid
        puerto_pid = puerto.pid

        # Comparar VID y PID
        if puerto_vid == int(vid, 16) and puerto_pid == int(pid, 16):
            print(f"Puerto: {puerto.device}, VID: {puerto_vid}, PID: {puerto_pid}")
            return puerto.device  # Devuelve el puerto correspondiente
    return None


from colorama import init, Fore

# Hace que despues de cada cadena vuelva a estar en el color por defecto
init(autoreset=True)


async def async_measurement_config_send(
    monitor,
    manual,
    reboot,
    time=os.getenv("TIME_BETWEEN_MEASURAMENTS"),
    light=os.getenv("TIME_LIGHT"),
    dark=os.getenv("TIME_DARK"),
    white=os.getenv("LIGHT_WHITE"),
    red=os.getenv("LIGHT_RED"),
    blue=os.getenv("LIGHT_BLUE"),
):

    values = [time, light, dark, white, red, blue]
    data, _ = queries.get_config()
    values[0] = data.get("time_between_measurements")
    values[1] = data.get("time_light")
    values[2] = data.get("time_dark")
    values[3] = data.get("light_white")
    values[4] = data.get("light_red")
    values[5] = data.get("light_blue")
    if manual:
        await asyncio.sleep(30)
    await asyncio.sleep(5)

    monitor.send_command("aa")
    print(f"\n{Fore.RED}Enviando: aa\n")
    await asyncio.sleep(22)

    if reboot:
        monitor.send_command("aa")
        print(f"\n{Fore.RED}Enviando: aa\n")
        await asyncio.sleep(22)

    monitor.white_measurement_started = False
    # websockets.socketio_intance.socketio.emit("manual_mode", "False")
    for data in values:
        monitor.send_command(str(data))
        print(f"\n{Fore.RED} Enviando: {data}\n")
        await asyncio.sleep(4)
    websockets.socketio_intance.socketio.emit("manual_mode", "True")


async def reboot_arduino(
    manual,
    data,
):
    websockets.socketio_intance.socketio.emit("onreboot", "True")
    time = data.get("time_between_measurements")
    light = data.get("time_light")
    dark = data.get("time_dark")
    white = data.get("light_white")
    red = data.get("light_red")
    blue = data.get("light_blue")
    arduino.monitor_instance.monitor.send_command("R")
    await asyncio.sleep(0.20)
    arduino.monitor_instance.monitor.send_command("S")
    await asyncio.sleep(1)

    result = queries.insert_config(time, light, dark, white, red, blue)
    await async_measurement_config_send(
        arduino.monitor_instance.monitor,
        manual,
        True,
        time,
        light,
        dark,
        white,
        red,
        blue,
    )

    websockets.socketio_intance.socketio.emit("onreboot", "False")
    return result
