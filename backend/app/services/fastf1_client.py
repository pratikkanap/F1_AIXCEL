import importlib
import os
from app.utils.cache import ttl_cache


try:
    fastf1 = importlib.import_module("fastf1")
except ImportError as exc:
    raise RuntimeError(
        "FastF1 is required. Install it with: pip install fastf1"
    ) from exc

CACHE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "fastf1_cache")
os.makedirs(CACHE_DIR, exist_ok=True)
fastf1.Cache.enable_cache(CACHE_DIR)


@ttl_cache()
def get_session_results(year: int, gp: str, session_type: str = "R"):
    session = fastf1.get_session(year, gp, session_type)
    session.load()

    results = session.results[
        ["Position", "Abbreviation", "TeamName", "Time", "Points"]
    ]
    results = results.fillna("")
    results["Time"] = results["Time"].astype(str)

    return results.to_dict(orient="records")


@ttl_cache(ttl=86400)
def get_event_schedule(year: int):
    """Return list of Grand Prix names for a given season."""
    schedule = fastf1.get_event_schedule(year, include_testing=False)

    if schedule.empty:
        raise RuntimeError(f"No schedule data available for {year} yet.")

    schedule = schedule.dropna(subset=["EventName"])
    events = schedule[["RoundNumber", "EventName", "Country"]].to_dict(orient="records")
    return events


@ttl_cache()
def get_track_map(year: int, gp: str, session_type: str = "R"):
    """Return the circuit outline, corner markers, and circuit facts."""
    session = fastf1.get_session(year, gp, session_type)
    session.load(telemetry=True, laps=True)

    fastest_lap = session.laps.pick_fastest()
    telemetry = fastest_lap.get_telemetry()

    track_points = telemetry[["X", "Y"]].dropna().to_dict(orient="records")

    circuit_info = session.get_circuit_info()
    corners = circuit_info.corners[["X", "Y", "Number"]].to_dict(orient="records")

    track_length_m = float(telemetry["Distance"].max())
    lap_record = fastest_lap["LapTime"]
    lap_record_driver = fastest_lap["Driver"]

    details = {
        "circuit_name": session.event["Location"],
        "country": session.event["Country"],
        "official_event_name": session.event["OfficialEventName"],
        "corner_count": len(corners),
        "track_length_km": round(track_length_m / 1000, 3),
        "fastest_lap_time": str(lap_record),
        "fastest_lap_driver": lap_record_driver,
        "event_date": str(session.event["EventDate"].date()),
    }

    return {"track_points": track_points, "corners": corners, "details": details}


@ttl_cache()
def get_driver_telemetry_comparison(year: int, gp: str, session_type: str, driver1: str, driver2: str):
    """Return aligned telemetry for two drivers' fastest laps, plus a delta time trace."""
    session = fastf1.get_session(year, gp, session_type)
    session.load(telemetry=True, laps=True)

    def get_driver_lap_telemetry(driver_code):
        driver_laps = session.laps.pick_drivers(driver_code)
        fastest = driver_laps.pick_fastest()
        if fastest is None:
            raise RuntimeError(f"No lap data found for driver {driver_code}.")
        tel = fastest.get_car_data().add_distance()
        return fastest, tel

    lap1, tel1 = get_driver_lap_telemetry(driver1)
    lap2, tel2 = get_driver_lap_telemetry(driver2)

    def to_points(tel, max_points=300):
        df = tel[["Distance", "Speed", "Throttle", "Brake", "nGear", "RPM"]].dropna()
        if len(df) > max_points:
            step = len(df) // max_points
            df = df.iloc[::step]
        return df.to_dict(orient="records")

    delta_time = []
    try:
        from fastf1.utils import delta_time as f1_delta_time
        delta, ref_tel, compare_tel = f1_delta_time(lap1, lap2)
        delta_time = [
            {"distance": float(d), "delta": float(v)}
            for d, v in zip(ref_tel["Distance"], delta)
            if v == v
        ]
        if len(delta_time) > 300:
            step = len(delta_time) // 300
            delta_time = delta_time[::step]
    except Exception:
        delta_time = []

    return {
        "driver1": {
            "code": driver1,
            "lap_time": str(lap1["LapTime"]),
            "telemetry": to_points(tel1),
        },
        "driver2": {
            "code": driver2,
            "lap_time": str(lap2["LapTime"]),
            "telemetry": to_points(tel2),
        },
        "delta_time": delta_time,
    }


@ttl_cache()
def get_session_drivers(year: int, gp: str, session_type: str = "R"):
    """Return the list of driver codes present in a session, for the comparison picker."""
    session = fastf1.get_session(year, gp, session_type)
    session.load(telemetry=False, laps=True)
    drivers = session.laps["Driver"].unique().tolist()
    return sorted(drivers)


def get_braking_points(tel_df):
    """Detect braking zones: where Brake goes from 0 to 1, return distance + speed at that point."""
    braking_points = []
    prev_brake = 0
    for _, row in tel_df.iterrows():
        if row["Brake"] == 1 and prev_brake == 0:
            braking_points.append({"distance": float(row["Distance"]), "speed": float(row["Speed"])})
        prev_brake = row["Brake"]
    return braking_points