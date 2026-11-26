import Link from "next/link";

export const metadata = { title: "Pricing" };

const plans = [
  {
    name: "Free",
    price: "€0",
    tagline: "Kick the tires.",
    features: ["50 units / mo", "Watermarked outputs", "Public share pages only"],
  },
  {
    name: "Pay-as-you-go",
    price: "€0.02 / unit",
    tagline: "For agents in production.",
    features: ["Signed responses", "No seat limit", "API + MCP"],
  },
  {
    name: "Studio",
    price: "€29 /mo + usage",
    tagline: "For teams shipping agent features.",
    features: ["1,500 units included", "€0.015 overage", "API keys · webhooks"],
    featured: true,
  },
  {
    name: "Team seat",
    price: "+€12 / seat / mo",
    tagline: "Add the human app.",
    features: ["Chat · Repurpose · Feed", "Shared workspaces", "Digest emails"],
  },
];

export default function Pricing() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="font-mono text-xs opacity-60">← veriscope</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-3 max-w-xl opacity-80">
        One unit = one ingest, one generation, 100 search calls, or 1,000 MCP tool calls.
        Agents consume them; humans use them on the seat add-on.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={
              "rounded-lg border p-6 " +
              (p.featured
                ? "border-accent bg-accent/5"
                : "border-current/15")
            }
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <span className="font-mono text-sm opacity-80">{p.price}</span>
            </div>
            <p className="mt-1 text-sm opacity-70">{p.tagline}</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="opacity-90">· {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs opacity-60">
        Need a signed-license agreement for training-set use? Email{" "}
        <a className="underline" href="mailto:hello@desiredsolutions.me">hello@desiredsolutions.me</a>.
      </p>
    </main>
  );
}
