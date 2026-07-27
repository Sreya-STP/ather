"""
Aether — FastAPI Backend (v4 — Google Gemini)
=============================================
Switched from Anthropic Claude to Google Gemini API.
Set GOOGLE_API_KEY in backend/.env

Endpoints:
  GET  /api/health
  POST /api/career-evaluate   → SSE stream
  POST /api/business-evaluate → SSE stream
  POST /api/chat              → SSE stream

HOW STREAMING WORKS:
  1. Call Gemini with generate_content (streaming=True).
  2. Accumulate the full response text.
  3. Parse: split narrative sections from event: / data: blocks.
  4. Stream narrative word-by-word as SSE data events.
  5. Emit structured JSON as named SSE events.
  This prevents the "raw markdown in output" bug.
"""

import os
import re
import json
import asyncio
import logging
from typing import AsyncGenerator, List

import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from prompts import CAREER_SYSTEM_PROMPT, STARTUP_SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# ── Gemini client setup ────────────────────────────────────────
_api_key = os.getenv("GOOGLE_API_KEY")
if _api_key:
    genai.configure(api_key=_api_key)
    logger.info("Gemini API key loaded.")
else:
    logger.warning("GOOGLE_API_KEY not set — endpoints will return fallback responses.")

GEMINI_MODEL = "gemini-2.5-flash"   # fast + cheap; swap to "gemini-1.5-pro" for better quality

# ── FastAPI app ────────────────────────────────────────────────
app = FastAPI(title="Aether API", version="4.0.0")

_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://frontend:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ─────────────────────────────────────────────

class CareerRequest(BaseModel):
    name: str = Field(default="User")
    major: str = Field(default="")
    year: str = Field(default="")
    subjects: str = Field(default="")
    projects: str = Field(default="")
    certifications: str = Field(default="")
    skills: str = Field(default="")
    goal: str = Field(default="")
    experience: str = Field(default="")
    extra: str = Field(default="")

class StartupRequest(BaseModel):
    name: str = Field(default="Founder")
    idea: str = Field(default="")
    audience: str = Field(default="")
    industry: str = Field(default="")
    budget: str = Field(default="")
    techSkills: str = Field(default="")
    teamSize: str = Field(default="1")
    timeline: str = Field(default="")
    problem: str = Field(default="")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    mode: str = Field(default="career")


# ── SSE Helpers ────────────────────────────────────────────────

def sse_data(token: str) -> str:
    """Narrative token — escape newlines so each SSE line stays clean."""
    escaped = token.replace("\n", "\\n")
    return f"data: {escaped}\n\n"

def sse_event(name: str, data: object) -> str:
    """Named structured JSON event."""
    return f"event: {name}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"

def sse_error(msg: str) -> str:
    return f"event: error\ndata: {json.dumps({'message': msg})}\n\n"


# ── Response Parser ────────────────────────────────────────────

CAREER_EVENTS  = {"scores", "jobs", "radar", "roadmap", "skillgaps", "done"}
STARTUP_EVENTS = {"bizscores", "competitors", "milestones", "funding", "revenuemodel", "done"}

def parse_response(full_text: str, known_events: set) -> tuple[str, dict]:
    """
    Split Gemini's output into:
      narrative  — the plain text sections the user reads
      events     — dict of event_name → parsed JSON dict
    """
    narrative_lines: list[str] = []
    events: dict = {}

    lines = full_text.split("\n")
    in_event      = False
    cur_name      = None
    cur_data      : list[str] = []
    narr_done     = False

    def flush_event():
        nonlocal cur_name, cur_data, in_event
        if cur_name and cur_data:
            raw = "".join(cur_data).strip()
            # Strip markdown code fences if Gemini added them
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            try:
                events[cur_name] = json.loads(raw)
            except Exception as exc:
                logger.warning(f"JSON parse failed for event '{cur_name}': {exc}")
        cur_name  = None
        cur_data  = []
        in_event  = False

    for line in lines:
        stripped = line.strip()

        # Detect "event: <name>" line
        if stripped.startswith("event:"):
            candidate = stripped[6:].strip()
            if candidate in known_events:
                flush_event()
                cur_name  = candidate
                cur_data  = []
                in_event  = True
                narr_done = True
                continue

        if in_event:
            if stripped.startswith("data:"):
                cur_data.append(stripped[5:].lstrip())
            elif stripped == "":
                flush_event()
            # skip unknown lines inside event block
            continue

        if not narr_done:
            narrative_lines.append(line)

    flush_event()  # flush anything remaining at EOF

    narrative = "\n".join(narrative_lines).strip()
    return narrative, events


