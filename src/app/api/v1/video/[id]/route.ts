import { store } from "@/lib/store";
import { ingest, IngestError } from "@/lib/ingest";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  let doc = await store.get(id);
  if (!doc) {
    try {
      doc = await ingest(id);
    } catch (e) {
      if (e instanceof IngestError) return Response.json({ error: e.code }, { status: 404 });
      return Response.json({ error: "ingest_failed" }, { status: 500 });
    }
  }
  return Response.json(doc);
}
