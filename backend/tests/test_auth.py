# tests/test_auth.py
import pytest
import os
import json
import tempfile  # Para crear archivos temporales
import hashlib  # Para hashear la contraseña del usuario de prueba
import pandas as pd  # Para manejar el JSON como en tu auth.py
from app import create_app
from tests.utils import generate_unique_email

TEST_SALT_KEY = (
    "your_test_salt_key_here"  # <--- ¡CAMBIA ESTO por una sal real para tests!
)
TEST_JWT_SECRET_KEY = "super-secret-jwt-key-for-tests"
# Idealmente, deberías obtenerla de alguna configuración de test.


@pytest.fixture
def client():

    fd, temp_db_path = tempfile.mkstemp(suffix=".json")
    os.close(fd)
    os.environ["SALT_KEY"] = TEST_SALT_KEY
    os.environ["DB_PATH"] = temp_db_path

    def hash_password_for_test(password):
        salted = password + TEST_SALT_KEY
        return hashlib.sha256(salted.encode()).hexdigest()

    test_user_email = "test@example.com"
    test_user_password_raw = "1234"
    test_user_password_hashed = hash_password_for_test(test_user_password_raw)

    initial_db_data = {
        test_user_email: {"user": "testuser", "password": test_user_password_hashed}
    }
    # Escribimos los datos iniciales al archivo JSON temporal
    with open(temp_db_path, "w") as f:
        json.dump(initial_db_data, f, indent=4)

    # Creamos una instancia de tu aplicación real usando la función de fábrica
    app, _ = create_app(
        {
            "TESTING": True,
            "JWT_SECRET_KEY": TEST_JWT_SECRET_KEY,
            "JWT_TOKEN_LOCATION": ["cookies"],
            "JWT_COOKIE_SECURE": False,  # Desactivar HTTPS para tests si no usas un servidor HTTPS
            "JWT_CSRF_ENABLED": True,  # Desactivar CSRF para simplificar tests si no lo estás manejando explícitamente
            "JWT_ACCESS_TOKEN_EXPIRES": False,
        }
    )  # Pasamos la configuración de testing

    with app.test_client() as client:
        with app.app_context():
            yield client

    # Limpieza: Eliminar el archivo temporal después de que el test termine
    os.remove(temp_db_path)
    # Limpiar las variables de entorno para no afectar otros tests o procesos
    del os.environ["SALT_KEY"]
    del os.environ["DB_PATH"]


def test_check_auth_requires_jwt(client):
    response = client.get("/check_auth")
    assert response.status_code == 401
    # CAMBIAR ESTO:
    response_json = response.get_json()
    assert "msg" in response_json
    assert response_json["msg"] == 'Missing cookie "access_token_cookie"'


def test_login_and_check_auth(client):
    login = client.post(
        "/login", json={"email": "javierrodal25@gmail.com", "password": "1234"}
    )
    assert login.status_code == 200
    # CAMBIAR ESTO:
    assert "Usuario correcto" in login.get_data(as_text=True)

    # El 'client' instance automáticamente almacena las cookies de la respuesta de 'login'.
    response = client.get("/check_auth")
    assert response.status_code == 200
    assert "logged_in_as" in response.get_data(as_text=True)
    assert "javierrodal25@gmail.com" in response.get_data(as_text=True)


# Puedes añadir más tests aquí, por ejemplo:
def test_login_invalid_credentials(client):
    response = client.post(
        "/login", json={"email": "javierrodal25@gmail.com", "password": "wrong_password"}
    )
    assert response.status_code == 401
    response_json = response.get_json()  # Obtener el JSON como diccionario
    assert "error" in response_json
    assert (
        response_json["error"] == "Contraseña incorrecta"
    )  # Compara el valor decodificado


def test_login_user_not_found(client):
    response = client.post(
        "/login", json={"email": "nonexistent@example.com", "password": "any_password"}
    )
    print(response.status_code)
    assert response.status_code == 404
    assert "Usuario no encontrado" in response.get_data(as_text=True)


def test_register_new_user(client):
    new_email = generate_unique_email()  # O cualquier otro email único que hayas usado
    new_password = "1234"
    new_username = "Unique New User"

    register_response = client.post(
        "/register",
        json={"name": new_username, "email": new_email, "password": new_password},
    )
    assert register_response.status_code == 200
    assert "El usuario ha sido creado correctamente" in register_response.get_data(
        as_text=True
    )

    # Intenta iniciar sesión con el nuevo usuario para verificar que se guardó correctamente
    login_response = client.post(
        "/login", json={"email": new_email, "password": new_password}
    )
    assert login_response.status_code == 200
    # ¡AJUSTA ESTA LÍNEA!
    assert "Usuario correcto" in login_response.get_data(
        as_text=True
    )  # <-- CAMBIO AQUÍ

    # Y también para la comprobación de autenticación del usuario recién creado
    check_auth_response = client.get("/check_auth")
    assert check_auth_response.status_code == 200
    assert new_email in check_auth_response.get_data(as_text=True)


def test_register_existing_user(client):
    """
    Verifica que no se puede registrar un usuario con un email que ya existe.
    """
    # Usamos el email del usuario pre-cargado en el fixture
    existing_email = "javierrodal25@gmail.com"
    some_password = "any_password"  # La contraseña no importa mucho aquí
    some_username = "Existing User Attempt"

    response = client.post(
        "/register",
        json={
            "name": some_username,
            "email": existing_email,
            "password": some_password,
        },
    )

    # Esperamos un 400 BAD REQUEST, ya que el email ya existe
    assert response.status_code == 400

    # Verificamos el mensaje de error esperado
    response_json = response.get_json()
    assert "error" in response_json
    assert response_json["error"] == "No se pudo crear el usuario"
