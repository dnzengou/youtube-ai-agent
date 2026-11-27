export type RawSegment = { t: number; text: string };
export type VideoMeta = {
  id: string;
  title: string;
  channel: { id: string; name: string };
  published_at: string;
  duration_s: number;
};

export function extractId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Fetch oEmbed metadata (public, no key). Returns null for private / removed videos.
export async function fetchMeta(id: string): Promise<Partial<VideoMeta> | null> {
  const r = await fetch(
    `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${id}&format=json`,
    { cache: "no-store" },
  );
  if (!r.ok) return null;
  const j = (await r.json()) as { title: string; author_name: string; author_url: string };
  return {
    id,
    title: j.title,
    channel: { id: j.author_url?.split("/").pop() ?? "", name: j.author_name },
  };
}

// Fetch auto-captions via YouTube's public timedtext endpoint.
// Returns [] if the video has no captions; caller should fall back to Whisper.
export async function fetchCaptions(id: string, lang = "en"): Promise<RawSegment[]> {
  const r = await fetch(
    `https://www.youtube.com/api/timedtext?v=${id}&lang=${lang}&fmt=json3`,
    { cache: "no-store" },
  );
  if (!r.ok) return [];
  const text = await r.text();
  if (!text.trim()) return [];
  try {
    const j = JSON.parse(text) as { events?: Array<{ tStartMs: number; segs?: Array<{ utf8: string }> }> };
    return (j.events ?? [])
      .map((e) => ({
        t: (e.tStartMs ?? 0) / 1000,
        text: (e.segs ?? []).map((s) => s.utf8).join("").replace(/\n/g, " ").trim(),
      }))
      .filter((s) => s.text.length > 0);
  } catch {
    return [];
  }
}
