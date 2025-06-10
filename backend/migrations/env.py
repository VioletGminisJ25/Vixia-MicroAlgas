from __future__ import with_statement
from alembic import context
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig
import logging

# --- NUEVAS LÍNEAS PARA CARGAR VARIABLES DE ENTORNO ---
import os
from dotenv import load_dotenv
load_dotenv() # Carga las variables de entorno desde el archivo .env en el directorio raíz del proyecto
# ----------------------------------------------------

# Importa tu instancia de base de datos para acceder a los metadatos de los modelos
# Asegúrate de que la ruta 'database.db_instance' sea correcta
# y que tus modelos están definidos usando 'db_instance.db.Model'
from database.db_instance import db_instance 

# Este es el objeto Alembic Config, que proporciona acceso a los valores
# dentro del archivo .ini en este directorio.
config = context.config

# Interpreta el archivo de configuración para el registro de Python.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# Establece el objeto MetaData de tus modelos para el soporte de 'autogenerate'.
# Alembic usa esto para comparar el estado de tus modelos con el esquema de la base de datos.
target_metadata = db_instance.db.metadata

# --- FUNCIÓN PARA CONSTRUIR LA URL DE LA BASE DE DATOS DESDE LAS VARIABLES DE ENTORNO ---
def get_db_url_from_env():
    """Construye la URI de la base de datos SQLAlchemy a partir de las variables de entorno.
    Esta función NO depende de un contexto de aplicación Flask activo.
    """
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_host = os.getenv('DB_HOST')
    db_name = os.getenv('DB_NAME')
    # Asegúrate de que el driver 'mysql+mysqlconnector' es el correcto para tu base de datos
    # Si usas otro motor (ej. PostgreSQL, SQLite), ajusta el prefijo.
    return f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}"

# --- ESTABLECER LA URL PRINCIPAL DE SQLAlchemy EN LA CONFIGURACIÓN DE ALEMBIC ---
# Esta línea es CRUCIAL. Se ejecuta cuando env.py es cargado por Alembic.
# Aquí le decimos a Alembic cuál es la cadena de conexión a la base de datos.
config.set_main_option('sqlalchemy.url', get_db_url_from_env())

# -------------------------------------------------------------------------------
# NOTA: Se han ELIMINADO las funciones get_engine() y las get_engine_url() duplicadas
# para evitar conflictos y asegurar que Alembic obtenga la URL de forma consistente
# y sin depender del estado completo de Flask-SQLAlchemy en este punto.
# -------------------------------------------------------------------------------


def run_migrations_offline():
    """Ejecuta migraciones en modo 'offline'.
    En este modo, el contexto se configura solo con una URL y no con un Engine,
    lo que evita la necesidad de una conexión real a la base de datos.
    """
    url = config.get_main_option("sqlalchemy.url") # Obtiene la URL que establecimos arriba
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Ejecuta migraciones en modo 'online'.
    En este escenario, necesitamos crear un Engine y asociar una conexión con el contexto.
    """
    # Obtiene la configuración del motor de SQLAlchemy a partir de la configuración de Alembic.
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    # Establece una conexión con la base de datos y configura el contexto de migración.
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # 'render_as_batch=True' es útil para bases de datos como SQLite o MySQL
            # para operaciones ALTER TABLE que requieren un enfoque de "copiar y reemplazar".
            render_as_batch=True 
        )

        try:
            with context.begin_transaction():
                context.run_migrations()
        except Exception as e:
            logger.error("Error durante la migración:", exc_info=True)
            raise e


# Determina si ejecutar las migraciones en modo offline u online.
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()