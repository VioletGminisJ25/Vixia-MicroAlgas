from database.db_instance import db_instance
from sqlalchemy import UniqueConstraint


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


class Rgb(db.Model):
    """
    Modelo para la tabla Rgb.
    """

    __tablename__ = "rgb"
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime"), primary_key=True)
    r = Column(Float, nullable=False)
    g = Column(Float, nullable=False)
    b = Column(Float, nullable=False)

    main_datetime = db.relationship(
        "MainDatetime", backref=db.backref("rgb", uselist=False)
    )


class Colors(db.Model):
    """
    Modelo para la tabla Colors.
    """

    __tablename__ = "colors"
    id = Column(Integer, primary_key=True, autoincrement=True)
    datetime = Column(DateTime)

    roja = Column(Boolean, nullable=False)
    blanca = Column(Boolean, nullable=False)
    azul = Column(Boolean, nullable=False)


class SensorData(db.Model):
    """
    Modelo para la tabla SensorData.
    """

    __tablename__ = "sensor_data"
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime"), primary_key=True)

    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)

    main_datetime = db.relationship(
        "MainDatetime", backref=db.backref("sensor_data", uselist=False)
    )


class WaveLength(db.Model):
    """
    Modelo para la tabla WaveLength.
    """

    __tablename__ = "wave_length"
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime"), primary_key=True)

    position = Column(SmallInteger, nullable=False, primary_key=True)
    value = Column(Float, nullable=False)

    main_datetime = db.relationship(
        "MainDatetime", backref=db.backref("wave_length", uselist=False)
    )
    __table_args__ = (UniqueConstraint("datetime", "position", name="pk_wave_length"),)


class WaveLength_White(db.Model):
    """
    Modelo para la tabla WaveLength_White.
    """

    __tablename__ = "wave_length_white"
    id = Column(Integer, primary_key=True, autoincrement=True)
    datetime = Column(DateTime)
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
    datetime = Column(DateTime, primary_key=True)
    time_between_measurements = Column(Integer, nullable=False)
    time_light = Column(Integer, nullable=False)
    time_dark = Column(Integer, nullable=False)
    light_white = Column(Integer, nullable=False)
    light_red = Column(Integer, nullable=False)
    light_blue = Column(Integer, nullable=False)
