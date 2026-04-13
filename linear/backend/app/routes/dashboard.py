from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ..deps import get_db, get_current_user
from ..models import CheckIn, User

router = APIRouter()


@router.get("/dashboard/summary")
def get_summary(
    period: str = Query("week"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    days = 30 if period == "month" else 7
    since = datetime.utcnow() - timedelta(days=days)

    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == current_user.id, CheckIn.created_at >= since)
        .all()
    )

    count = len(checkins)
    mood_avg = round(sum(c.mood for c in checkins) / count, 1) if count else 0
    energy_avg = round(sum(c.energy for c in checkins) / count, 1) if count else 0
    stress_avg = round(sum(c.stress for c in checkins) / count, 1) if count else 0

    # Simple streak: count consecutive days ending today with at least one check-in
    streak = 0
    if checkins:
        dates = {c.created_at.date() for c in checkins}
        day = datetime.utcnow().date()
        while day in dates:
            streak += 1
            day -= timedelta(days=1)

    return {
        "success": True,
        "data": {
            "moodAvg": mood_avg,
            "energyAvg": energy_avg,
            "stressAvg": stress_avg,
            "exerciseCount": 0,
            "streak": streak,
            "checkinCount": count,
        },
    }


@router.get("/dashboard/trends")
def get_trends(
    metric: str = Query("mood"),
    days: int = Query(7),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    since = datetime.utcnow() - timedelta(days=days)
    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == current_user.id, CheckIn.created_at >= since)
        .order_by(CheckIn.created_at.asc())
        .all()
    )

    field_map = {"mood": "mood", "energy": "energy", "stress": "stress"}
    field = field_map.get(metric, "mood")

    points = [
        {
            "date": c.created_at.strftime("%Y-%m-%d"),
            "value": getattr(c, field),
        }
        for c in checkins
    ]

    return {"success": True, "data": points}
