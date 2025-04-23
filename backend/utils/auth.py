from dotenv import load_dotenv
from flask import jsonify
from markupsafe import escape
import hashlib
import pandas as pd
import json
import os

load_dotenv()

salt = os.getenv("SALT_KEY")
db_file_path = os.getenv("DB_PATH")
def register_handler(data):
    username = escape(data.get("name"))
    password = escape(data.get("password"))
    email = escape(data.get("email"))
    print(f"Email: {email}\nPassword: {password}\nUsername: {username}")
    if not username or not password or not email:
        return (
            jsonify({"error": "Los campos username y password son obligatorios"}),
            400,
        )
    hashed_password = hash_password(password)
    if write_file(username, hashed_password, email):
        return jsonify({"message": "El usuario ha sido creado correctamente"}), 200
    else:
        return jsonify({"error": "No se pudo crear el usuario"}), 400


def login_handler(data):
    email = escape(data.get("email"))
    password = escape(data.get("password"))
    print(f"Email: {email}\nPassword: {password}")
    if not email or not password:
        return jsonify({"error": "Usuario y contrasenas son requeridos"}), 400
    return read_file(email, password)


def read_file(email, password):
    try:
        bd = pd.read_json(db_file_path).to_dict()
        if email in bd:
            if bd[email]["password"] == hash_password(password):
                return jsonify({"message": "Usuario correcto"}), 200
            else:
                return jsonify({"error": "Contraseña incorrecta"}), 401
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except ValueError as e:
        print(e)
        return jsonify({"error": "Internal Server Error"}), 500

def hash_password(password):
    salted = password + salt
    return hashlib.sha256(salted.encode()).hexdigest()




def write_file(username, password, email):
    print(f"Username: {username}\nPassword: {password}\nEmail: {email}")
    if os.path.exists(db_file_path):
        try:
            with open(db_file_path, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            data = {}
    else:
        data = {}
    if email in data:
        return False
    data[email] = {"user": username, "password": password}

    print(data[email])
    dt = pd.DataFrame.from_dict(data, orient="index")
    dt.index.name = "email"
    # print(dt)
    dt.to_json(db_file_path, indent=4, orient="index")
    return True
