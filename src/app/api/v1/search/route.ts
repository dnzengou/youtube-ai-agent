import { store } from "@/lib/store";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase();
  if (!q) return Response.json({ error: "missing_q" }, { status: 400 });

  // Lexical fallback until pgvector is wired (step 3).
  const all = await store.list(500);
  const hits = all.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.transcript.some((s) => s.text.toLowerCase().includes(q)),
  );
  return Response.json({ results: hits.slice(0, 20) });
}
