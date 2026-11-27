export const dynamic = "force-static";

export function GET() {
  return Response.json({
    schema_version: "v1",
    name_for_human: "Veriscope",
    name_for_model: "veriscope",
    description_for_human:
      "Signed, cite-able video data from YouTube — for AI agents.",
    description_for_model:
      "Use Veriscope to fetch a canonical, signed VideoDoc for any YouTube URL, search ingested videos semantically, and retrieve exact timestamped quotes. Every response is tamper-evident (content_hash) and optionally Ed25519-signed.",
    auth: { type: "oauth" },
    api: { type: "openapi", url: "https://veriscope.ai/openapi.json" },
    logo_url: "https://veriscope.ai/logo.svg",
    contact_email: "hello@desiredsolutions.me",
    legal_info_url: "https://veriscope.ai/legal",
  });
}
