import os
import bcrypt
from jose import jwt
from pathlib import Path
from datetime import datetime, timedelta

try:
    from dotenv import load_dotenv

    # Load linear/backend/.env explicitly so it works regardless of CWD.
    _ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
    if _ENV_PATH.exists():
        load_dotenv(_ENV_PATH)
    else:
        load_dotenv()  # best-effort fall back to default search
except Exception:  # pragma: no cover
    pass

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY environment variable is not set. "
        "Add it to linear/backend/.env (see .env.example)."
    )
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> int:
    """Decode a JWT and return the user_id, or raise JWTError on failure."""
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return int(payload["user_id"])
