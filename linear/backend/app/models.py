from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

    name = Column(String)
    age = Column(Integer)

    fitness_level = Column(String)
    work_pattern = Column(String)
    goals = Column(Text)


class CheckIn(Base):

    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    mood = Column(Integer)
    energy = Column(Integer)
    stress = Column(Integer)

    hours_worked = Column(Integer)
    screen_time = Column(Integer)
    water_glasses = Column(Integer)
    meals_eaten = Column(Integer)
    setting = Column(String, default="home")

    free_text = Column(Text)
    sentiment = Column(String)
    sentiment_score = Column(Float)
    keywords = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Recommendation(Base):

    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    exercise_type = Column(String)
    duration = Column(Integer)
    reason = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Insight(Base):

    __tablename__ = "insights"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    summary = Column(Text)
    suggestions = Column(Text)
    source = Column(String, default="local")

    created_at = Column(DateTime(timezone=True), server_default=func.now())