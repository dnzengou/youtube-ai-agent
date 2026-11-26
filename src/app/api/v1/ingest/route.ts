import { z } from "zod";

const Body = z.object({ url: z.string().url() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "invalid_url" }, { status: 400 });
  }
  // TODO(step 2): enqueue on Vercel Queues; fetch captions; synthesize VideoDoc.
  const id = extractYoutubeId(parsed.data.url);
  if (!id) return Response.json({ error: "not_a_youtube_url" }, { status: 400 });
  return Response.json({ job_id: `job_${id}_${Date.now()}`, video_id: id }, { status: 202 });
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
