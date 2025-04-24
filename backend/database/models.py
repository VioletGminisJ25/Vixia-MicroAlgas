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
    datetime = Column(DateTime, ForeignKey("main_datetime.datetime"), primary_key=True)

    red = Column(Boolean, nullable=False)
    white = Column(Boolean, nullable=False)
    blue = Column(Boolean, nullable=False)

    main_datetime = db.relationship(
        "MainDatetime", backref=db.backref("colors", uselist=False)
    )


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
