from fastapi import FastAPI
from .database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Linear Wellbeing API")

@app.get("/")
def root():
    return {"message": "Linear API running"}