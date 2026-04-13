from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user
from ..models import User

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
