from fastapi import APIRouter, HTTPException
from app.services.fastf1_client import get_track_map

router = APIRouter(prefix="/circuit", tags=["circuit"])


@router.get("/{year}/{gp}/{session_type}/track-map")
def read_track_map(year: int, gp: str, session_type: str = "R"):
    try:
        return get_track_map(year, gp, session_type)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))