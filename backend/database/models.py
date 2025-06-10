from database.db_instance import db_instance
from sqlalchemy import UniqueConstraint, event


from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Boolean,
    Float,
    SmallInteger,
)

db = db_instance.db


class MainDatetime(db.Model):
    """
    Modelo para la tabla MainDatetime.
    """

    __tablename__ = "main_datetime"
    datetime = Column(DateTime, primary_key=True)
    period_day = Column(String(20), nullable=False)

    # Añadir 'cascade' a las relaciones en el padre para que SQLAlchemy sepa cómo manejar las eliminaciones
    # Aunque la clave foránea en la DB manejará la eliminación, esto ayuda al ORM
    # 'all, delete-orphan' es una opción común y robusta para eliminaciones en cascada.
    # Uselist=False puede no ser adecuado si esperas múltiples relaciones (por ejemplo, muchas WaveLength para un datetime)
    # Recomiendo revisar la uselist=False en WaveLength si es una lista.
    # Para datetime como PK en hijos, uselist=False podría tener sentido si solo hay un registro hijo por datetime,
    # pero para WaveLength que tiene position como parte de su PK compuesta, la relación debería ser a una lista.
    # Vamos a ajustar WaveLength en el hijo.
    rgb_data = db.relationship("Rgb", backref="main_dt", cascade="all, delete-orphan", uselist=False)
    sensor_data_rel = db.relationship("SensorData", backref="main_dt", cascade="all, delete-orphan", uselist=False)
    # Para WaveLength, como hay múltiples posiciones por datetime, la relación debe ser a una colección (lista)
    wave_lengths = db.relationship("WaveLength", backref="main_dt", cascade="all, delete-orphan", lazy=True)


class Rgb(db.Model):
    """
    Modelo para la tabla Rgb.
    """

    __tablename__ = "rgb"
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime", ondelete="CASCADE"), primary_key=True)
    r = Column(Float, nullable=False)
    g = Column(Float, nullable=False)
    b = Column(Float, nullable=False)

    # La relación inversa en el hijo no necesita 'cascade'
    # main_datetime = db.relationship("MainDatetime", backref=db.backref("rgb", uselist=False))
    # Ya está definida en MainDatetime con backref="main_dt" para Rgb.
    # Si quieres mantener el backref aquí, asegúrate que no haya duplicidad o conflicto.
    # Preferiblemente, define solo un backref en el padre.


class Colors(db.Model):
    """
    Modelo para la tabla Colors.
    """

    __tablename__ = "colors"
    id = Column(Integer, primary_key=True, autoincrement=True)
    datetime = Column(DateTime) # Este datetime no tiene FK a MainDatetime, por lo que no se borraría en cascada automáticamente.
                                # Si quieres que Colors también se elimine, su 'datetime' debe ser un FK a MainDatetime con CASCADE.
                                # Si 'datetime' en Colors no es Unique, necesitarías otra forma de relacionarlo para eliminación en cascada.
                                # Por el contexto parece que Colors no está directamente ligado por datetime como PK/FK.

    roja = Column(Boolean, nullable=False)
    blanca = Column(Boolean, nullable=False)
    azul = Column(Boolean, nullable=False)


class SensorData(db.Model):
    """
    Modelo para la tabla SensorData.
    """

    __tablename__ = "sensor_data"
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime", ondelete="CASCADE"), primary_key=True)

    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    nc = Column(Float, nullable=False)

    # main_datetime = db.relationship("MainDatetime", backref=db.backref("sensor_data", uselist=False))
    # Ya está definida en MainDatetime con backref="main_dt" para SensorData.


class WaveLength(db.Model):
    """
    Modelo para la tabla WaveLength.
    """

    __tablename__ = "wave_length"
    # Añadir ondelete="CASCADE" a la clave foránea
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime", ondelete="CASCADE"), primary_key=True)

    position = Column(SmallInteger, nullable=False, primary_key=True)
    value = Column(Float, nullable=False)

    # main_datetime = db.relationship("MainDatetime", backref=db.backref("wave_length", uselist=False))
    # La relación se definió en MainDatetime con backref="main_dt" para WaveLength, y debe ser una lista.
    # Por el PK compuesto, la relación no debería ser uselist=False.


    __table_args__ = (UniqueConstraint("datetime", "position", name="pk_wave_length"),)


class WaveLength_White(db.Model):
    """
    Modelo para la tabla WaveLength_White.
    """

    __tablename__ = "wave_length_white"
    id = Column(Integer, primary_key=True, autoincrement=True)
    datetime = Column(DateTime) # No tiene FK a MainDatetime, no se borraría en cascada.
    position = Column(SmallInteger, nullable=False)
    value = Column(Float, nullable=False)
    is_reference = Column(Boolean, nullable=False)


class Users(db.Model):
    """
    Modelo para la tabla Users.
    """

    __tablename__ = "users"
    name = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    email = Column(String(100), primary_key=True, nullable=False)
    profile_image = Column(String(255), nullable=True, default="default.jpg")

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}')>"


class Config(db.Model):
    """
    Modelo para la tabla Config.
    """

    __tablename__ = "config"
    datetime = Column(DateTime)
    time_between_measurements = Column(Integer, nullable=False)
    time_light = Column(Integer, nullable=False)
    time_dark = Column(Integer, nullable=False)
    light_white = Column(Integer, nullable=False)
    light_red = Column(Integer, nullable=False)
    light_blue = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False, primary_key=True)