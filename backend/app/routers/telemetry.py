from fastapi import APIRouter, HTTPException
from app.services.fastf1_client import get_driver_telemetry_comparison, get_session_drivers

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.get("/{year}/{gp}/{session_type}/drivers")
def read_session_drivers(year: int, gp: str, session_type: str = "R"):
    try:
        drivers = get_session_drivers(year, gp, session_type)
        return {"drivers": drivers}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{year}/{gp}/{session_type}/compare")
def read_telemetry_comparison(year: int, gp: str, session_type: str, driver1: str, driver2: str):
    try:
        return get_driver_telemetry_comparison(year, gp, session_type, driver1, driver2)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))