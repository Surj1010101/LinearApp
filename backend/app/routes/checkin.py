from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import CheckIn

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/checkin")

def create_checkin(
    user_id: int,
    mood: int,
    energy: int,
    stress: int,
    hours_worked: int,
    free_text: str,
    db: Session = Depends(get_db)
):

    checkin = CheckIn(
        user_id=user_id,
        mood=mood,
        energy=energy,
        stress=stress,
        hours_worked=hours_worked,
        free_text=free_text
    )

    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    return checkin