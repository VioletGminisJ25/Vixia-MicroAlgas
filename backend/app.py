"""
Punto de entrada principal para la aplicación Flask.
Este archivo inicializa la aplicación Flask, configura CORS y registra las rutas de autenticación.
"""

from flask import Flask
from routes.auth_routes import auth_routes
from flask_cors import CORS
from database.db_instance import db_instance
from database.executor_instance import init_executor
from flask_compress import Compress


app = Flask(__name__)
CORS(app)
compress = (
    Compress()
)  # Inicializa la compresión de respuestas para comprimir json y html
compress.init_app(app)
app.config["COMPRESS_ALGORITHM"] = "gzip"
app.config["COMPRESS_LEVEL"] = 6
app.config["COMPRESS_MIN_SIZE"] = 200
db_instance.init_db(app)
init_executor(app, executor_type="thread", max_workers=4)
app.register_blueprint(auth_routes)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
