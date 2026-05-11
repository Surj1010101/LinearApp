"""Generative-AI-backed insight generation, with a graceful local fallback.

Uses Google Gemini (free tier) when GOOGLE_API_KEY is set. Falls back to the
rule-based summary in insights.py if the SDK is missing, no key is set, or the
API call fails for any reason.
"""

import json
import os
import re
from pathlib import Path
from typing import Optional

from ..models import CheckIn

try:  # optional dependency — falls back if not installed
    from google import genai
    from google.genai import types
except Exception:  # pragma: no cover
    genai = None  # type: ignore[assignment]
    types = None  # type: ignore[assignment]

try:
    from dotenv import load_dotenv

    # Load linear/backend/.env explicitly so it works regardless of CWD.
    _ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
    if _ENV_PATH.exists():
        load_dotenv(_ENV_PATH)
    else:
        load_dotenv()  # best-effort fall back to default search
except Exception:  # pragma: no cover
    pass


MODEL = "gemini-2.5-flash"

SYSTEM_PROMPT = (
    "You are a wellbeing coach for hybrid workers. You receive a JSON array of recent daily "
    "check-ins (mood, energy, stress on a 1-5 scale, hours worked, screen time, hydration, "
    "meals eaten, free-text journal, and detected sentiment). Reply with strict JSON only, "
    "no prose, in this exact shape: "
    '{"summary": string, "suggestions": [string, string, string]}. '
    "The summary should be 2-3 sentences and reference at least one specific pattern you "
    "noticed (e.g. high stress days correlating with long screen time). Suggestions should "
    "be concrete, kind, non-medical, and tailored to the data. Never diagnose."
)


def _checkin_payload(checkin: CheckIn) -> dict:
    return {
        "date": checkin.created_at.date().isoformat() if checkin.created_at else None,
        "mood": checkin.mood,
        "energy": checkin.energy,
        "stress": checkin.stress,
        "hoursWorked": checkin.hours_worked,
        "screenTime": checkin.screen_time,
        "waterGlasses": checkin.water_glasses,
        "mealsEaten": checkin.meals_eaten,
        "setting": checkin.setting,
        "sentiment": checkin.sentiment,
        "freeText": checkin.free_text,
    }


def _extract_json(text: str) -> Optional[dict]:
    """Tolerantly pull the first JSON object out of the model's reply."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def generate_ai_insight(checkins: list[CheckIn]) -> Optional[tuple[str, list[str]]]:
    """Return (summary, suggestions) from Gemini, or None if AI is unavailable / failed."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or genai is None or types is None:
        return None

    payload = [_checkin_payload(c) for c in checkins]
    user_message = (
        "Here are my recent check-ins:\n\n"
        + json.dumps(payload, indent=2)
        + "\n\nReturn only the JSON object."
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=MODEL,
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                max_output_tokens=512,
            ),
        )
    except Exception:
        return None

    text = getattr(response, "text", None) or ""
    parsed = _extract_json(text)
    if not parsed:
        return None

    summary = parsed.get("summary")
    suggestions = parsed.get("suggestions") or []
    if not isinstance(summary, str) or not isinstance(suggestions, list):
        return None

    suggestions = [s for s in suggestions if isinstance(s, str)][:3]
    if not summary or not suggestions:
        return None

    return summary.strip(), suggestions


def is_ai_enabled() -> bool:
    return bool(os.getenv("GOOGLE_API_KEY")) and genai is not None
