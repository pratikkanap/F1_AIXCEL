from groq import Groq
from app.config import GROQ_API_KEY
from app.services.fastf1_client import fastf1

client = Groq(api_key=GROQ_API_KEY)
MODEL = "openai/gpt-oss-120b"

def build_race_facts(year: int, gp: str, session_type: str = "R"):
    session = fastf1.get_session(year, gp, session_type)
    session.load()

    results = session.results[["Position", "Abbreviation", "TeamName", "Status", "Points"]]
    winner = results.iloc[0]
    podium = results.iloc[0:3]

    fastest_lap = session.laps.pick_fastest()
    fastest_driver = fastest_lap["Driver"] if fastest_lap is not None else "N/A"
    fastest_time = str(fastest_lap["LapTime"]) if fastest_lap is not None else "N/A"

    retirements = results[results["Status"] != "Finished"]

    return {
        "year": year,
        "gp": gp,
        "winner": winner["Abbreviation"],
        "winner_team": winner["TeamName"],
        "podium": podium[["Abbreviation", "TeamName"]].to_dict(orient="records"),
        "fastest_lap_driver": fastest_driver,
        "fastest_lap_time": fastest_time,
        "retirements": retirements["Abbreviation"].tolist(),
        "total_finishers": int((results["Status"] == "Finished").sum()),
    }


def generate_race_summary(year: int, gp: str, session_type: str = "R"):
    facts = build_race_facts(year, gp, session_type)

    prompt = f"""Write a short, engaging 3-4 sentence race summary for a Formula 1 fan, based on these facts:

{facts}

Write it like a knowledgeable F1 commentator recapping the race. Be specific with driver names and teams.
Don't just list the facts as bullet points — turn them into a natural narrative."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    return {"facts": facts, "summary": response.choices[0].message.content}