# ── Gemini call ────────────────────────────────────────────────

def call_gemini(system_prompt: str, user_message: str, max_tokens: int = 4096) -> str:
    """
    Call Gemini synchronously and return the full response text.
    Gemini's Python SDK doesn't have true async streaming that yields
    partial sentences, so we collect the full response and then
    simulate streaming word-by-word on the SSE side.
    """
    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=system_prompt,
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=0.7,
        ),
    )
    response = model.generate_content(user_message)
    return response.text


def stream_words(text: str):
    """Yield SSE data events word by word, preserving newlines."""
    # Split on whitespace but keep newline tokens
    tokens = re.split(r"(\s+)", text)
    for tok in tokens:
        if tok:
            yield tok


# ── Fallback data ──────────────────────────────────────────────

FALLBACK_CAREER = {
    "scores": {
        "overall": 60, "technical": 55, "communication": 65,
        "projects": 50, "interview": 60, "label": "Rising Talent",
        "percentile": 45, "marketDemand": "High", "timeToOffer": "10-14 weeks",
    },
    "jobs": [
        {"title": "Junior Software Engineer", "company": "Tech Startup", "match": 65,
         "salary": "₹6-10 LPA", "growth": "18%", "missing": ["System Design", "Cloud"],
         "demand": "High", "remote": True},
        {"title": "Frontend Developer", "company": "Product Company", "match": 58,
         "salary": "₹5-8 LPA", "growth": "15%", "missing": ["TypeScript", "Testing"],
         "demand": "High", "remote": True},
    ],
    "radar": {
        "labels": ["DSA", "System Design", "Communication", "Projects", "Frameworks", "Cloud", "Testing", "DevOps"],
        "values": [55, 40, 65, 50, 60, 35, 40, 30],
    },
    "roadmap": [
        {"week": 1,  "title": "Audit & Foundation", "tasks": ["Add READMEs to GitHub projects", "LeetCode Easy x5/day", "Update LinkedIn"]},
        {"week": 4,  "title": "DSA Sprint",          "tasks": ["Neetcode 150 arrays + hashmaps", "Big-O mastery"]},
        {"week": 8,  "title": "Interview Prep",       "tasks": ["3 mock interviews on Pramp", "System design practice"]},
        {"week": 12, "title": "Apply & Negotiate",    "tasks": ["Apply to 20+ companies", "Negotiate all offers"]},
    ],
    "skillgaps": [
        {"skill": "System Design", "priority": "BLOCKER", "salaryImpact": "+₹4-8 LPA avg",
         "jobsRequiring": "73%", "timeToLearn": "4-6 weeks",
         "resources": ["System Design Interview (Alex Xu)", "Gaurav Sen YouTube", "Grokking System Design"]},
        {"skill": "DSA Medium",    "priority": "BLOCKER", "salaryImpact": "+₹3-5 LPA avg",
         "jobsRequiring": "89%", "timeToLearn": "6-8 weeks",
         "resources": ["Neetcode 150", "LeetCode", "Cracking the Coding Interview"]},
    ],
}

