# Aether — AI Career Coach & Startup Venture Advisor

A production-quality, full-stack AI platform built with **Next.js 14**, **FastAPI**, and **Claude Sonnet**. Aether provides personalized career guidance, skill gap analysis, learning roadmaps, interview preparation, startup viability scoring, and business strategy through real-time streamed AI analysis.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Career Intelligence** | Readiness scores (Technical, Communication, Projects, Interview), job match cards with salary ranges, skill gap analysis |
| **Startup Mentor** | Viability gauge, risk meter, competitor landscape, 30/90-day milestones, funding strategy |
| **Real-time Streaming** | Server-Sent Events — narrative + structured JSON events streamed simultaneously |
| **AI Chat** | Persistent multi-turn chat with Claude, mode-aware (career or startup context) |
| **Gamification** | XP system, levels, streak tracking, 6 unlockable achievements, confetti animations |
| **Analytics Dashboard** | Skill radar chart, progress bars, score history |
| **Dark / Light Mode** | Persisted preference, synced to `<html>` class |
| **Print to PDF** | Print-friendly CSS layout for saving reports |
| **Accessibility** | WCAG 2.1 AA — semantic HTML, keyboard nav, ARIA labels, focus rings |
| **Graceful Fallbacks** | Demo scores returned when API key missing or rate-limited |

---

## 🏗️ Architecture

```
Aether/
├── docker-compose.yml
├── .gitignore
├── README.md
├── backend/
│   ├── main.py              # FastAPI: /api/health, /career-evaluate, /business-evaluate, /api/chat
│   ├── prompts.py           # All Claude system prompts (versioned separately)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx       # Root HTML shell + metadata
    │   │   ├── page.tsx         # Entry point → ClientRoot
    │   │   ├── ClientRoot.tsx   # View router + dark mode sync
    │   │   └── globals.css      # Tailwind base + print styles
    │   ├── components/
    │   │   ├── ui/              # Button, Card, ProgressRing, SkeletonCard, StreamingText
    │   │   ├── layout/          # Header, Sidebar
    │   │   ├── career/          # CareerForm
    │   │   ├── startup/         # StartupForm
    │   │   ├── dashboard/       # HeroBanner, CareerDashboard, StartupDashboard,
    │   │   │                    # AchievementsPanel, SettingsPanel
    │   │   └── chat/            # ChatPanel
    │   ├── hooks/               # useCareerStream, useStartupStream, useChatStream
    │   ├── lib/                 # utils.ts, api.ts
    │   ├── store/               # Zustand global store (persisted)
    │   └── types/               # Shared TypeScript interfaces
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── next.config.js
```

### SSE Event Protocol

The backend streams two kinds of events over a single HTTP response:

```
# Plain text tokens (narrative markdown)
data: ## Career Readiness Analysis\n\n
data: Your profile shows strong communication skills...

# Named structured events (charts, scores, metadata)
event: scores
data: {"overall":72,"technical":68,"communication":80,...}

event: jobs
data: [{"title":"Software Engineer","match":78,...}]

event: radar
data: {"labels":["DSA","System Design",...],"values":[65,45,...]}

event: roadmap
data: [{"week":1,"title":"Foundation","tasks":[...]}]

event: done
data: {}
```

The frontend `api.ts` consumer parses both types in a single `ReadableStream` loop, routing text tokens to the narrative state and named events to their respective data slices.

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- An [Anthropic API key](https://console.anthropic.com)

### 1. Configure

```bash
git clone <repo-url> Aether && cd Aether
cp backend/.env.example backend/.env
# Edit backend/.env → set ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Run

```bash
docker compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health check**: http://localhost:8000/api/health

### Local Development (no Docker)

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your key
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## ⚙️ Environment Variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key from console.anthropic.com |
| `ALLOWED_ORIGINS` | Optional | Comma-separated CORS origins (default: localhost:3000) |

### Frontend (build-time / `.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `""` | Backend URL. Empty = use Next.js rewrite proxy. |

---

## 🔌 API Reference

### `GET /api/health`
```json
{ "status": "ok", "service": "Aether-api", "api_key_set": true }
```

### `POST /api/career-evaluate`
**Request:**
```json
{
  "name": "Alex",
  "major": "Computer Science",
  "year": "Final Year",
  "subjects": "DSA, OS, DBMS",
  "projects": "E-commerce site with React/Node",
  "certifications": "AWS Cloud Practitioner",
  "skills": "Python, JavaScript, React, SQL",
  "goal": "Software Engineer",
  "experience": "6-month internship",
  "extra": "Targeting product companies"
}
```
**Response:** `text/event-stream` — text tokens + `scores`, `jobs`, `radar`, `roadmap`, `done` events.

### `POST /api/business-evaluate`
**Request:**
```json
{
  "name": "Jordan",
  "idea": "AI-powered study planner for college students",
  "problem": "Students waste time planning instead of studying",
  "audience": "College students globally",
  "industry": "EdTech",
  "budget": "$5k - $25k",
  "techSkills": "Full-stack developer",
  "teamSize": "Solo founder",
  "timeline": "MVP in 3 months"
}
```
**Response:** `text/event-stream` — text tokens + `bizscores`, `competitors`, `milestones`, `funding`, `done` events.

### `POST /api/chat`
**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I prepare for FAANG interviews?" }
  ],
  "mode": "career"
}
```
**Response:** `text/event-stream` — text tokens + `done` event.

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `brand-500` | `#6366f1` | Primary accent, buttons, rings |
| `brand-600` | `#4f46e5` | CTAs, gradients |
| `accent-purple` | `#8b5cf6` | Startup mode accent |
| `surface-dark` | `#0f0f11` | Dark mode background |
| `surface-dark-card` | `#18181b` | Dark mode card surface |
| `Inter` | — | Body copy |
| `JetBrains Mono` | — | Code, monospace elements |

---

## 🔐 Security

- `ANTHROPIC_API_KEY` only ever exists in `backend/.env` — never in frontend code or Docker build args
- `.env` is in `.gitignore`
- Docker runner uses a non-root `nextjs` user (uid 1001)
- CORS restricted to `ALLOWED_ORIGINS`

---

## 📝 License

MIT
