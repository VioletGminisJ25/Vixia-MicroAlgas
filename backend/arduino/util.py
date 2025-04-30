import serial.tools.list_ports

from dotenv import load_dotenv
import os
import asyncio

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


async def measurement_config_send(
    monitor,
    time=os.getenv("TIME_BETWEEN_MEASURAMENTS"),
    light=os.getenv("TIME_LIGHT"),
    dark=os.getenv("TIME_DARK"),
    white=os.getenv("LIGHT_WHITE"),
    red=os.getenv("LIGHT_RED"),
    blue=os.getenv("LIGHT_BLUE"),
):
    values = [time, light, dark, white, red, blue]
    monitor.send_command(" ")

    await asyncio.sleep(8)
    for data in values:
        monitor.send_command(data)
        print(f"Enviando: {data}")
        await asyncio.sleep(1)
