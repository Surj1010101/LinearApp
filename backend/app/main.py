from fastapi import FastAPI
from .database import Base, engine
from .routes import auth


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Linear Wellbeing API")
app.include_router(auth.router, prefix="/api/auth")

@app.get("/")
def root():
    return {"message": "Linear API running"}