import type { VideoDoc } from "./videodoc";

// Storage interface — swap to Neon+pgvector (via Vercel Marketplace) in step 3.
// Keeping an in-memory impl for dev + preview so the pipeline is end-to-end runnable
// before any paid resource is provisioned.
export interface Store {
  get(id: string): Promise<VideoDoc | null>;
  put(doc: VideoDoc): Promise<void>;
  list(limit?: number): Promise<VideoDoc[]>;
}

class MemoryStore implements Store {
  private m = new Map<string, VideoDoc>();
  async get(id: string) {
    return this.m.get(id) ?? null;
  }
  async put(doc: VideoDoc) {
    this.m.set(doc.id, doc);
  }
  async list(limit = 50) {
    return Array.from(this.m.values()).slice(0, limit);
  }
}

// Module-scope singleton — fine on Fluid Compute (instances are reused),
// and swapped out entirely once DATABASE_URL is wired.
const g = globalThis as unknown as { __veriscopeStore?: Store };
export const store: Store = g.__veriscopeStore ?? (g.__veriscopeStore = new MemoryStore());
