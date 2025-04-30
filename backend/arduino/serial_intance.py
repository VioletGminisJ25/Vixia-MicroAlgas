from arduino.SerialMonitor import SerialMonitor
import os

monitor = SerialMonitor(os.getenv("BAUD_RATE"))
