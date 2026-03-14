from fastapi import FastAPI

app = FastAPI(title="Linear Wellbeing API")

@app.get("/")
def root():
    return {"message": "Linear API running"}