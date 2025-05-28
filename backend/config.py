from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """
    Clase de configuración para la aplicación Flask.
    """

    COMPRESS_ALGORITHM = "gzip"
    COMPRESS_LEVEL = 6
    COMPRESS_MIN_SIZE = 200
    SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "vixiasystem"
    JWT_SECRET_KEY = "vixiasystem"
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_TOKEN_EXPIRES = False
    SESSION_COOKIE_SAMESITE = "None"
