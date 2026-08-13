/**
 * Task 2 of the "Tanya tentang Royhan" RAG chatbot: reads every source of
 * truth this site already has (MDX case studies/essays, `llms.txt`, the
 * i18n dictionaries, structured facts in `lib/constants.ts`), turns each
 * into plain-text documents, then splits those into overlapping chunks
 * ready for embedding in Task 3.
 *
 * Run directly for a manual sanity check: `npx tsx scripts/rag/collect-sources.ts`
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import {
  ACT_ANCHORS,
  ACT_KEYS,
  CONTACT_LINKS,
  DICHOTOMY_ITEMS,
  RESUME_PATH,
  TECH_STACK_GROUPS,
} from "@/lib/constants";
import { en } from "@/lib/i18n/dictionaries/en";
import { id } from "@/lib/i18n/dictionaries/id";
import { LOCALES, localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const ROOT = process.cwd();
const WORK_DIR = path.join(ROOT, "content", "work");
const WRITING_DIR = path.join(ROOT, "content", "writing");

const DICTIONARIES: Record<Locale, Dictionary> = { en, id };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A source document before chunking — one per MDX file, dictionary section, etc. */
type SourceDocument = {
  text: string;
  source: string;
  url: string;
  locale: Locale;
  title: string;
};

export type SourceChunk = SourceDocument & {
  id: string;
};

// ---------------------------------------------------------------------------
// Chunking: split into paragraphs, group into ~150–300 word chunks, then
// stitch a ~25-word tail-overlap between chunks that came from the same
// document so a sentence that leans on the previous paragraph doesn't lose
// its meaning when retrieved on its own. Overlap never crosses a document
// boundary — each document is chunked independently.
// ---------------------------------------------------------------------------

const MIN_CHUNK_WORDS = 150;
const MAX_CHUNK_WORDS = 300;
const OVERLAP_WORDS = 25;

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Strips MDX/JS comments (`{/* ... *\/}`) — internal notes like the
 * business-impact TODO markers should never reach the index. */
function stripMdxComments(body: string): string {
  return body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Groups paragraphs into chunks in the ~150–300 word target range. A
 * document shorter than the minimum still yields exactly one chunk. */
function groupParagraphs(paragraphs: string[]): string[] {
  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const para of paragraphs) {
    const paraWords = wordCount(para);

    if (currentWords > 0 && currentWords + paraWords > MAX_CHUNK_WORDS) {
      chunks.push(current.join("\n\n"));
      current = [];
      currentWords = 0;
    }

    current.push(para);
    currentWords += paraWords;

    if (currentWords >= MIN_CHUNK_WORDS) {
      chunks.push(current.join("\n\n"));
      current = [];
      currentWords = 0;
    }
  }

  if (current.length > 0) chunks.push(current.join("\n\n"));
  return chunks;
}

/** Prepends the last ~25 words of the *previous raw* chunk to each chunk
 * (except the first) so overlap stays constant instead of compounding. */
function withOverlap(rawChunks: string[]): string[] {
  return rawChunks.map((chunk, i) => {
    if (i === 0) return chunk;
    const prevWords = rawChunks[i - 1].split(/\s+/).filter(Boolean);
    const tail = prevWords.slice(-OVERLAP_WORDS).join(" ");
    return tail ? `${tail} ${chunk}` : chunk;
  });
}

function chunkDocument(doc: SourceDocument): SourceChunk[] {
  const cleaned = stripMdxComments(doc.text).trim();
  if (!cleaned) return [];

  const paragraphs = splitIntoParagraphs(cleaned);
  const rawChunks = groupParagraphs(paragraphs);
  const overlapped = withOverlap(rawChunks);

  return overlapped.map((text, i) => ({
    ...doc,
    text,
    id: `${doc.source}#${doc.locale}#${i}`,
  }));
}

// ---------------------------------------------------------------------------
// Source 1: MDX case studies (content/work) and essays (content/writing)
// ---------------------------------------------------------------------------

async function localeFileExists(dir: string, locale: Locale, slug: string): Promise<boolean> {
  try {
    const files = await readdir(path.join(dir, locale));
    return files.includes(`${slug}.mdx`);
  } catch {
    return false;
  }
}

