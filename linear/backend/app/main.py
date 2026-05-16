import os

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

# CORS — accept a comma-separated list via CORS_ORIGINS env var, or a wildcard
# for local dev. In production, set CORS_ORIGINS to your Vercel deployment URL.
_origins_env = os.environ.get("CORS_ORIGINS", "*").strip()
if _origins_env == "*":
    cors_origins = ["*"]
    allow_credentials = False  # browsers reject "*" with credentials
else:
    cors_origins = [o.strip() for o in _origins_env.split(",") if o.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
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


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
