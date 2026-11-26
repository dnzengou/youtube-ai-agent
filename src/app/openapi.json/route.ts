export const dynamic = "force-static";

export function GET() {
  return Response.json({
    openapi: "3.1.0",
    info: {
      title: "Veriscope API",
      version: "0.1.0",
      description:
        "Signed, cite-able video data from YouTube. Every response carries content_hash; paid plans add Ed25519 signatures.",
      contact: { email: "hello@desiredsolutions.me" },
    },
    servers: [{ url: "https://veriscope.ai" }],
    paths: {
      "/api/v1/ingest": {
        post: {
          summary: "Ingest a YouTube URL into a VideoDoc.",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url"],
                  properties: { url: { type: "string", format: "uri" } },
                },
              },
            },
          },
          responses: { "202": { description: "Job accepted" } },
        },
      },
      "/api/v1/video/{id}": {
        get: {
          summary: "Fetch a signed VideoDoc.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "VideoDoc" } },
        },
      },
      "/api/v1/search": {
        get: {
          summary: "Semantic search across ingested videos.",
          parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "VideoDoc[]" } },
        },
      },
    },
  });
}
