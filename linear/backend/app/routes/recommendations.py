from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from ..deps import get_db, get_current_user
from ..models import CheckIn, Recommendation, User
from ..services.recommendation_services import generate_recommendation

router = APIRouter()

EXERCISE_META = {
    "yoga": {
        "name": "Yoga & Mindfulness",
        "description": "Gentle yoga flow to reduce stress and restore energy.",
        "category": "yoga_mindfulness",
        "intensity": "low",
        "duration": 20,
        "nutrition": "Stay hydrated and have a light snack beforehand.",
    },
    "light cardio": {
        "name": "Light Cardio",
        "description": "A brisk walk or easy cycle to boost your mood.",
        "category": "light_cardio",
        "intensity": "low",
        "duration": 30,
        "nutrition": "Eat a banana or piece of fruit 30 minutes before.",
    },
    "moderate workout": {
        "name": "Moderate Workout",
        "description": "Bodyweight circuit or a steady jog.",
        "category": "moderate",
        "intensity": "moderate",
        "duration": 40,
        "nutrition": "Have a balanced meal 1-2 hours before exercising.",
    },
    "strength training": {
        "name": "Strength Training",
        "description": "Compound lifts to build strength and resilience.",
        "category": "strength",
        "intensity": "high",
        "duration": 45,
        "nutrition": "Consume adequate protein (20-30g) within 2 hours post-workout.",
    },
}


def _build_rec(user: User, db: Session) -> dict:
    latest = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == user.id)
        .order_by(CheckIn.created_at.desc())
        .first()
    )

    mood = latest.mood if latest else 3
    energy = latest.energy if latest else 3
    stress = latest.stress if latest else 3
    fitness = user.fitness_level or "beginner"

    exercise_key = generate_recommendation(mood, energy, stress, fitness)
    meta = EXERCISE_META.get(exercise_key, EXERCISE_META["light cardio"])

    rec = Recommendation(
        user_id=user.id,
        exercise_type=meta["category"],
        duration=meta["duration"],
        reason=meta["description"],
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {
        "id": str(rec.id),
        "userId": str(user.id),
        "exerciseCategory": meta["category"],
        "exerciseName": meta["name"],
        "exerciseDescription": meta["description"],
        "durationMins": meta["duration"],
        "intensity": meta["intensity"],
        "nutritionTip": meta["nutrition"],
        "confidence": 0.8,
        "ruleOverride": False,
        "disclaimer": "This is not medical advice. Consult a healthcare professional before starting any new exercise programme.",
        "createdAt": rec.created_at.isoformat() if rec.created_at else datetime.utcnow().isoformat(),
    }


@router.get("/recommendations/today")
def get_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"success": True, "data": _build_rec(current_user, db)}


@router.post("/recommendations/alternative")
def get_alternative(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"success": True, "data": _build_rec(current_user, db)}
