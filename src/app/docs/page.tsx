import Link from "next/link";

export const metadata = { title: "Docs" };

export default function Docs() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-mono text-xs opacity-60">← veriscope</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Docs</h1>
      <p className="mt-3 opacity-80">
        Two surfaces over the same <code className="font-mono">VideoDoc</code> primitive.
      </p>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider opacity-60">REST</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><code className="font-mono">POST /api/v1/ingest</code> — body: <code>{"{ url }"}</code>.</li>
          <li><code className="font-mono">GET  /api/v1/video/[id]</code> — signed VideoDoc.</li>
          <li><code className="font-mono">GET  /api/v1/search?q=…</code> — across ingested videos.</li>
          <li><code className="font-mono">GET  /api/v1/quote?id=…&t=…</code> — verifiable quote at timestamp.</li>
          <li>OpenAPI: <Link href="/openapi.json" className="underline">/openapi.json</Link>.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider opacity-60">MCP</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>Endpoint: <code className="font-mono">POST /mcp</code> (JSON-RPC 2.0).</li>
          <li>Manifest: <Link href="/.well-known/mcp.json" className="underline">/.well-known/mcp.json</Link>.</li>
          <li>Tools: <code>get_video</code>, <code>search_videos</code>, <code>get_quote_at</code>.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider opacity-60">Trust</h2>
        <p className="mt-3 text-sm">
          Every <code>VideoDoc</code> carries <code>content_hash</code> (sha256 over
          normalized transcript). Setting <code className="font-mono">VERISCOPE_SIGNING_KEY</code>
          enables Ed25519 signatures on responses.
        </p>
      </section>
    </main>
  );
}
