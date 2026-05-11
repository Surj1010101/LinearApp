from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
import json

from ..deps import get_db, get_current_user
from ..models import CheckIn, Insight, Recommendation, User

router = APIRouter()


def _user_dict(user) -> dict:
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


@router.get("/users/me")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return {"success": True, "data": _user_dict(current_user)}


class UpdateProfileBody(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    fitnessLevel: Optional[str] = None
    workPattern: Optional[str] = None
    goals: Optional[list[str]] = None


@router.put("/users/me")
def update_profile(
    body: UpdateProfileBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.name is not None:
        current_user.name = body.name
    if body.age is not None:
        current_user.age = body.age
    if body.fitnessLevel is not None:
        current_user.fitness_level = body.fitnessLevel
    if body.workPattern is not None:
        current_user.work_pattern = body.workPattern
    if body.goals is not None:
        current_user.goals = ",".join(body.goals)

    db.commit()
    db.refresh(current_user)

    return {"success": True, "data": _user_dict(current_user)}


@router.get("/users/me/export")
def export_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """GDPR data export — returns every record belonging to the current user as a JSON download."""
    checkins = db.query(CheckIn).filter(CheckIn.user_id == current_user.id).all()
    recommendations = db.query(Recommendation).filter(Recommendation.user_id == current_user.id).all()
    insights = db.query(Insight).filter(Insight.user_id == current_user.id).all()

    payload = {
        "profile": _user_dict(current_user),
        "checkins": [
            {
                "id": c.id,
                "mood": c.mood,
                "energy": c.energy,
                "stress": c.stress,
                "hoursWorked": c.hours_worked,
                "screenTime": c.screen_time,
                "waterGlasses": c.water_glasses,
                "mealsEaten": c.meals_eaten,
                "setting": c.setting,
                "freeText": c.free_text,
                "sentiment": c.sentiment,
                "sentimentScore": c.sentiment_score,
                "keywords": c.keywords,
                "createdAt": c.created_at.isoformat() if c.created_at else None,
            }
            for c in checkins
        ],
        "recommendations": [
            {
                "id": r.id,
                "exerciseType": r.exercise_type,
                "duration": r.duration,
                "reason": r.reason,
                "createdAt": r.created_at.isoformat() if r.created_at else None,
            }
            for r in recommendations
        ],
        "insights": [
            {
                "id": i.id,
                "summary": i.summary,
                "suggestions": i.suggestions,
                "createdAt": i.created_at.isoformat() if i.created_at else None,
            }
            for i in insights
        ],
    }

    return Response(
        content=json.dumps(payload, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=linear-data-export.json"},
    )


@router.delete("/users/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """GDPR right-to-erasure — deletes the user and every related record."""
    db.query(CheckIn).filter(CheckIn.user_id == current_user.id).delete()
    db.query(Recommendation).filter(Recommendation.user_id == current_user.id).delete()
    db.query(Insight).filter(Insight.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()
    return {"success": True, "data": {"deleted": True}}
