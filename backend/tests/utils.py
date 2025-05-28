# Puedes añadir esta función al principio de tests/test_auth.py
import time
import random
import string

def generate_unique_email(prefix="test_user"):
    """Genera un email único usando un timestamp y una cadena aleatoria."""
    timestamp = int(time.time() * 1000)  # Timestamp en milisegundos
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{prefix}_{timestamp}_{random_suffix}@example.com"