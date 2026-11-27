import { contentHash, type VideoDoc } from "./videodoc";
import { fetchCaptions, fetchMeta, type RawSegment } from "./youtube";
import { signContentHash } from "./sign";
import { store } from "./store";

export class IngestError extends Error {
  constructor(public code: "not_found" | "no_transcript" | "bad_url", message?: string) {
    super(message ?? code);
  }
}

export async function ingest(id: string): Promise<VideoDoc> {
  const cached = await store.get(id);
  if (cached) return cached;

  const meta = await fetchMeta(id);
  if (!meta?.title) throw new IngestError("not_found");

  const segments: RawSegment[] = await fetchCaptions(id);
  if (segments.length === 0) {
    // step 3: enqueue Whisper fallback via Vercel Queues + AI Gateway
    throw new IngestError("no_transcript");
  }

  const hash = contentHash(segments);
  const now = new Date().toISOString();
  const doc: VideoDoc = {
    schema_version: "veriscope/videodoc/v1",
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    title: meta.title,
    channel: meta.channel ?? { id: "", name: "" },
    published_at: now, // oEmbed doesn't expose this; Data API wires exact value in step 3
    duration_s: segments.length > 0 ? segments[segments.length - 1].t : 0,
    transcript: segments,
    chapters: [], // step 4: chapter synthesis via AI Gateway
    entities: [], // step 4
    claims: [], // step 4
    provenance: {
      source: "youtube",
      fetched_at: now,
      transcript_source: "captions",
      model_versions: {},
    },
    content_hash: hash,
    signature: signContentHash(hash),
  };
  await store.put(doc);
  return doc;
}
