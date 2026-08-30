from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.llm_client import chat_with_tools

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        reply, updated_history = chat_with_tools(request.message, request.history)
        return ChatResponse(reply=reply, history=updated_history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))