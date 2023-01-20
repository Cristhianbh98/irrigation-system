import serial
import requests

ser = serial.Serial('/dev/cu.usbmodem1201', 9600)  # especificar el puerto serie y velocidad
while True:
    line = ser.readline().decode("utf-8").strip()  # leer datos del puerto serie
    if line:
        payload = {"data": line}  # crear payload con los datos del json
        headers = {"Content-Type": "application/json"}  # headers para la peticion
        response = requests.post("https://whastapp-bot-reinhard.onrender.com/store", json=payload, headers=headers)  # realizar peticion POST
        print(response.status_code, response.reason)  # imprimir respuesta