/** Union of slugs across both locale directories — mirrors
 * lib/mdx.ts's getSlugsAcrossLocales, reimplemented here so this
 * Node-runtime script never imports next-mdx-remote/rsc (an RSC-only
 * module that doesn't resolve outside Next's own bundler). */
async function getSlugsAcrossLocales(dir: string): Promise<string[]> {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        return (await readdir(path.join(dir, locale))).filter((f) => f.endsWith(".mdx"));
      } catch {
        return [];
      }
    }),
  );
  return [...new Set(perLocale.flat().map((f) => f.replace(/\.mdx$/, "")))];
}

async function collectMdxDocuments(
  dir: string,
  slugs: string[],
  sourcePrefix: "work" | "writing",
): Promise<SourceDocument[]> {
  const docs: SourceDocument[] = [];

  for (const slug of slugs) {
    for (const locale of LOCALES) {
      // Only index a locale's own file — never the English fallback content/
      // routes silently serve when a translation is missing (lib/mdx.ts's
      // readLocalisedFile), or an "id" chunk would actually contain English
      // prose, which would poison the locale-boost step in Task 4.
      if (!(await localeFileExists(dir, locale, slug))) continue;

      const raw = await readFile(path.join(dir, locale, `${slug}.mdx`), "utf-8");
      const { data, content } = matter(raw);
      const title = typeof data.title === "string" ? data.title : slug;
      const basePath = sourcePrefix === "work" ? `/work/${slug}` : `/writing/${slug}`;

      docs.push({
        text: content,
        source: `${sourcePrefix}/${slug}`,
        url: localePath(locale, basePath),
        locale,
        title,
      });
    }
  }

  return docs;
}

// ---------------------------------------------------------------------------
// Source 2: public/llms.txt — one seed document. It's written once in
// English (not translated per locale like the rest of the copy), so it's
// tagged "en" rather than duplicated as mislabelled Indonesian content;
// the multilingual embedding model still surfaces it for Indonesian
// queries, just without the same-locale boost.
// ---------------------------------------------------------------------------

async function collectLlmsTxtDocument(): Promise<SourceDocument[]> {
  const raw = await readFile(path.join(ROOT, "public", "llms.txt"), "utf-8");
  return [
    {
      text: raw,
      source: "llms-txt",
      url: localePath("en", "/"),
      locale: "en",
      title: "Site summary (llms.txt)",
    },
  ];
}

// ---------------------------------------------------------------------------
// Source 3: dictionary prose — hero, acts.*, architecture, dichotomy.items,
// whoFor, privacy. One document per section per locale.
// ---------------------------------------------------------------------------

function buildHeroDocument(dict: Dictionary, locale: Locale): SourceDocument {
  const { hero } = dict;
  const lead = [
    hero.leadBefore,
    hero.termOne.label,
    ` (${hero.termOne.definition})`,
    hero.leadMiddle,
    hero.termTwo.label,
    ` (${hero.termTwo.definition})`,
    hero.leadAfter,
  ].join("");

  const text = [
    `${hero.name} — ${hero.role}.`,
    hero.positioning,
    hero.headline,
    lead,
    `${hero.proofLabel}: ${hero.proof.join("; ")}.`,
  ].join(" ");

  return {
    text,
    source: "dictionary/hero",
    url: localePath(locale, "/"),
    locale,
    title: "Hero",
  };
}

function buildActDocuments(dict: Dictionary, locale: Locale): SourceDocument[] {
  return ACT_KEYS.map((key) => {
    const act = dict.acts[key];
    const parts = [`${act.year} — ${act.role}: ${act.title}.`];

    if ("paragraphs" in act && act.paragraphs) parts.push(act.paragraphs.join(" "));
    if ("intro" in act && act.intro) parts.push(act.intro);
    if ("question" in act && act.question) parts.push(act.question);
    if ("dichotomyIntro" in act && act.dichotomyIntro) parts.push(act.dichotomyIntro);

    return {
      text: parts.join(" "),
      source: `dictionary/acts.${key}`,
      url: `${localePath(locale, "/")}#${ACT_ANCHORS[key]}`,
      locale,
      title: `Act: ${act.title}`,
    };
  });
}

