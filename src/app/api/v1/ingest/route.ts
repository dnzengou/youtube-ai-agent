import { z } from "zod";
import { extractId } from "@/lib/youtube";
import { ingest, IngestError } from "@/lib/ingest";

const Body = z.object({ url: z.string().url() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: "invalid_url" }, { status: 400 });

  const id = extractId(parsed.data.url);
  if (!id) return Response.json({ error: "not_a_youtube_url" }, { status: 400 });

  try {
    const doc = await ingest(id);
    return Response.json(doc, { status: 200 });
  } catch (e) {
    if (e instanceof IngestError) return Response.json({ error: e.code }, { status: 422 });
    return Response.json({ error: "ingest_failed" }, { status: 500 });
  }
}
