"""
Punto de entrada principal para la aplicación Flask.
Este archivo inicializa la aplicación Flask, configura CORS y registra las rutas de autenticación.
"""

from flask import Flask
from routes.auth_routes import auth_routes
from flask_cors import CORS
from database.db_instance import db_instance


app = Flask(__name__)
CORS(app)
db_instance.init_db(app)
app.register_blueprint(auth_routes)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
