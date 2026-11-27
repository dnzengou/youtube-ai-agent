import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <nav className="mb-16 flex items-center justify-between text-sm">
        <span className="font-mono tracking-tight">veriscope</span>
        <div className="flex gap-6 opacity-70">
          <Link href="/docs">docs</Link>
          <Link href="/mcp">mcp</Link>
          <Link href="/pricing">pricing</Link>
        </div>
      </nav>

      <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        The agent's verifiable lens on YouTube.
      </h1>

      <p className="mt-6 max-w-xl text-lg opacity-80">
        Signed, cite-able video data — REST and MCP — for the agents you ship
        and the content you publish. One primitive, two surfaces.
      </p>

      <form action="/ingest" method="post" className="mt-10 flex gap-2">
        <input
          name="url"
          type="url"
          placeholder="Paste a YouTube URL"
          className="w-full rounded-md border border-current/20 bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-current"
          required
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Scope it
        </button>
      </form>

      <div className="mt-16 grid gap-6 border-t border-current/10 pt-10 sm:grid-cols-3">
        <Feature title="Feed" body="VideoDoc JSON, signed. Call it from any agent." />
        <Feature title="Chat" body="Ask the video. Every answer carries a timestamp and the quote." />
        <Feature title="Repurpose" body="LinkedIn, X, newsletter, shorts — provenance on every draft." />
      </div>

      <footer className="mt-24 flex items-center justify-between text-xs opacity-60">
        <span>A Desired Solutions venture · Agent Economy</span>
        <Link href="https://desiredsolutions.me">desiredsolutions.me</Link>
      </footer>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-wider opacity-60">{title}</div>
      <div className="mt-2 text-sm">{body}</div>
    </div>
  );
}
