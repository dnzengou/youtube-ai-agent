# Veriscope

**The agent's verifiable lens on YouTube.**

Signed, cite-able video data — REST + MCP — for AI agents and the humans who build with them. One primitive (`VideoDoc`), two surfaces, with first-class agent discoverability (`llms.txt`, `/.well-known/*`, OpenAPI, signed responses).

A Desired Solutions venture · Agent Economy track.

See [`SPEC.md`](./SPEC.md) for the full product spec.

## Stack

Next 15 (App Router) · Vercel AI SDK + AI Gateway · Neon Postgres + pgvector · Vercel Queues · MCP SDK · Tailwind · deployed on Vercel.

## Dev

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Surfaces

| | |
|---|---|
| Landing | `/` |
| REST API | `/api/v1/*` (see `/openapi.json`) |
| MCP | `/mcp` (manifest at `/.well-known/mcp.json`) |
| Agent discovery | `/llms.txt`, `/ai.txt`, `/.well-known/ai-plugin.json` |

## Build order

The ROI-ranked build order lives in `SPEC.md §6`. This commit is **step 1 (scaffold)**.
