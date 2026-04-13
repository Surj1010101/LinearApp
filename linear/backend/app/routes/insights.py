from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user
from ..models import CheckIn, Insight, User

router = APIRouter()


def _insight_dict(insight: Insight) -> dict:
    suggestions = [s for s in (insight.suggestions or "").split("\n") if s.strip()]
    return {
        "id": str(insight.id),
        "userId": str(insight.user_id),
        "summary": insight.summary,
        "suggestions": suggestions,
        "generatedAt": insight.created_at.isoformat() if insight.created_at else datetime.utcnow().isoformat(),
    }


def _generate_insight(checkins: list[CheckIn]) -> tuple[str, list[str]]:
    count = len(checkins)
    mood_avg = sum(c.mood for c in checkins) / count
    energy_avg = sum(c.energy for c in checkins) / count
    stress_avg = sum(c.stress for c in checkins) / count

    if mood_avg >= 4 and stress_avg <= 2.5:
        trend = "Your wellbeing trend looks stable and positive this week"
    elif stress_avg >= 3.5:
        trend = "Stress has been consistently elevated in recent check-ins"
    elif energy_avg <= 2.5:
        trend = "Energy levels are trending lower than usual"
    else:
        trend = "Your wellbeing signals are mixed, with room for small improvements"

    summary = (
        f"{trend}. Over the last {count} check-ins: "
        f"mood {mood_avg:.1f}/5, energy {energy_avg:.1f}/5, stress {stress_avg:.1f}/5."
    )

    suggestions: list[str] = []
    if stress_avg >= 3:
        suggestions.append("Schedule one 10-minute decompression break during your busiest work block.")
    if energy_avg <= 3:
        suggestions.append("Choose a low-intensity activity today (walk, stretching, or light yoga) to reset energy.")
    if mood_avg <= 3:
        suggestions.append("Add one mood-lifting action after work, like a short outdoor walk or social check-in.")
    if not suggestions:
        suggestions.append("Keep your current routine and maintain consistent sleep and hydration habits.")

    suggestions.append("Log daily check-ins at a similar time to improve recommendation accuracy.")
    return summary, suggestions[:3]


@router.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    insights = (
        db.query(Insight)
        .filter(Insight.user_id == current_user.id)
        .order_by(Insight.created_at.desc())
        .all()
    )
    return {"success": True, "data": [_insight_dict(i) for i in insights]}


@router.post("/insights/generate")
def generate_insight(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    since = datetime.utcnow() - timedelta(days=14)
    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == current_user.id, CheckIn.created_at >= since)
        .order_by(CheckIn.created_at.desc())
        .limit(10)
        .all()
    )

    if len(checkins) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Need at least 3 recent check-ins to generate an insight.",
        )

    summary, suggestions = _generate_insight(checkins)

    insight = Insight(
        user_id=current_user.id,
        summary=summary,
        suggestions="\n".join(suggestions),
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)

    return {"success": True, "data": _insight_dict(insight)}