function buildArchitectureDocument(dict: Dictionary, locale: Locale): SourceDocument {
  const { architecture } = dict;
  const steps = architecture.steps.map((s) => `${s.caption}. ${s.body}`).join(" ");
  const syllogism = architecture.syllogism.map((s) => `${s.label}: ${s.text}`).join(" ");

  return {
    text: `${steps} ${architecture.syllogismLabel}. ${syllogism}`,
    source: "dictionary/architecture",
    url: localePath(locale, "/"),
    locale,
    title: "Payroll architecture story",
  };
}

function buildDichotomyDocument(dict: Dictionary, locale: Locale): SourceDocument {
  const { dichotomy } = dict;
  const text = DICHOTOMY_ITEMS.map(({ id: itemId, category }) => {
    const item = dichotomy.items[itemId];
    const label = category === "controllable" ? dichotomy.controllable : dichotomy.uncontrollable;
    return `${label} — ${item.label}: ${item.note}`;
  }).join(" ");

  return {
    text,
    source: "dictionary/dichotomy",
    url: localePath(locale, "/"),
    locale,
    title: "Stoic dichotomy of control",
  };
}

// A natural-language lead sentence, not just the terse "Availability:
// label, label, label." list below — QA (Task 10) found that a query like
// "is Royhan available for contract work?" embedded closer to the
// constants/contact chunk (a "contact"/"contract" near-homograph collision)
// than to this one, because the original chunk never phrased availability
// as a direct sentence. This restates the same dict.whoFor.availability
// facts in the phrasing an actual question would use, so retrieval has a
// real chance of surfacing it.
const AVAILABILITY_SENTENCE: Record<Locale, string> = {
  en: "Royhan is available for contract work, EOR arrangements, or full-time roles — remote-first, based in WIB (UTC+7), with a two-week notice period.",
  id: "Royhan terbuka untuk kerja kontrak, EOR, atau full-time — remote-first, di WIB (UTC+7), dengan notice period dua minggu.",
};

function buildWhoForDocument(dict: Dictionary, locale: Locale): SourceDocument {
  const { whoFor } = dict;
  const text = [
    AVAILABILITY_SENTENCE[locale],
    whoFor.intro,
    whoFor.bullets.join(" "),
    `${whoFor.availabilityLabel}: ${whoFor.availability.join(", ")}.`,
  ].join(" ");

  return {
    text,
    source: "dictionary/whoFor",
    url: localePath(locale, "/"),
    locale,
    title: "Who this is for",
  };
}

function buildPrivacyDocument(dict: Dictionary, locale: Locale): SourceDocument {
  const { privacy } = dict;
  const table = privacy.collectTable
    .map((row) => `${row.item} — ${row.purpose} (${row.retention})`)
    .join(" ");

  const text = [
    privacy.intro,
    privacy.collectIntro,
    table,
    privacy.notCollectedItems.join(" "),
    privacy.thirdPartyParagraphs.join(" "),
    privacy.choicesParagraphs.join(" "),
  ].join(" ");

  return {
    text,
    source: "dictionary/privacy",
    url: localePath(locale, "/privacy"),
    locale,
    title: "Privacy policy",
  };
}

function collectDictionaryDocuments(): SourceDocument[] {
  return LOCALES.flatMap((locale) => {
    const dict = DICTIONARIES[locale];
    return [
      buildHeroDocument(dict, locale),
      ...buildActDocuments(dict, locale),
      buildArchitectureDocument(dict, locale),
      buildDichotomyDocument(dict, locale),
      buildWhoForDocument(dict, locale),
      buildPrivacyDocument(dict, locale),
    ];
  });
}

// ---------------------------------------------------------------------------
// Source 4: structured facts from lib/constants.ts — tech stack, contact
// info. Written directly in each locale's register (not machine-translated)
// so they read the same as the rest of that locale's copy.
// ---------------------------------------------------------------------------

