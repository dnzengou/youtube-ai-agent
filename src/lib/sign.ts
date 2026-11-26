import { createPrivateKey, sign as nodeSign } from "node:crypto";

export function signContentHash(contentHash: string): string | undefined {
  const pem = process.env.VERISCOPE_SIGNING_KEY;
  if (!pem) return undefined;
  try {
    const key = createPrivateKey(pem);
    const sig = nodeSign(null, Buffer.from(contentHash, "hex"), key);
    return sig.toString("base64");
  } catch {
    return undefined;
  }
}
