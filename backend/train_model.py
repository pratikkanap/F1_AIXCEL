"""
One-time training script. Run manually with: python train_model.py
Trains a model on past seasons to predict finishing position from
grid position + team, and saves it as predictor_model.pkl
"""
import fastf1
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

CACHE_DIR = os.path.join(os.path.dirname(__file__), "fastf1_cache")
os.makedirs(CACHE_DIR, exist_ok=True)
fastf1.Cache.enable_cache(CACHE_DIR)

TRAINING_SEASONS = [2021, 2022, 2023, 2024]

rows = []

for year in TRAINING_SEASONS:
    schedule = fastf1.get_event_schedule(year)
    schedule = schedule[schedule["EventFormat"] != "testing"]

    for _, event in schedule.iterrows():
        gp = event["EventName"]
        try:
            session = fastf1.get_session(year, gp, "R")
            session.load()
            results = session.results[["GridPosition", "TeamName", "Position"]].dropna()
            rows.append(results)
            print(f"Loaded {year} {gp}")
        except Exception as e:
            print(f"Skipped {year} {gp}: {e}")

data = pd.concat(rows, ignore_index=True)

team_encoder = LabelEncoder()
data["TeamEncoded"] = team_encoder.fit_transform(data["TeamName"])

X = data[["GridPosition", "TeamEncoded"]]
y = data["Position"]

model = RandomForestRegressor(n_estimators=200, max_depth=8, random_state=42)
model.fit(X, y)

joblib.dump(
    {"model": model, "team_encoder": team_encoder},
    os.path.join(os.path.dirname(__file__), "predictor_model.pkl"),
)

print("Model trained and saved to predictor_model.pkl")