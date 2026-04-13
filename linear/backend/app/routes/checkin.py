from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user
from ..models import CheckIn, User
from ..services.nlp_services import analyze_sentiment
from ..services.recommendation_services import generate_recommendation

router = APIRouter()


# ── Request schema ─────────────────────────────────────────────────────────────

class CheckInBody(BaseModel):
    mood: int
    energy: int
    stress: int
    hoursWorked: int
    setting: str = "home"
    freeText: Optional[str] = None


# ── Helper ─────────────────────────────────────────────────────────────────────

def _checkin_dict(c: CheckIn) -> dict:
    return {
        "id": str(c.id),
        "userId": str(c.user_id),
        "mood": c.mood,
        "energy": c.energy,
        "stress": c.stress,
        "hoursWorked": c.hours_worked,
        "freeText": c.free_text,
        "sentiment": c.sentiment,
        "createdAt": c.created_at.isoformat() if c.created_at else "",
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/checkins")
def create_checkin(
    body: CheckInBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sentiment = analyze_sentiment(body.freeText) if body.freeText else "neutral"

    checkin = CheckIn(
        user_id=current_user.id,
        mood=body.mood,
        energy=body.energy,
        stress=body.stress,
        hours_worked=body.hoursWorked,
        free_text=body.freeText,
        sentiment=sentiment,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    return {"success": True, "data": _checkin_dict(checkin)}


@router.get("/checkins")
def get_checkins(
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(CheckIn).filter(CheckIn.user_id == current_user.id)
    checkins = query.order_by(CheckIn.created_at.desc()).all()
    return {"success": True, "data": [_checkin_dict(c) for c in checkins]}


@router.get("/checkins/{checkin_id}")
def get_checkin(
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    checkin = (
        db.query(CheckIn)
        .filter(CheckIn.id == checkin_id, CheckIn.user_id == current_user.id)
        .first()
    )
    if not checkin:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Check-in not found")
    return {"success": True, "data": _checkin_dict(checkin)}
