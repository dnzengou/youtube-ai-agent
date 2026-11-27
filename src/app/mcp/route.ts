import { z } from "zod";
import { store } from "@/lib/store";
import { ingest } from "@/lib/ingest";
import { extractId } from "@/lib/youtube";

const TOOLS = [
  {
    name: "get_video",
    description: "Fetch a signed VideoDoc by YouTube URL or 11-char id.",
    inputSchema: {
      type: "object",
      properties: { url_or_id: { type: "string" } },
      required: ["url_or_id"],
    },
  },
  {
    name: "search_videos",
    description: "Lexical/semantic search across ingested videos.",
    inputSchema: {
      type: "object",
      properties: { q: { type: "string" } },
      required: ["q"],
    },
  },
  {
    name: "get_quote_at",
    description: "Resolve a timestamp into a verifiable quote with a jump URL.",
    inputSchema: {
      type: "object",
      properties: { video_id: { type: "string" }, t: { type: "number" } },
      required: ["video_id", "t"],
    },
  },
];

const Req = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.any().optional(),
});

function ok(id: unknown, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result });
}
function err(id: unknown, code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

export async function POST(req: Request) {
  const body = Req.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return err(null, -32700, "parse_error");
  const { id, method, params } = body.data;

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: "2025-06-18",
        serverInfo: { name: "veriscope", version: "0.2.0" },
        capabilities: { tools: {} },
      });
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const name = params?.name as string | undefined;
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      try {
        if (name === "get_video") {
          const key = String(args.url_or_id ?? "");
          const vid = extractId(key) ?? (key.length === 11 ? key : null);
          if (!vid) return err(id, -32602, "invalid_url_or_id");
          const doc = await ingest(vid);
          return ok(id, { content: [{ type: "text", text: JSON.stringify(doc) }] });
        }
        if (name === "search_videos") {
          const q = String(args.q ?? "").toLowerCase();
          const hits = (await store.list(500))
            .filter((d) => d.title.toLowerCase().includes(q))
            .slice(0, 20)
            .map((d) => ({ id: d.id, title: d.title, url: d.url }));
          return ok(id, { content: [{ type: "text", text: JSON.stringify(hits) }] });
        }
        if (name === "get_quote_at") {
          const doc = await store.get(String(args.video_id));
          if (!doc) return err(id, -32602, "not_found");
          const t = Number(args.t);
          const seg = doc.transcript.find((s, i) => {
            const n = doc.transcript[i + 1];
            return s.t <= t && (!n || n.t > t);
          });
          if (!seg) return err(id, -32602, "out_of_range");
          return ok(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  quote: seg.text,
                  t: seg.t,
                  verify_url: `${doc.url}&t=${Math.floor(seg.t)}`,
                  content_hash: doc.content_hash,
                }),
              },
            ],
          });
        }
        return err(id, -32601, "method_not_found");
      } catch (e) {
        return err(id, -32000, e instanceof Error ? e.message : "tool_error");
      }
    }
    default:
      return err(id, -32601, "method_not_found");
  }
}

export async function GET() {
  return Response.json({
    name: "veriscope",
    transport: "http",
    endpoint: "/mcp",
    tools: TOOLS.map((t) => t.name),
    hint: "POST JSON-RPC 2.0: initialize, tools/list, tools/call.",
  });
}
