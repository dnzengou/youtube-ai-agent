import { extractId } from "@/lib/youtube";

// Landing-form target. Redirects to the workspace once we have an id.
export async function POST(req: Request) {
  const form = await req.formData();
  const url = String(form.get("url") ?? "");
  const id = extractId(url);
  if (!id) {
    return Response.redirect(new URL("/?error=bad_url", req.url), 303);
  }
  return Response.redirect(new URL(`/v/${id}`, req.url), 303);
}
