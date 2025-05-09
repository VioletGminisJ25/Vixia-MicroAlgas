import serial.tools.list_ports

from dotenv import load_dotenv
import os
import asyncio
import websockets.socketio_intance

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


async def measurement_config_send(
    monitor,
    manual,
    time=os.getenv("TIME_BETWEEN_MEASURAMENTS"),
    light=os.getenv("TIME_LIGHT"),
    dark=os.getenv("TIME_DARK"),
    white=os.getenv("LIGHT_WHITE"),
    red=os.getenv("LIGHT_RED"),
    blue=os.getenv("LIGHT_BLUE"),
):
    values = [time, light, dark, white, red, blue]
    if manual:
        await asyncio.sleep(30)
    await asyncio.sleep(5)

    monitor.send_command("aa")
    print(f"\n{Fore.RED}Enviando: aa\n")

    await asyncio.sleep(22)
    monitor.white_measurement_started = False
    # websockets.socketio_intance.socketio.emit("manual_mode", "False")
    for data in values:
        monitor.send_command(data)
        print(f"\n{Fore.RED} Enviando: {data}\n")
        await asyncio.sleep(1)
    websockets.socketio_intance.socketio.emit("manual_mode", "True")