FALLBACK_BIZ = {
    "bizscores": {
        "viability": 65, "risk": 50, "funding": 55, "market": 70,
        "execution": 60, "label": "Promising Concept", "verdict": "Proceed with Validation",
        "pmfScore": 50, "moatScore": 38, "teamScore": 65, "timingScore": 72,
    },
    "competitors": [
        {"name": "Existing Player A", "funding": "Unknown", "strength": "Brand",
         "weakness": "Expensive for Indian market", "threat": "High", "opportunity": "Undercut on price"},
        {"name": "Existing Player B", "funding": "Bootstrapped", "strength": "Community",
         "weakness": "No mobile app", "threat": "Medium", "opportunity": "Mobile-first UX"},
    ],
    "milestones": {
        "thirty": [
            {"task": "Run 20 customer discovery interviews", "status": "todo", "metric": "3 validated pain points"},
            {"task": "Build landing page, collect 100 emails", "status": "todo", "metric": "100 signups"},
            {"task": "Get 5 people to pre-pay", "status": "todo", "metric": "₹5,000 pre-revenue"},
        ],
        "ninety": [
            {"task": "Launch MVP to waitlist", "status": "todo", "metric": "50 active users"},
            {"task": "Reach ₹50,000 MRR",     "status": "todo", "metric": "25 paying customers"},
            {"task": "Apply to 2 accelerators","status": "todo", "metric": "1 interview"},
        ],
    },
    "funding": {
        "stage": "Pre-seed / Bootstrapped",
        "target": "₹5L - ₹25L",
        "sources": ["Bootstrapping", "Friends & family", "Angel investors", "Startup India grants"],
        "runway": "12-18 months",
        "burnRate": "₹40k/month",
        "keyMilestones": ["₹50k MRR before raising", "10 reference customers"],
        "vcFirms": ["Blume Ventures", "100X.VC", "Venture Catalysts", "Antler India"],
    },
    "revenuemodel": {
        "model": "SaaS Subscription",
        "pricing": [
            {"tier": "Free",  "price": "₹0/mo",   "features": ["Core feature", "3 uses/month", "Community support"]},
            {"tier": "Basic", "price": "₹299/mo",  "features": ["Full access", "10 users", "Email support"]},
            {"tier": "Pro",   "price": "₹999/mo",  "features": ["Unlimited", "Team features", "Priority support"]},
        ],
        "projections": {
            "month6":  {"mrr": "₹25,000",   "customers": 25},
            "month12": {"mrr": "₹1,20,000", "customers": 120},
            "month24": {"mrr": "₹4,50,000", "customers": 450},
        },
    },
}


# ── Streaming generators ───────────────────────────────────────

async def stream_career(req: CareerRequest) -> AsyncGenerator[str, None]:
    if not _api_key:
        yield sse_error("GOOGLE_API_KEY is not configured on the server.")
        yield sse_event("scores",    FALLBACK_CAREER["scores"])
        yield sse_event("jobs",      FALLBACK_CAREER["jobs"])
        yield sse_event("radar",     FALLBACK_CAREER["radar"])
        yield sse_event("roadmap",   FALLBACK_CAREER["roadmap"])
        yield sse_event("skillgaps", FALLBACK_CAREER["skillgaps"])
        yield sse_event("done", {})
        return

    user_msg = f"""Evaluate this candidate profile and produce the full report:

Name: {req.name}
Major / Field: {req.major}
Experience Level: {req.year}
Subjects Studied: {req.subjects}
Projects Built: {req.projects}
Certifications: {req.certifications}
Technical Skills: {req.skills}
Target Role: {req.goal}
Work Experience: {req.experience}
Additional Context: {req.extra}

Remember: output plain text sections 01-08, then the structured JSON events."""

    try:
        full_text = await asyncio.to_thread(
            call_gemini, CAREER_SYSTEM_PROMPT, user_msg, 4096
        )
        narrative, events = parse_response(full_text, CAREER_EVENTS)

        # Stream narrative word-by-word
        for word in stream_words(narrative):
            yield sse_data(word)
            await asyncio.sleep(0.012)   # ~80 words/sec — feels live

        # Emit structured events
        order = ["scores", "jobs", "radar", "roadmap", "skillgaps"]
        fallbacks = {
            "scores":    FALLBACK_CAREER["scores"],
            "jobs":      FALLBACK_CAREER["jobs"],
            "radar":     FALLBACK_CAREER["radar"],
            "roadmap":   FALLBACK_CAREER["roadmap"],
            "skillgaps": FALLBACK_CAREER["skillgaps"],
        }
        for evt in order:
            data = events.get(evt, fallbacks[evt])
            yield sse_event(evt, data)
            await asyncio.sleep(0)

        yield sse_event("done", {})
        logger.info(f"Career stream complete for {req.name}")

    except Exception as exc:
        logger.exception(f"Career stream error: {exc}")
        yield sse_error(f"Server error: {str(exc)}")
        yield sse_event("scores", FALLBACK_CAREER["scores"])
        yield sse_event("done", {})


