import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `/api/chat` (app/api/chat/route.ts) loads the RAG embedding model from
   * `.rag-models/` at runtime via `@huggingface/transformers`' own file-system
   * scanning — not a static `import`/`require` — so Next's file tracer can't
   * discover those files on its own and would leave them out of the deployed
   * function, silently forcing a Hugging Face CDN fetch on every cold start
   * in production (exactly what Task 3's local model cache exists to avoid).
   * This makes the trace include them explicitly instead.
   */
  outputFileTracingIncludes: {
    "/api/chat": ["./.rag-models/**/*"],
  },
};

export default nextConfig;
