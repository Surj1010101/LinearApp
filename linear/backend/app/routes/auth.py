from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user
from ..models import User
from ..utils.security import hash_password, verify_password, create_token

router = APIRouter()


# ── Request schemas ────────────────────────────────────────────────────────────

class RegisterBody(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginBody(BaseModel):
    email: EmailStr
    password: str


# ── Helpers ────────────────────────────────────────────────────────────────────

def _user_dict(user: User) -> dict:
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name or "",
        "age": user.age,
        "fitnessLevel": user.fitness_level,
        "workPattern": user.work_pattern,
        "goals": user.goals.split(",") if user.goals else [],
        "createdAt": "",
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/register")
def register(body: RegisterBody, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=body.email,
        name=body.name,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return {"success": True, "data": {"user": _user_dict(user), "token": token}}


@router.post("/login")
def login(body: LoginBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_token(user.id)
    return {"success": True, "data": {"user": _user_dict(user), "token": token}}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"success": True, "data": _user_dict(current_user)}
