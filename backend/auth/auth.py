"""
Este módulo gestiona la autenticación de usuarios. Proporciona funciones para registrar e iniciar sesión de usuarios, así como para hash de contraseñas y lectura/escritura de datos de usuario a un archivo JSON.
Las contraseñas se hash utilizan SHA-256 con una sal para mayor seguridad.
"""

from dotenv import load_dotenv
from flask import jsonify, session
from markupsafe import escape
import hashlib
import pandas as pd
import json
import os
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    JWTManager,
    set_access_cookies,
)


load_dotenv()

salt = os.getenv("SALT_KEY")
db_file_path = os.getenv("DB_PATH")


def register_handler(data):
    """
    Gestiona el registro de usuarios. Comprueba si se proporcionan el nombre de usuario, la contraseña y el correo electrónico,
    aplica el hash a la contraseña y escribe los datos del usuario en un archivo JSON.
    """
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
    """
    Maneja el inicio de sesión del usuario. Comprueba si el correo electrónico y la contraseña se proporcionan,
    hash de la contraseña, y comprueba si el usuario existe en el archivo JSON.
    """
    email = escape(data.get("email"))
    password = escape(data.get("password"))
    print(f"Email: {email}\nPassword: {password}")
    access_token = create_access_token(identity=email)
    response = ""
    if not email or not password:
        return jsonify({"error": "Usuario y contrasenas son requeridos"}), 400
    message, status = read_file(email, password)
    if status == 200:
        response = jsonify({"message": message})
        set_access_cookies(response, access_token)
        return response, status
    else:
        return jsonify({"error": message}), status


def read_file(email, password):
    """
    Lee los datos del usuario del archivo JSON y comprueba si el correo electrónico existe.
    """
    try:
        bd = pd.read_json(db_file_path).to_dict()
        if email in bd:
            if bd[email]["password"] == hash_password(password):
                return "Usuario correcto", 200
            else:
                return "Contraseña incorrecta", 401
        else:
            return "Usuario no encontrado", 404
    except ValueError as e:
        print(e)
        return "Internal Server Error", 500


def hash_password(password):
    """
    Encripta la contraseña usando SHA-256 con una sal.
    """
    salted = password + salt
    return hashlib.sha256(salted.encode()).hexdigest()


def write_file(username, password, email):
    """
    Escribe los datos del usuario en el archivo JSON. Si el correo electrónico ya existe, devuelve False.
    """
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
