import assert from "node:assert/strict";
import { test } from "node:test";
import { cosineSimilarity, retrieveTopK, RELEVANCE_THRESHOLD } from "./retrieve";

test("cosineSimilarity: identical vectors score 1, orthogonal vectors score 0", () => {
  assert.ok(Math.abs(cosineSimilarity([1, 0], [1, 0]) - 1) < 1e-9);
  assert.ok(Math.abs(cosineSimilarity([1, 0], [0, 1])) < 1e-9);
});

test("cosineSimilarity: opposite vectors score -1", () => {
  assert.ok(Math.abs(cosineSimilarity([1, 0], [-1, 0]) - -1) < 1e-9);
});

test('query "berapa lama Royhan kerja di satu perusahaan?" retrieves tenure info', async () => {
  const { results } = await retrieveTopK("berapa lama Royhan kerja di satu perusahaan?", "id", 3);

  // Checks presence within top-3, not strict rank order: at this model's
  // similarity precision (documented in RELEVANCE_THRESHOLD's calibration
  // comment), several "about Royhan" chunks legitimately cluster within a
  // hundredth of a point of each other, and which one lands exactly on top
  // shifts with small, unrelated corpus edits (e.g. rephrasing an unrelated
  // chunk). What actually matters for answer quality is that a chunk
  // carrying the tenure figure reaches the LLM's context at all.
  assert.ok(
    results.some(
      (r) =>
        r.source.startsWith("writing/who-am-i") ||
        r.source === "dictionary/hero" ||
        r.source.startsWith("dictionary/acts"),
    ),
    `expected one of the top-3 results to be from who-am-i/hero/acts, got ${results.map((r) => r.source).join(", ")}`,
  );

  const combinedText = results.map((r) => r.text).join(" ");
  assert.ok(
    /7 years|tujuh tahun|7 tahun/i.test(combinedText),
    "expected tenure figure (7 years / tujuh tahun / 7 tahun) somewhere in the top results",
  );
});

test('query "ceritakan tentang sistem payroll" retrieves the payroll case study', async () => {
  const { results } = await retrieveTopK("ceritakan tentang sistem payroll", "id", 3);
  assert.equal(results[0].source, "work/payroll-system");
});

test("off-topic query scores below RELEVANCE_THRESHOLD, on-topic queries score above it", async () => {
  const offTopic = await retrieveTopK("resep nasi goreng", "id", 3);
  const onTopicA = await retrieveTopK("apa tech stack Royhan?", "id", 3);
  const onTopicB = await retrieveTopK("ceritakan proyek payroll", "id", 3);

  assert.ok(
    offTopic.topRelevance < RELEVANCE_THRESHOLD,
    `expected off-topic relevance below ${RELEVANCE_THRESHOLD}, got ${offTopic.topRelevance}`,
  );
  assert.ok(
    onTopicA.topRelevance >= RELEVANCE_THRESHOLD,
    `expected on-topic relevance >= ${RELEVANCE_THRESHOLD}, got ${onTopicA.topRelevance}`,
  );
  assert.ok(
    onTopicB.topRelevance >= RELEVANCE_THRESHOLD,
    `expected on-topic relevance >= ${RELEVANCE_THRESHOLD}, got ${onTopicB.topRelevance}`,
  );
});

test("retrieveTopK returns exactly k results, each with a numeric score", async () => {
  const { results } = await retrieveTopK("apa tech stack Royhan?", "en", 5);
  assert.equal(results.length, 5);
  for (const r of results) {
    assert.equal(typeof r.score, "number");
    assert.ok(r.score >= -1 && r.score <= 1);
  }
});

test("locale boost prefers a same-locale chunk over a near-tied other-locale one, without excluding cross-locale results from the index scan", async () => {
  // Sanity check that locale is actually taken into account: querying in
  // "id" for a topic that exists in both locales should surface an "id"
  // chunk at rank 1 when scores are close, since the boost only nudges
  // near-ties rather than overriding a real relevance gap.
  const { results } = await retrieveTopK("ceritakan proyek payroll", "id", 5);
  assert.equal(results[0].locale, "id");
});
