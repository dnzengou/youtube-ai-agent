export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "veriscope",
    version: "0.1.0",
    transport: "http",
    endpoint: "https://veriscope.ai/mcp",
    description: "Agent-native, signed YouTube video data.",
    tools: [
      { name: "get_video", description: "Fetch a signed VideoDoc by YouTube URL or id." },
      { name: "search_videos", description: "Semantic search across ingested videos." },
      { name: "get_quote_at", description: "Resolve a timestamp into a verifiable quote." },
      { name: "get_claims", description: "List extracted claims with supporting quotes." },
    ],
  });
}
