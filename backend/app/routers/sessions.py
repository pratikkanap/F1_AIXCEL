from fastapi import APIRouter, HTTPException  # type: ignore[import-not-found]
from app.services.fastf1_client import get_session_results, get_event_schedule


router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/{year}/{gp}/{session_type}/results")
def read_session_results(year: int, gp: str, session_type: str = "R"):
    try:
        results = get_session_results(year, gp, session_type)
        return {"year": year, "gp": gp, "session_type": session_type, "results": results}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{year}/events")
def read_event_schedule(year: int):
    try:
        events = get_event_schedule(year)
        return {"year": year, "events": events}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))