from fastapi import APIRouter, HTTPException
from app.services.summary_client import generate_race_summary

router = APIRouter(prefix="/summary", tags=["summary"])


@router.get("/{year}/{gp}/{session_type}")
def read_race_summary(year: int, gp: str, session_type: str = "R"):
    try:
        return generate_race_summary(year, gp, session_type)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))