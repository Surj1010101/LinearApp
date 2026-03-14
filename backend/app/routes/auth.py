from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import User
from ..utils.security import hash_password, verify_password, create_token

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")

def register(email: str, password: str, db: Session = Depends(get_db)):

    user = User(
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)

    return {"token": token}


@router.post("/login")

def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(password, user.password_hash):
        return {"error": "Invalid credentials"}

    token = create_token(user.id)

    return {"token": token}