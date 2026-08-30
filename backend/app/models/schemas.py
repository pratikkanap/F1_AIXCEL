from pydantic import BaseModel
from typing import List, Dict, Any


class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []


class ChatResponse(BaseModel):
    reply: str
    history: List[Dict[str, Any]]