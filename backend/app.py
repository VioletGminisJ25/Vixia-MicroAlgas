from flask import Flask
from routes.auth_routes import auth_routes
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_routes)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
