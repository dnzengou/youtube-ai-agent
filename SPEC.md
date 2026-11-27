# Veriscope — Product Spec

**Brand.** Veriscope (`veriscope.ai` target). *Veri* + *scope*: the agent's verifiable lens on video. A Desired Solutions venture (Agent Economy track).

**One-liner.** An agent-native layer on top of YouTube: structured, MCP-ready, signed video data that other agents can consume — with a thin human app on the same core for chat and content repurposing.

**Why this order.** The agent feed is the moat and the SEO/GEO story (agent-detectable, verifiable, cite-able). The human app is a wrapper that proves the feed works and monetizes it. Building feed first means the human features are ~50% free.

---

## 1. Users and jobs

| User | Job-to-be-done | Pays for |
|---|---|---|
| AI agent / builder | "Give me clean, cite-able YouTube data I can call" | API calls, MCP seat |
| Creator / marketer | "Turn this video into 5 posts + a newsletter" | Monthly seat |
| Researcher / PM | "Chat with this channel, pull the quote with timestamp" | Monthly seat, team |

Removed: separate "summarize" tool. Summary is one output of the repurpose pipeline.

---

## 2. Core (Phase 1) — the agent-readable feed

A canonical, verifiable JSON representation of a YouTube URL.

```
GET /api/v1/video/{id}        -> VideoDoc
GET /api/v1/channel/{id}      -> ChannelDoc
POST /api/v1/ingest           -> { url } -> VideoDoc (async job)
GET /api/v1/search?q=...      -> VideoDoc[] (semantic, across ingested)
```

`VideoDoc` schema (versioned, stable):
- `id`, `url`, `title`, `channel`, `published_at`, `duration_s`
- `transcript`: `[{t, text, speaker?}]` with timestamps
- `chapters`: `[{t_start, t_end, title, summary}]`
- `entities`: people, orgs, products, places (linked where possible)
- `claims`: `[{text, t, confidence, supporting_quote}]` — for cite-ability
- `embeddings_ref`: pointer, not inline
- `provenance`: `{source: "youtube", fetched_at, transcript_source, model_versions}`
- `content_hash`: sha256 of normalized transcript — tamper-evident
- `signature`: optional Ed25519 signature over `content_hash` — trust layer

**MCP server** (`/mcp`) exposes: `get_video`, `search_videos`, `get_channel`, `get_claims`, `get_quote_at`. One codebase, two surfaces (REST + MCP).

