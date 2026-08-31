# F1 AIxcel — F1 Telemetry Analysis Tool

A full-stack Formula 1 data and telemetry analysis platform built with real race data — race results, live standings, driver/team profiles, circuit maps, telemetry comparisons, AI-generated race summaries, an AI driver coach, and an F1 knowledge chatbot.

**Live demo:** https://f1-aixcel.vercel.app
**Backend API:** https://f1-aixcel.onrender.com

---

## Features

- **Race Results** — full session results (Race/Qualifying/Practice) for any year and Grand Prix
- **Telemetry Comparison** — overlay two drivers' speed, throttle, brake, and delta-time traces from real car telemetry
- **AI Driver Coach** — compares a driver's braking points and pace against a reference driver and generates specific, data-grounded coaching feedback
- **Teams & Drivers** — full 2026 grid with real photos, short bios, and 5-season career history, pulled live from Wikipedia and Ergast/Jolpica
- **Standings** — driver and constructor championship standings for any season
- **Race Schedule** — full season calendar for any year
- **Circuit Maps** — real circuit outlines drawn from GPS telemetry, with corner markers and track facts
- **AI Race Summary** — auto-generated race recaps grounded in real results, podiums, and fastest laps
- **F1 Knowledge Chatbot** — tool-calling assistant that answers questions using live data, not guesses
- **Home Page** — animated, interactive car diagram explaining 2026-spec F1 car parts, plus a Learn F1 primer

---

## Tech Stack

**Backend**
- FastAPI (Python)
- [FastF1](https://github.com/theOehrly/Fast-F1) — official/timing F1 data and telemetry
- Ergast/Jolpica API — historical standings
- Groq (LLM inference) — chatbot, race summaries, AI coach
- In-memory TTL caching for fast repeat requests

**Frontend**
- React + Vite
- React Router
- Custom SVG charting (telemetry overlays, track maps)
- Wikipedia REST/Action API — openly-licensed driver/team photos and bios

**Deployment**
- Backend: Render (Web Service)
- Frontend: Vercel (Static/Vite build)

---

## Project Structure

```
F1_AIXCEL/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routers/        # sessions, chat, standings, circuit, summary, media, telemetry, coach
│   │   ├── services/       # FastF1, LLM, Wikipedia, caching logic
│   │   ├── models/
│   │   └── utils/
│   ├── fastf1_cache/        # gitignored
│   ├── venv/                 # gitignored
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/             # client.js, cache.js
    │   ├── components/
    │   ├── pages/
    │   └── data/
    ├── node_modules/         # gitignored
    └── package.json
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate      # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

Run:
```bash
uvicorn app.main:app --reload
```
Backend runs at `http://127.0.0.1:8000` — interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | backend | (legacy, optional) Gemini access |
| `GROQ_API_KEY` | backend | Powers chatbot, race summaries, AI coach |
| `VITE_API_KEY` | frontend | Optional API key header sent to backend |

---

## Notes & Limitations

- **First-time data loads are slow.** FastF1 downloads real timing/telemetry data on first request for any given year/GP/session — this is genuine data retrieval, not a bug. Subsequent requests for the same data are cached and near-instant.
- **Free-tier hosting**: the Render backend spins down after ~15 minutes of inactivity; the first request after idle time can take 30–60 seconds to wake up.
- **Photos & bios** are sourced live from Wikipedia under their respective open licenses — not official F1 media.
- **AI features** (chatbot, summaries, coaching) are grounded in real fetched data via tool-calling, not fabricated, but should be treated as an exploratory feature, not an authoritative source.

---

## Credits

Built using [FastF1](https://github.com/theOehrly/Fast-F1), the Ergast/Jolpica F1 API, Groq, and Wikipedia's open API. Not affiliated with Formula 1, FIA, or any F1 team.