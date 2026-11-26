import { z } from "zod";
import { createHash } from "node:crypto";

export const TranscriptSegment = z.object({
  t: z.number(),
  text: z.string(),
  speaker: z.string().optional(),
});

export const Chapter = z.object({
  t_start: z.number(),
  t_end: z.number(),
  title: z.string(),
  summary: z.string().optional(),
});

export const Claim = z.object({
  text: z.string(),
  t: z.number(),
  confidence: z.number().min(0).max(1),
  supporting_quote: z.string(),
});

export const VideoDoc = z.object({
  schema_version: z.literal("veriscope/videodoc/v1"),
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  channel: z.object({ id: z.string(), name: z.string() }),
  published_at: z.string(),
  duration_s: z.number(),
  transcript: z.array(TranscriptSegment),
  chapters: z.array(Chapter),
  entities: z.array(z.object({ name: z.string(), type: z.string() })),
  claims: z.array(Claim),
  provenance: z.object({
    source: z.literal("youtube"),
    fetched_at: z.string(),
    transcript_source: z.enum(["captions", "whisper"]),
    model_versions: z.record(z.string(), z.string()),
  }),
  content_hash: z.string(),
  signature: z.string().optional(),
});
export type VideoDoc = z.infer<typeof VideoDoc>;

export function normalizeTranscript(segments: { t: number; text: string }[]): string {
  return segments
    .map((s) => `${s.t.toFixed(2)}\t${s.text.trim()}`)
    .join("\n");
}

export function contentHash(segments: { t: number; text: string }[]): string {
  return createHash("sha256").update(normalizeTranscript(segments)).digest("hex");
}
