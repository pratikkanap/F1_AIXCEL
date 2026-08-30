from fastapi import APIRouter, HTTPException
from app.services.coach_client import generate_coaching_feedback

router = APIRouter(prefix="/coach", tags=["coach"])


@router.get("/{year}/{gp}/{session_type}")
def read_coaching_feedback(year: int, gp: str, session_type: str, driver: str, reference_driver: str):
    try:
        return generate_coaching_feedback(year, gp, session_type, driver, reference_driver)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))