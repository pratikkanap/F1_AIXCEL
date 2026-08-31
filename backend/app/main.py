from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.utils.cache import clear_cache
from app.routers import (
    sessions,
    chat,
    standings,
    circuit,
    summary,
    media,
    telemetry,
    coach,
)

app = FastAPI(title="F1 Telemetry Analysis Tool")


# =========================================================
# CORS
# =========================================================

origins = [
    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Production Vercel
    "https://f1-aixcel.vercel.app",

    # Current Vercel preview
    "https://f1-aixcel-git-main-a-92be97a5.vercel.app",
]

# Allows future Vercel preview/deployment URLs such as:
# https://f1-aixcel-git-main-xxxxx.vercel.app
# https://f1-aixcel-xxxxx.vercel.app
allow_origin_regex = r"^https://f1-aixcel(?:-[a-zA-Z0-9-]+)?\.vercel\.app$"


# =========================================================
# Middleware
# =========================================================

# GZip is added first
app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,
)

# CORS is added LAST so it wraps all responses,
# including errors and compressed responses.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Routers
# =========================================================

app.include_router(sessions.router)
app.include_router(chat.router)
app.include_router(standings.router)
app.include_router(circuit.router)
app.include_router(summary.router)
app.include_router(media.router)
app.include_router(telemetry.router)
app.include_router(coach.router)


# =========================================================
# Health / Root
# =========================================================

@app.get("/")
def root():
    return {
        "status": "F1 Telemetry API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# =========================================================
# Debug
# =========================================================

@app.post("/debug/clear-cache")
def debug_clear_cache():
    clear_cache()

    return {
        "status": "cache cleared"
    }