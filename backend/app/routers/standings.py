from fastapi import APIRouter, HTTPException
from app.services.standings_client import get_driver_standings, get_constructor_standings

router = APIRouter(prefix="/standings", tags=["standings"])


@router.get("/{year}/drivers")
def read_driver_standings(year: int):
    try:
        return {"year": year, "standings": get_driver_standings(year)}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{year}/constructors")
def read_constructor_standings(year: int):
    try:
        return {"year": year, "standings": get_constructor_standings(year)}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))