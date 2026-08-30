import json
from groq import Groq
from app.config import GROQ_API_KEY
from app.services.fastf1_client import get_session_results, get_event_schedule
from datetime import date

client = Groq(api_key=GROQ_API_KEY)

MODEL = "openai/gpt-oss-120b"

CURRENT_YEAR = date.today().year

SYSTEM_PROMPT = f"""You are an expert Formula 1 analyst assistant built into an F1 telemetry app.
Today's date context: the current F1 season is {CURRENT_YEAR}.

You have tools to fetch real session results and season schedules — ALWAYS use them for
any question involving results, standings, points, race calendars, or "this season" /
"current season" (which means {CURRENT_YEAR}), for ANY year including {CURRENT_YEAR} itself,
even if it's the current in-progress season. Never say you don't have data before trying
the tool first — the tools pull live, current data, not just historical data.

For general F1 knowledge questions (rules, history, how strategies work), answer directly
from your own knowledge.

Keep answers concise and conversational, like a knowledgeable friend, not a wall of text."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_session_results",
            "description": "Get race/qualifying/practice results for a specific F1 session: driver positions, teams, finishing times, and points scored.",
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {"type": "integer", "description": "Season year, e.g. 2024"},
                    "gp": {"type": "string", "description": "Grand Prix name, e.g. 'Monza' or 'Italian Grand Prix'"},
                    "session_type": {
                        "type": "string",
                        "description": "R = Race, Q = Qualifying, FP1/FP2/FP3 = Practice. Defaults to R.",
                    },
                },
                "required": ["year", "gp"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_event_schedule",
            "description": "Get the full list of Grand Prix races for a given F1 season.",
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {"type": "integer", "description": "Season year, e.g. 2024"},
                },
                "required": ["year"],
            },
        },
    },
]


def execute_tool(name: str, args: dict):
    if name == "get_session_results":
        return get_session_results(args["year"], args["gp"], args.get("session_type", "R"))
    if name == "get_event_schedule":
        return get_event_schedule(args["year"])
    return {"error": f"Unknown tool: {name}"}


def chat_with_tools(user_message: str, history: list):
    """
    history: list of plain {role, content} dicts from previous turns (OpenAI/Groq format).
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history + [
        {"role": "user", "content": user_message}
    ]

    max_loops = 5
    for _ in range(max_loops):
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
        )
        message = response.choices[0].message

        if not message.tool_calls:
            messages.append({"role": "assistant", "content": message.content})
            return message.content, messages[1:]  # drop system prompt from stored history

        messages.append({
            "role": "assistant",
            "content": message.content,
            "tool_calls": [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {"name": tc.function.name, "arguments": tc.function.arguments},
                }
                for tc in message.tool_calls
            ],
        })

        for tc in message.tool_calls:
            args = json.loads(tc.function.arguments)
            try:
                result = execute_tool(tc.function.name, args)
            except Exception as e:
                result = {"error": str(e)}
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": str(result),
            })

    return "Sorry, I couldn't complete that request.", messages[1:]