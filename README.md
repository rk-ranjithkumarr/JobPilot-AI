# JobPilot AI — Job Search & Application Assistant

An AI-powered job-hunt copilot in a **single HTML file**. No installs, no build tools, no server, no dependencies. Open `index.html` and start.

## Features

| Module | What it does |
|---|---|
| 🔍 **Job Search** | Live jobs from the **Remotive** and **Arbeitnow** public APIs, keyword/category/remote filters, instant client-side search |
| ⚡ **Match scores** | Every job card is scored against your resume (keyword-overlap engine, runs locally) |
| ⭐ **Saved Jobs** | Shortlist jobs you like; stored in your browser |
| 🚀 **Applications** | Kanban pipeline (Wishlist → Applied → Interview → Offer / Rejected) with drag & drop, per-card notes and history |
| 📄 **My Resume** | Profile + resume text used by every AI tool; export/import full backup as JSON |
| 🧠 **AI Studio** | 7 tools: cover letter, cold outreach email, resume tailoring + ATS checklist, interview prep, deep match analysis, 90-day career plan, free-form Q&A |
| ⚙️ **Settings** | Connect any OpenAI-compatible LLM; test connection; data export/reset |

## Two AI modes

1. **LLM mode** — bring an API key from any OpenAI-compatible provider:
   - **OpenAI** (`gpt-4o-mini`)
   - **Groq** (free tier, `llama-3.3-70b-versatile`)
   - **OpenRouter** (free models available)
   - **Ollama / LM Studio** (local models, no cloud)
   - Custom base URL for anything else
2. **Template mode** — default, works fully offline with zero keys. Every tool has a deterministic, professionally structured fallback. If an LLM call fails, the app silently falls back to template mode and tells you so.

## Privacy

- All your data (resume, saved jobs, pipeline, settings, API keys) lives **only in your browser's localStorage**.
- In LLM mode, only job posting text + your resume text are sent to the provider you choose. No middleman server.
- Template mode makes zero network calls for generation.
- Use **My Resume → Export backup** before switching devices or clearing browser data.

## Run it

- **Double-click `index.html`** — that's it. Works from `file://`, any static host, or a preview pane.

### Developing / rebuilding

Sources live in `src/` (modular CSS + JS). After editing them:

```bash
bash build.sh     # inlines everything into the single-file index.html
```

## Job data sources

- [Remotive public API](https://remotive.com/api-documentation) — remote jobs worldwide
- [Arbeitnow job board API](https://www.arbeitnow.com/api/job-board-api) — jobs in Germany/EU

If both APIs are unreachable, the app automatically shows a small offline demo dataset so nothing ever looks broken.

## Tech notes

- Zero dependencies, zero build tooling required (build.sh is a convenience)
- Vanilla ES2017+, hash-based SPA router, localStorage persistence
- Clean separation: `store.js` (state) · `jobs.js` (data + matching) · `ai.js` (LLM + template engines) · `app*.js` (views)
