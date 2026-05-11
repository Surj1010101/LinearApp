from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from .database import Base, engine
from .routes import auth, checkin, dashboard, insights, recommendations, users

Base.metadata.create_all(bind=engine)


def _add_missing_columns(table: str, additions: dict[str, str]):
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return
    existing = {col["name"] for col in inspector.get_columns(table)}
    with engine.begin() as conn:
        for name, ddl in additions.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))


_add_missing_columns("checkins", {
    "setting": "VARCHAR DEFAULT 'home'",
    "sentiment_score": "FLOAT",
    "keywords": "TEXT",
    "screen_time": "INTEGER",
    "water_glasses": "INTEGER",
    "meals_eaten": "INTEGER",
})
_add_missing_columns("insights", {
    "source": "VARCHAR DEFAULT 'local'",
})

app = FastAPI(title="Linear Wellbeing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth")
app.include_router(checkin.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Linear API running"}
