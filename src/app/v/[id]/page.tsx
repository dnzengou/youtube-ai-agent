import { ingest, IngestError } from "@/lib/ingest";
import Link from "next/link";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let doc;
  try {
    doc = await ingest(id);
  } catch (e) {
    const code = e instanceof IngestError ? e.code : "ingest_failed";
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-2xl font-semibold">Couldn't scope this one.</h1>
        <p className="mt-3 text-sm opacity-70">
          Reason: <code className="font-mono">{code}</code>. If the video has no
          captions, Whisper fallback lands in step 3.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          ← back
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-mono text-xs opacity-60 hover:opacity-100">
        ← veriscope
      </Link>
      <h1 className="mt-6 text-2xl font-semibold leading-tight">{doc.title}</h1>
      <div className="mt-2 text-sm opacity-70">
        {doc.channel.name} · {Math.round(doc.duration_s / 60)} min · {doc.transcript.length} segments
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-xs">
        <a
          href={`/api/v1/video/${doc.id}`}
          className="rounded-md border border-current/20 px-3 py-1.5 font-mono hover:bg-current/5"
        >
          GET /api/v1/video/{doc.id}
        </a>
        <code className="rounded-md border border-current/10 px-3 py-1.5 font-mono opacity-70">
          hash: {doc.content_hash.slice(0, 16)}…
        </code>
        {doc.signature && (
          <code className="rounded-md border border-accent/40 px-3 py-1.5 font-mono text-accent">
            signed
          </code>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider opacity-60">Transcript</h2>
        <ol className="mt-3 space-y-1 text-sm">
          {doc.transcript.slice(0, 80).map((s, i) => (
            <li key={i} className="flex gap-3">
              <a
                href={`${doc.url}&t=${Math.floor(s.t)}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 font-mono text-xs opacity-50 hover:text-accent"
              >
                {fmt(s.t)}
              </a>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
        {doc.transcript.length > 80 && (
          <p className="mt-3 text-xs opacity-60">
            Showing first 80 of {doc.transcript.length}. Full doc via the API link above.
          </p>
        )}
      </section>
    </main>
  );
}

function fmt(t: number) {
  const m = Math.floor(t / 60),
    s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
