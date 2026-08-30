from groq import Groq
from app.config import GROQ_API_KEY
from app.services.fastf1_client import get_driver_telemetry_comparison, get_braking_points
import pandas as pd

client = Groq(api_key=GROQ_API_KEY)
MODEL = "openai/gpt-oss-120b"


def build_coaching_facts(year: int, gp: str, session_type: str, driver: str, reference_driver: str):
    comparison = get_driver_telemetry_comparison(year, gp, session_type, driver, reference_driver)

    tel_driver = pd.DataFrame(comparison["driver1"]["telemetry"])
    tel_ref = pd.DataFrame(comparison["driver2"]["telemetry"])

    braking_driver = get_braking_points(tel_driver)
    braking_ref = get_braking_points(tel_ref)

    braking_deltas = []
    for i in range(min(len(braking_driver), len(braking_ref), 8)):
        diff = braking_driver[i]["distance"] - braking_ref[i]["distance"]
        braking_deltas.append({
            "zone": i + 1,
            "driver_distance": round(braking_driver[i]["distance"], 1),
            "reference_distance": round(braking_ref[i]["distance"], 1),
            "delta_m": round(diff, 1),
        })

    max_speed_driver = tel_driver["Speed"].max()
    max_speed_ref = tel_ref["Speed"].max()
    avg_throttle_driver = tel_driver["Throttle"].mean()
    avg_throttle_ref = tel_ref["Throttle"].mean()

    return {
        "driver": comparison["driver1"]["code"],
        "reference_driver": comparison["driver2"]["code"],
        "driver_lap_time": comparison["driver1"]["lap_time"],
        "reference_lap_time": comparison["driver2"]["lap_time"],
        "braking_deltas": braking_deltas,
        "max_speed_driver": round(float(max_speed_driver), 1),
        "max_speed_reference": round(float(max_speed_ref), 1),
        "avg_throttle_driver": round(float(avg_throttle_driver), 1),
        "avg_throttle_reference": round(float(avg_throttle_ref), 1),
    }


def generate_coaching_feedback(year: int, gp: str, session_type: str, driver: str, reference_driver: str):
    facts = build_coaching_facts(year, gp, session_type, driver, reference_driver)

    prompt = f"""You are an F1 driving coach analyzing telemetry data. Compare {facts['driver']}'s
lap ({facts['driver_lap_time']}) against the reference lap from {facts['reference_driver']}
({facts['reference_lap_time']}).

Braking point comparison (positive delta_m means {facts['driver']} braked later, i.e. deeper into the corner):
{facts['braking_deltas']}

Top speed: {facts['driver']} hit {facts['max_speed_driver']} km/h vs reference {facts['max_speed_reference']} km/h.
Average throttle application: {facts['driver']} {facts['avg_throttle_driver']}% vs reference {facts['avg_throttle_reference']}%.

Write 3-5 short, specific, actionable coaching bullet points, in the style of a real race engineer
talking to their driver. Reference actual corner/braking zone numbers and specific distances where relevant.
Be direct and concrete, not generic."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    return {"facts": facts, "feedback": response.choices[0].message.content}