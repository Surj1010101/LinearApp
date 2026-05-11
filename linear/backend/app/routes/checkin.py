from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user
from ..models import CheckIn, User
from ..services.nlp_services import analyze_sentiment_full, extract_keywords

router = APIRouter()


# ── Request schema ─────────────────────────────────────────────────────────────

class CheckInBody(BaseModel):
    mood: int
    energy: int
    stress: int
    hoursWorked: int
    screenTime: Optional[int] = None
    waterGlasses: Optional[int] = None
    mealsEaten: Optional[int] = None
    setting: str = "home"
    freeText: Optional[str] = None


# ── Helper ─────────────────────────────────────────────────────────────────────

def _checkin_dict(c: CheckIn) -> dict:
    keywords = [k for k in (c.keywords or "").split(",") if k]
    return {
        "id": str(c.id),
        "userId": str(c.user_id),
        "mood": c.mood,
        "energy": c.energy,
        "stress": c.stress,
        "hoursWorked": c.hours_worked,
        "screenTime": c.screen_time,
        "waterGlasses": c.water_glasses,
        "mealsEaten": c.meals_eaten,
        "setting": c.setting or "home",
        "freeText": c.free_text,
        "sentiment": c.sentiment,
        "sentimentScore": c.sentiment_score if c.sentiment_score is not None else 0,
        "keywords": keywords,
        "createdAt": c.created_at.isoformat() if c.created_at else "",
    }


def _parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/checkins")
def create_checkin(
    body: CheckInBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.freeText:
        sentiment, score = analyze_sentiment_full(body.freeText)
        keywords = extract_keywords(body.freeText)
    else:
        sentiment, score, keywords = "neutral", 0.0, []

    checkin = CheckIn(
        user_id=current_user.id,
        mood=body.mood,
        energy=body.energy,
        stress=body.stress,
        hours_worked=body.hoursWorked,
        screen_time=body.screenTime,
        water_glasses=body.waterGlasses,
        meals_eaten=body.mealsEaten,
        setting=body.setting,
        free_text=body.freeText,
        sentiment=sentiment,
        sentiment_score=score,
        keywords=",".join(keywords),
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

    start = _parse_date(from_date)
    if start:
        query = query.filter(CheckIn.created_at >= start)

    end = _parse_date(to_date)
    if end:
        # treat `to` as inclusive end-of-day
        end = end.replace(hour=23, minute=59, second=59)
        query = query.filter(CheckIn.created_at <= end)

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Check-in not found")
    return {"success": True, "data": _checkin_dict(checkin)}