**Agent-SEO / GEO surface** (standalone module, reusable):
- `/.well-known/ai-plugin.json`, `/.well-known/mcp.json`
- `llms.txt` and `llms-full.txt` at root
- JSON-LD `VideoObject` + `ClaimReview` on every public page
- OpenAPI at `/openapi.json`
- Sitemap with `<video:video>` entries
- `ai.txt` policy file (what's allowed for training vs retrieval)
- Signed `agent-manifest.json` (capabilities, rate limits, auth, contact)

Credibility/traceability components:
- Every generated output carries `{source_video_id, timestamp, quote, model, prompt_hash}`.
- "Verify" button on any claim -> jumps to the exact second on YouTube.
- Public changelog + content-hash log.

---

## 3. Human app (Phase 2) — thin wrapper, one surface

Single page: paste URL → one workspace with three tabs, all powered by the same `VideoDoc`:

1. **Chat** — ask the video/channel; answers always cite `{t, quote}`.
2. **Repurpose** — one-click: LinkedIn post, X thread, newsletter section, SEO article, shorts script. Each output is editable, carries provenance footer.
3. **Feed** — the raw `VideoDoc` (download JSON, copy MCP snippet, "use in your agent").

Removed from a typical YT-AI tool: separate "summarize" page, separate "transcript" page, standalone "chapters" page, "export to 12 platforms" grid. All collapse into the three tabs above.

### Onboarding (the AI steward)

A single conversational onboarding, not a tour. First visit:

> **Steward:** "Paste a YouTube URL or a channel. I'll show you one of three things it's good for — pick what fits."

Flow:
1. User pastes URL.
2. Ingest runs in background (progress line, no modal).
3. Steward asks one question: *"Are you here to (a) chat with it, (b) repurpose it, or (c) feed it to your own agent?"*
4. Lands them on that tab with the output already generated.
5. Dismisses itself. Returns only when invoked or when user is idle on a new primitive.

No tooltips, no "take a tour," no empty states with 6 CTAs. The steward IS the empty state.

---

## 4. Stack (lightweight, Vercel-native)

- **Runtime:** Next.js 15 App Router, Node + Edge where it helps, deployed on Vercel.
- **AI:** Vercel AI SDK + AI Gateway (one key, model-swappable, budgets).
- **DB:** Neon Postgres via Vercel Marketplace (one store; pgvector for embeddings).
- **Queue/jobs:** Vercel Queues for ingest; Vercel Workflow for multi-step repurpose.
- **Transcripts:** YouTube captions API first; Whisper fallback via Gateway.
- **Auth:** Clerk (Vercel native).
- **Payments:** Stripe (Marketplace).
- **MCP:** `@modelcontextprotocol/sdk`, served at `/mcp` from a Vercel Function.
- **Analytics:** Vercel Web Analytics + Custom Metrics on every ingest/generation.
- **Observability:** `@vercel/otel` + `vercel traces`.
- **UI:** Tailwind + shadcn/ui, 1 primary color, dark/light, no component library sprawl.

Single points of failure removed by design: AI Gateway means no hard provider lock; Marketplace DB means we can swap; MCP + REST means two independent surfaces.

---

## 5. Pricing — API-first, usage-based (with human-app seats on top)

Primary motion: metered API/MCP. Agents consume units; revenue compounds with consumption (DS compound-revenue doctrine, RRSS → ARM).

**Usage units (one price for both API and human-app actions):**
- 1 unit = 1 ingest OR 1 generation OR 100 search calls OR 1k MCP tool calls.
- Transparent dashboard, hard cap toggle, prepaid credits.

**Plans:**
- **Free:** 50 units/mo, watermarked outputs, public share pages only, no signed responses.
- **Pay-as-you-go:** €0.02 / unit, signed responses, no seat limit on API.
- **Studio (€29/mo + usage):** 1,500 units included, lower overage (€0.015), API keys, webhooks.
- **Team seat add-on (€12/seat/mo):** human app, shared workspaces, digest emails. Layered on any paid plan.

Why this over flat seats: agents are the primary buyer, their spend scales with their own product's traction (compound), and the seat add-on captures the human workflow without becoming the primary gate.

Low-hanging revenue hooks implemented day 1:
- Public share pages for every generated output (viral loop, back-links for SEO).
- "Add to your agent in 30s" button → copies MCP config.
- Weekly digest email of a tracked channel → upsell to Team.

---

## 6. Build order (ROI-ranked)

1. **Repo scaffold** — Next 15, Tailwind, shadcn, AI SDK, Gateway, env scaffolding, CI, `vercel.json`.
2. **Ingest pipeline** — URL → transcript → `VideoDoc` → Neon + pgvector. Queue-backed.
3. **REST + MCP** — one service, two transports. OpenAPI + MCP manifest.
4. **Agent-SEO/GEO module** — `/.well-known/*`, `llms.txt`, JSON-LD, sitemap, signed manifest. Packaged as `packages/agent-seo` so it's reusable.
5. **Human app (3 tabs)** — Chat, Repurpose, Feed. Shared `VideoDoc` store.
6. **Steward onboarding** — one streaming conversational component, not a tour.
7. **Auth + paywall** — Clerk + Stripe + plan gates.
8. **Share pages + digest email** — viral + retention loops.
9. **Verification UI** — claim → timestamped quote jump, content-hash badge.
10. **Observability + custom metrics** — ingest latency, generation cost per user, abuse signals.

---

## 7. What we are NOT building

- A video editor.
- A download-the-mp4 tool.
- A 12-platform publishing dashboard.
- A separate "chapters" product.
- Bring-your-own-model UI (Gateway handles it invisibly).
- A mobile app (PWA only).

---

## 8. Decisions locked

- **Name:** Veriscope.
- **Monetization:** API-first usage-based + optional human-app seat add-on.
- **Steward voice:** Desired Solutions brand voice (loaded via `ds-brand-voice` skill when writing copy).