async def stream_startup(req: StartupRequest) -> AsyncGenerator[str, None]:
    if not _api_key:
        yield sse_error("GOOGLE_API_KEY is not configured on the server.")
        for k in ["bizscores","competitors","milestones","funding","revenuemodel"]:
            yield sse_event(k, FALLBACK_BIZ[k])
        yield sse_event("done", {})
        return

    user_msg = f"""Evaluate this startup idea and produce the full report:

Founder: {req.name}
Business Idea: {req.idea}
Problem Being Solved: {req.problem}
Target Audience: {req.audience}
Industry: {req.industry}
Budget Available: {req.budget}
Technical Skills: {req.techSkills}
Team Size: {req.teamSize}
Launch Timeline: {req.timeline}

Remember: output plain text sections 01-07 (use ₹ for all money), then the structured JSON events."""

    try:
        full_text = await asyncio.to_thread(
            call_gemini, STARTUP_SYSTEM_PROMPT, user_msg, 4096
        )
        narrative, events = parse_response(full_text, STARTUP_EVENTS)

        for word in stream_words(narrative):
            yield sse_data(word)
            await asyncio.sleep(0.012)

        order = ["bizscores", "competitors", "milestones", "funding", "revenuemodel"]
        for evt in order:
            data = events.get(evt, FALLBACK_BIZ[evt])
            yield sse_event(evt, data)
            await asyncio.sleep(0)

        yield sse_event("done", {})
        logger.info(f"Startup stream complete for {req.name}")

    except Exception as exc:
        logger.exception(f"Startup stream error: {exc}")
        yield sse_error(f"Server error: {str(exc)}")
        yield sse_event("bizscores", FALLBACK_BIZ["bizscores"])
        yield sse_event("done", {})


async def stream_chat(req: ChatRequest) -> AsyncGenerator[str, None]:
    if not _api_key:
        yield sse_data("GOOGLE_API_KEY not configured — please check the server .env file.")
        yield sse_event("done", {})
        return

    system = CHAT_SYSTEM_PROMPT
    if req.mode == "startup":
        system += "\n\nUser is in Startup Mode — focus on Indian startup ecosystem, ₹ figures, validation."

    # Build the conversation as a single string for Gemini
    history_parts = []
    for msg in req.messages[:-1]:          # all but the last
        role = "User" if msg.role == "user" else "Assistant"
        history_parts.append(f"{role}: {msg.content}")
    last = req.messages[-1].content if req.messages else ""

    history_str = "\n".join(history_parts)
    user_msg = (f"Conversation so far:\n{history_str}\n\nUser: {last}"
                if history_str else last)

    try:
        full_text = await asyncio.to_thread(
            call_gemini, system, user_msg, 1024
        )
        # Remove any stray markdown bold/headers
        clean = re.sub(r"\*\*(.+?)\*\*", r"\1", full_text)
        clean = re.sub(r"#{1,3}\s", "", clean)

        for word in stream_words(clean):
            yield sse_data(word)
            await asyncio.sleep(0.010)

        yield sse_event("done", {})

    except Exception as exc:
        logger.exception(f"Chat stream error: {exc}")
        yield sse_data(f"An error occurred: {str(exc)}")
        yield sse_event("done", {})


# ── Endpoints ──────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "Aether-api-v4",
        "model": GEMINI_MODEL,
        "api_key_set": bool(_api_key),
    }

@app.post("/api/career-evaluate")
async def career_evaluate(req: CareerRequest):
    return StreamingResponse(
        stream_career(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@app.post("/api/business-evaluate")
async def business_evaluate(req: StartupRequest):
    return StreamingResponse(
        stream_startup(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@app.post("/api/chat")
async def chat(req: ChatRequest):
    return StreamingResponse(
        stream_chat(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
