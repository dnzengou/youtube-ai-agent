import { store } from "@/lib/store";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  const t = Number(u.searchParams.get("t"));
  if (!id || Number.isNaN(t)) return Response.json({ error: "missing_params" }, { status: 400 });

  const doc = await store.get(id);
  if (!doc) return Response.json({ error: "not_found" }, { status: 404 });

  // Nearest segment whose start is <= t, then collect ~10s window.
  const idx = doc.transcript.findIndex((s, i) => {
    const next = doc.transcript[i + 1];
    return s.t <= t && (!next || next.t > t);
  });
  if (idx < 0) return Response.json({ error: "out_of_range" }, { status: 404 });

  const window = doc.transcript.slice(idx, idx + 4);
  const quote = window.map((s) => s.text).join(" ");
  return Response.json({
    video_id: id,
    t: doc.transcript[idx].t,
    quote,
    verify_url: `${doc.url}&t=${Math.floor(doc.transcript[idx].t)}`,
    content_hash: doc.content_hash,
  });
}
