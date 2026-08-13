/**
 * Task 3 of the "Tanya tentang Royhan" RAG chatbot: embeds every chunk from
 * Task 2's collect-sources and writes a static vector index to
 * lib/rag/index.json, committed to the repo and read at runtime by
 * lib/rag/retrieve.ts (Task 4) — no vector DB, no per-request embedding of
 * the corpus.
 *
 * Manual only — NOT wired into `next build`. Re-run and commit the result
 * whenever MDX content or the i18n dictionaries change:
 *
 *   npm run rag:build
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env, pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";
import { collectSources, type SourceChunk } from "./collect-sources";

const MODEL_ID = "Xenova/multilingual-e5-small";

// Model weights are cached here instead of the library's default `./.cache`
// so the location is explicit and shared with the runtime pipeline in Task
// 4/5. Gitignored — this script (run locally or as a build/CI step with
// network access) is the only place allowed to fetch from the HF Hub, so
// production request handling never depends on that CDN being reachable.
const MODEL_CACHE_DIR = path.join(process.cwd(), ".rag-models");

const OUTPUT_PATH = path.join(process.cwd(), "lib", "rag", "index.json");

// Extra float precision doesn't improve cosine similarity quality but does
// bloat the committed JSON and the time Task 4 spends parsing it on every
// cold start.
const EMBEDDING_SIGNIFICANT_DIGITS = 6;

// E5 models are trained with an asymmetric prefix convention: documents are
// embedded as "passage: ...", queries as "query: ..." (applied at runtime
// in lib/rag/retrieve.ts). Mismatching this convention measurably hurts
// retrieval quality for E5 models specifically.
const PASSAGE_PREFIX = "passage: ";

type IndexedChunk = SourceChunk & { embedding: number[] };

type RagIndex = {
  generatedAt: string;
  model: string;
  chunks: IndexedChunk[];
};

function roundEmbedding(vector: Iterable<number>): number[] {
  return Array.from(vector, (v) => Number(v.toPrecision(EMBEDDING_SIGNIFICANT_DIGITS)));
}

async function embedChunk(
  extractor: FeatureExtractionPipeline,
  chunk: SourceChunk,
): Promise<IndexedChunk> {
  const output = await extractor(`${PASSAGE_PREFIX}${chunk.text}`, {
    pooling: "mean",
    normalize: true,
  });
  return { ...chunk, embedding: roundEmbedding(output.data as Float32Array) };
}

async function main() {
  const startedAt = Date.now();

  await mkdir(MODEL_CACHE_DIR, { recursive: true });
  env.cacheDir = MODEL_CACHE_DIR;

  console.log("Collecting source chunks...");
  const chunks = await collectSources();
  console.log(`${chunks.length} chunks collected.`);

  console.log(`Loading embedding pipeline (${MODEL_ID}, dtype: q8)...`);
  const extractor = await pipeline("feature-extraction", MODEL_ID, { dtype: "q8" });
  console.log(`Pipeline ready in ${((Date.now() - startedAt) / 1000).toFixed(1)}s.`);

  const indexed: IndexedChunk[] = [];
  for (const [i, chunk] of chunks.entries()) {
    indexed.push(await embedChunk(extractor, chunk));
    if ((i + 1) % 20 === 0 || i === chunks.length - 1) {
      console.log(`Embedded ${i + 1}/${chunks.length}`);
    }
  }

  const index: RagIndex = {
    generatedAt: new Date().toISOString(),
    model: MODEL_ID,
    chunks: indexed,
  };

  const json = JSON.stringify(index);
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, json);

  const elapsedS = ((Date.now() - startedAt) / 1000).toFixed(1);
  const sizeKb = (Buffer.byteLength(json) / 1024).toFixed(0);
  console.log(
    `\nWrote ${indexed.length} chunks (${sizeKb} KB) to ${path.relative(process.cwd(), OUTPUT_PATH)} in ${elapsedS}s.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