function buildTechStackDocuments(): SourceDocument[] {
  const groupLabel: Record<string, Record<Locale, string>> = {
    frontend: { en: "Frontend", id: "Frontend" },
    backend: { en: "Backend", id: "Backend" },
    infra: { en: "Infra & Tools", id: "Infra & Tools" },
  };

  const sentence: Record<Locale, (parts: string) => string> = {
    en: (parts) => `Royhan's tech stack — ${parts}`,
    id: (parts) => `Stack teknis Royhan — ${parts}`,
  };

  return LOCALES.map((locale) => {
    const parts = TECH_STACK_GROUPS.map(
      (group) => `${groupLabel[group.key][locale]}: ${group.items.join(", ")}`,
    ).join("; ");

    return {
      text: `${sentence[locale](parts)}.`,
      source: "constants/tech-stack",
      url: localePath(locale, "/"),
      locale,
      title: "Tech stack",
    };
  });
}

function buildContactDocuments(): SourceDocument[] {
  const text: Record<Locale, string> = {
    en: `Royhan can be reached by email at ${CONTACT_LINKS.email}, via WhatsApp (${CONTACT_LINKS.whatsapp}), LinkedIn (${CONTACT_LINKS.linkedin}), or GitHub (${CONTACT_LINKS.github}). His resume is available as a PDF at ${RESUME_PATH}. He has no Twitter/X or Instagram — those platforms should never be mentioned as ways to reach him.`,
    id: `Royhan bisa dihubungi lewat email di ${CONTACT_LINKS.email}, WhatsApp (${CONTACT_LINKS.whatsapp}), LinkedIn (${CONTACT_LINKS.linkedin}), atau GitHub (${CONTACT_LINKS.github}). CV-nya tersedia dalam bentuk PDF di ${RESUME_PATH}. Ia tidak punya Twitter/X atau Instagram — jangan pernah menyebut kedua platform itu sebagai cara menghubunginya.`,
  };

  return LOCALES.map((locale) => ({
    text: text[locale],
    source: "constants/contact",
    url: localePath(locale, "/"),
    locale,
    title: "Contact",
  }));
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

const FORBIDDEN_TEXT_PATTERN = /PBW-\d+/;

export async function collectSources(): Promise<SourceChunk[]> {
  const [workSlugs, writingSlugs] = await Promise.all([
    getSlugsAcrossLocales(WORK_DIR),
    getSlugsAcrossLocales(WRITING_DIR),
  ]);

  const documents: SourceDocument[] = [
    ...(await collectMdxDocuments(WORK_DIR, workSlugs, "work")),
    ...(await collectMdxDocuments(WRITING_DIR, writingSlugs, "writing")),
    ...(await collectLlmsTxtDocument()),
    ...collectDictionaryDocuments(),
    ...buildTechStackDocuments(),
    ...buildContactDocuments(),
  ];

  const chunks = documents.flatMap(chunkDocument);

  // Defense-in-depth: content/copy-draft.md, ai_dev_doc.md, and
  // lib/testimonials.ts are never read above, so this should always pass —
  // but a ticket-ID pattern slipping into any indexed prose is an
  // information-disclosure bug, not a cosmetic one, so it's asserted here
  // rather than only in the test suite.
  const leaked = chunks.filter((c) => FORBIDDEN_TEXT_PATTERN.test(c.text));
  if (leaked.length > 0) {
    throw new Error(
      `${leaked.length} chunk(s) contain an internal ticket-ID pattern (PBW-XX): ${leaked
        .map((c) => c.id)
        .join(", ")}`,
    );
  }

  return chunks;
}

// Manual sanity check: `npx tsx scripts/rag/collect-sources.ts`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  collectSources().then((chunks) => {
    const bySource = new Map<string, number>();
    for (const chunk of chunks) {
      bySource.set(chunk.source, (bySource.get(chunk.source) ?? 0) + 1);
    }

    console.log(`Total chunks: ${chunks.length}\n`);
    console.log("Chunks per source:");
    for (const [source, count] of [...bySource.entries()].sort()) {
      console.log(`  ${source}: ${count}`);
    }

    const empty = chunks.filter((c) => !c.text.trim());
    if (empty.length > 0) {
      console.warn(`\nWARNING: ${empty.length} chunk(s) have empty text.`);
    }
  });
}
