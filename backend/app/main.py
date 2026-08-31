from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.utils.cache import clear_cache

from app.routers import sessions, chat, standings, circuit, summary, media, telemetry, coach
app = FastAPI(title="F1 Telemetry Analysis Tool")

origins = [
    "https://f1-aixcel-git-main-a-92be97a5.vercel.app",  # your current preview URL
    "https://f1-aixcel.vercel.app",                       # your production domain (update to your real one)
    "http://localhost:5173",                              # local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(chat.router)
app.include_router(standings.router)
app.include_router(circuit.router)
app.include_router(summary.router)
app.include_router(media.router)
app.include_router(coach.router)
app.include_router(telemetry.router)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/")
def root():
    return {"status": "F1 Telemetry API is running"}


@app.post("/debug/clear-cache")
def debug_clear_cache():
    clear_cache()
    return {"status": "cache cleared"}