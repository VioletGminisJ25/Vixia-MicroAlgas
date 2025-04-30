from db_instance import db_instance


class AuthQueries:
    """
    Clase que contiene consultas relacionadas con la autenticación de usuarios.
    """

    def __init__(self):
        pass

    def register_user(self, username, hashed_password, email):
        """
        Registra un nuevo usuario en la base de datos.
        """
        query = f"INSERT INTO users (username, password, email) VALUES ('{username}', '{hashed_password}', '{email}')"
