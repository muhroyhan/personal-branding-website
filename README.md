# Personal Branding Website

Muhammad Royhan — Tech Lead / Senior Software Engineer portfolio site, live in production.

Stack: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.
See [`ai_dev_doc.md`](./ai_dev_doc.md) for full architecture/design decisions and the task breakdown (`PBW-XX`).

## What this is

A bilingual (EN/ID) portfolio and case-study site, including:

- Work and writing case studies authored as MDX (`content/work/`, `content/writing/`)
- "Tanya tentang Royhan" — a RAG-powered chatbot (Groq + Upstash Redis rate limiting) that answers questions about Royhan grounded in the site's own content
- Full SEO surface: sitemap, robots, locale-aware OG images, JSON-LD `Person` schema, `llms.txt` for LLM crawlers
- Automated versioning and releases via semantic-release, with the live version shown in the footer
- CI on every PR (lint, typecheck, build) and Vercel preview deployments

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck only, no output
npm run rag:collect  # print chunk counts from the "Tanya tentang Royhan" RAG source pipeline (no output file)
npm run rag:build    # (re)generate lib/rag/index.json — see below
npm run test:rag     # unit tests for the RAG ingestion/chunking script
npm run vercel-build # what Vercel actually runs: rag:build, then next build — see below
```

### Rebuilding the RAG chatbot's search index

`lib/rag/index.json` is the embedding index the "Tanya tentang Royhan" chatbot
retrieves from at request time (`app/api/chat/route.ts`) — a static JSON file,
not something regenerated per *request*.

Locally, run `npm run rag:build` and commit the resulting `lib/rag/index.json`
whenever:
- Any `content/work/*.mdx` or `content/writing/*.mdx` file changes.
- `lib/i18n/dictionaries/{en,id}.ts` (`hero`, `acts`, `architecture`,
  `dichotomy`, `whoFor`, `privacy`) changes.
- `lib/constants.ts` (tech stack, contact links) or `public/llms.txt` changes.

**On Vercel, this happens automatically on every deploy anyway**: Vercel
detects the `vercel-build` script in `package.json` (`rag:build && next
build`) and runs that instead of the plain `build` script, with no dashboard
setting required. This is deliberate, not just a safety net for content
changes — the embedding model weights themselves (`.rag-models/`, ~118MB) are
gitignored and never committed, so a fresh Vercel checkout has nothing in
that directory. `rag:build` downloads them fresh during the build step
(which has normal network access), so `next build`'s
`outputFileTracingIncludes` (see `next.config.ts`) has something to bundle
into the deployed function — without this, the function would fall back to
fetching the model from the Hugging Face CDN at cold start instead, which is
exactly the runtime network dependency this whole caching strategy exists to
avoid. Net effect: the committed `lib/rag/index.json` is a local/dev
convenience (lets you run `next dev` without waiting on a rebuild), not the
production source of truth — Vercel always regenerates it fresh from
whatever's on the deployed branch.

The first local run downloads the `Xenova/multilingual-e5-small` embedding
model (~118MB, quantized) into `.rag-models/` (gitignored, not committed —
subsequent runs reuse the cached weights). This is a local/CI-time step with
normal network access; it is deliberately kept separate from the app's
request path, which never fetches the model over the network at runtime.

## Branch flow

```
daily work → PR into develop → merge develop → PR develop into main → merge main deploys production
```

- `develop` is the integration branch. Day-to-day PRs target it.
- `main` only ever receives PRs from `develop`. Merging to `main` is a release.
- `.github/workflows/ci.yml` runs on every PR targeting **either** `develop` or `main`: install deps → lint → typecheck → `next build`. All four must pass before merge — this is a quality gate only, it does not deploy anything. (Before PBW-17 this only ran against `main`, so daily PRs into `develop` weren't checked — fixed here.)

## Environment variables

See `.env.example` for the full list, registered in Vercel for both Production and Preview:

- `NEXT_PUBLIC_SITE_URL` — canonical production URL, used by the sitemap, robots, and JSON-LD.
- `GROQ_API_KEY` / `GROQ_MODEL` — the "Tanya tentang Royhan" chatbot's inference provider.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis, used for chatbot rate limiting.

## Release checklist (every merge to `main`)

1. Confirm CI is green on `develop` (latest commit, not just at PR-merge time).
2. Open a PR from `develop` into `main`.
3. Confirm CI is green on that PR.
4. Merge (only after branch-protection's "up to date" check passes — see step 4 above).
5. `.github/workflows/release.yml` runs on the resulting push to `main` and calls [semantic-release](https://semantic-release.gitbook.io/), which decides the version by itself from the commit messages merged in — nothing to fill in by hand. It's a no-op (no tag, no release) if none of the commits since the last release warrant one.
6. Open the Vercel dashboard → Deployments → confirm the new production deployment succeeded (not just "Building") and the production URL actually serves the new commit. Because semantic-release pushes its own version-bump commit back to `main`, expect **two** deployments per release: one for the merge, one for that follow-up commit — the second is the one that actually serves the bumped version.

### Versioning

Fully automatic — there is no version number to type in anywhere. It runs on the [Conventional Commits](https://www.conventionalcommits.org) standard, enforced only by convention (no commit-msg hook installed): prefix every commit/PR-squash-message with `fix:`, `feat:`, `chore:`, `docs:`, etc.

- `fix:` → patch release (`0.1.0` → `0.1.1`)
- `feat:` → minor release (`0.1.0` → `0.2.0`)
- `feat!:`, `fix!:`, or a `BREAKING CHANGE:` footer → major release (`0.1.0` → `1.0.0`)
- Anything else (`chore:`, `docs:`, `style:`, `refactor:` without `!`, etc.) → no release

On each qualifying push to `main`, `semantic-release` (config: `.releaserc.json`) computes the next version from those commit messages, then: bumps `version` in `package.json`, updates `CHANGELOG.md`, commits both back to `main` as `chore(release): X.Y.Z [skip ci]` (the `[skip ci]` stops that commit from re-triggering `release.yml`), tags it `vX.Y.Z`, and publishes a GitHub Release with generated notes. `lib/version.ts` re-exports `package.json#version` as `APP_VERSION`, which the footer links to `${REPO_URL}/releases` on every page, including the homepage — so the live site always reflects the latest published release once that second deploy (see step 6 above) lands.

## SEO artifacts

- `app/sitemap.ts` → `/sitemap.xml` — every `content/work/*.mdx` and `content/writing/*.mdx` slug, `/privacy`, emitted once per locale with full `hreflang` alternates on each entry
- `app/robots.ts` → `/robots.txt`
- `app/[locale]/opengraph-image.tsx` → dynamic branded OG image (`next/og`), locale-aware, used as the default for every page unless a route defines its own
- JSON-LD `Person` schema in `app/[locale]/layout.tsx` (name, jobTitle, `sameAs` → LinkedIn/GitHub), plus `alternates.languages` in `generateMetadata` for hreflang
- `public/llms.txt` — plain-text site summary for LLM crawlers, kept in sync with both locales manually (not generated)
- `/privacy` — plain-language privacy notice (locale cookie, IP-derived redirect, cookieless Vercel Analytics), linked from the footer, not the primary nav
