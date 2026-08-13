import assert from "node:assert/strict";
import { test } from "node:test";
import { collectSources, type SourceChunk } from "./collect-sources";
import { LOCALES } from "@/lib/i18n/config";

const FORBIDDEN_SOURCES = ["copy-draft", "ai_dev_doc", "testimonials"];
const TICKET_ID_PATTERN = /PBW-\d+/;

// Static routes emitted by app/sitemap.ts, before locale-prefixing. Chunk
// URLs are allowed to carry a `#anchor` suffix on top of one of these.
const KNOWN_BASE_ROUTES = ["/", "/work", "/writing", "/privacy"];
const WORK_SLUGS = ["payroll-system", "core-banking-bpr", "rental-marketplace", "pph21"];
const WRITING_SLUGS = ["who-am-i", "how-website-built"];

function stripLocalePrefix(url: string): string {
  for (const locale of LOCALES) {
    if (locale === "en") continue; // default locale owns the bare path
    if (url === `/${locale}`) return "/";
    if (url.startsWith(`/${locale}/`)) return url.slice(`/${locale}`.length);
  }
  return url;
}

function isKnownRoute(path: string): boolean {
  if (KNOWN_BASE_ROUTES.includes(path)) return true;
  if (WORK_SLUGS.some((slug) => path === `/work/${slug}`)) return true;
  if (WRITING_SLUGS.some((slug) => path === `/writing/${slug}`)) return true;
  return false;
}

let chunks: SourceChunk[];

test.before(async () => {
  chunks = await collectSources();
});

test("produces a non-empty, reasonably sized chunk set", () => {
  assert.ok(chunks.length > 0, "expected at least one chunk");
  // ~15–20 source documents at ~150–300 words/chunk is expected to land
  // somewhere in the 60–150 range; a wildly different count signals a
  // source was missed or duplicated.
  assert.ok(
    chunks.length >= 40 && chunks.length <= 250,
    `expected chunk count in a sane 40–250 range, got ${chunks.length}`,
  );
});

test("every source type produced at least one chunk", () => {
  const sources = new Set(chunks.map((c) => c.source));
  const prefixes = ["work/", "writing/", "llms-txt", "dictionary/", "constants/"];
  for (const prefix of prefixes) {
    const found = [...sources].some((s) => s.startsWith(prefix) || s === prefix);
    assert.ok(found, `expected at least one chunk with source matching "${prefix}"`);
  }
});

test("no chunk has empty or undefined text", () => {
  for (const chunk of chunks) {
    assert.ok(typeof chunk.text === "string" && chunk.text.trim().length > 0, `empty text in ${chunk.id}`);
  }
});

test("every chunk has a locale of 'en' or 'id'", () => {
  for (const chunk of chunks) {
    assert.ok(chunk.locale === "en" || chunk.locale === "id", `bad locale in ${chunk.id}`);
  }
});

test("every chunk has a url matching a known sitemap route", () => {
  for (const chunk of chunks) {
    const [pathOnly] = chunk.url.split("#");
    const basePath = stripLocalePrefix(pathOnly);
    assert.ok(isKnownRoute(basePath), `unrecognised route "${chunk.url}" (chunk ${chunk.id})`);
  }
});

test("no chunk originates from an excluded internal source", () => {
  for (const chunk of chunks) {
    for (const forbidden of FORBIDDEN_SOURCES) {
      assert.ok(
        !chunk.source.includes(forbidden),
        `chunk ${chunk.id} came from excluded source "${forbidden}"`,
      );
    }
  }
});

test("no chunk text contains an internal ticket-ID pattern (PBW-XX)", () => {
  for (const chunk of chunks) {
    assert.ok(!TICKET_ID_PATTERN.test(chunk.text), `ticket-ID pattern leaked into chunk ${chunk.id}`);
  }
});

test("adjacent chunks from the same document overlap by their tail words", () => {
  const bySource = new Map<string, SourceChunk[]>();
  for (const chunk of chunks) {
    const key = `${chunk.source}#${chunk.locale}`;
    const list = bySource.get(key) ?? [];
    list.push(chunk);
    bySource.set(key, list);
  }

  let checkedAtLeastOnePair = false;

  for (const list of bySource.values()) {
    if (list.length < 2) continue;
    checkedAtLeastOnePair = true;

    for (let i = 1; i < list.length; i++) {
      const prevWords = list[i - 1].text.split(/\s+/).filter(Boolean);
      const tail = prevWords.slice(-25).join(" ");
      assert.ok(
        list[i].text.startsWith(tail),
        `chunk ${list[i].id} does not start with the previous chunk's tail`,
      );
    }
  }

  assert.ok(checkedAtLeastOnePair, "expected at least one document to yield 2+ chunks to test overlap on");
});

test("overlap does not leak across different source documents", () => {
  // For every document with 2+ chunks, its own last chunk's tail must not
  // appear as a prefix borrowed by any *other* document's first chunk.
  const bySource = new Map<string, SourceChunk[]>();
  for (const chunk of chunks) {
    const key = `${chunk.source}#${chunk.locale}`;
    const list = bySource.get(key) ?? [];
    list.push(chunk);
    bySource.set(key, list);
  }

  const firstChunkPerDoc = new Map(
    [...bySource.entries()].map(([key, list]) => [key, list[0]] as const),
  );
  const lastChunksOfMultiChunkDocs = [...bySource.values()]
    .filter((list) => list.length > 1)
    .map((list) => list[list.length - 1]);

  for (const lastChunk of lastChunksOfMultiChunkDocs) {
    const tailWords = lastChunk.text.split(/\s+/).filter(Boolean).slice(-25).join(" ");
    for (const [key, firstChunk] of firstChunkPerDoc) {
      if (key === `${lastChunk.source}#${lastChunk.locale}`) continue;
      assert.ok(
        !firstChunk.text.startsWith(tailWords),
        `first chunk of ${key} unexpectedly starts with the tail of ${lastChunk.id}`,
      );
    }
  }
});
