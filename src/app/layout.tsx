import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://veriscope.ai"),
  title: {
    default: "Veriscope — the agent's verifiable lens on YouTube",
    template: "%s · Veriscope",
  },
  description:
    "Agent-native, cite-able, signed video data from YouTube — for AI agents and the humans who build with them.",
  openGraph: {
    type: "website",
    siteName: "Veriscope",
    title: "Veriscope",
    description: "Agent-native, cite-able, signed video data from YouTube.",
  },
  twitter: { card: "summary_large_image", creator: "@desiredsols" },
  other: {
    "ai-plugin": "/.well-known/ai-plugin.json",
    "mcp": "/.well-known/mcp.json",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
