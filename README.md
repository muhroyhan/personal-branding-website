# Personal Branding Website

Muhammad Royhan — Tech Lead / Senior Software Engineer portfolio site.

Stack: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.
See [`ai_dev_doc.md`](./ai_dev_doc.md) for full architecture/design decisions and the task breakdown (`PBW-XX`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production build
npm run lint    # eslint
npx tsc --noEmit  # typecheck only, no output
```

## Branch flow

```
daily work → PR into develop → merge develop → PR develop into main → merge main deploys production
```

- `develop` is the integration branch. Day-to-day PRs target it.
- `main` only ever receives PRs from `develop`. Merging to `main` is a release.
- `.github/workflows/ci.yml` runs on every PR targeting **either** `develop` or `main`: install deps → lint → typecheck → `next build`. All four must pass before merge — this is a quality gate only, it does not deploy anything. (Before PBW-17 this only ran against `main`, so daily PRs into `develop` weren't checked — fixed here.)

## Manual setup required (cannot be automated from here)

The steps below need dashboard/OAuth access that only the repo owner has. Do these once, manually:

1. **Push `main` to GitHub**
   - `origin` currently only has `develop` pushed (verified via `git ls-remote origin` — no `refs/heads/main` yet). Push it:
     ```bash
     git push -u origin main
     ```
   - Until `main` exists on GitHub, you can't open a `develop` → `main` PR, and the branch-protection rule for `main` (step 4) can't be created.

2. **Connect the repo to Vercel (Git Integration)**
   - Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import the `personal-branding-website` repo.
   - Framework preset: Next.js (auto-detected). Leave build/output settings as default.
   - Deploy. This gives you the free `*.vercel.app` domain and automatic deployments for every push/PR.

3. **Verify Vercel's Production Branch is `main`, not `develop`**
   - Vercel project → Settings → Git → **Production Branch**. Vercel defaults this to whatever branch you imported from — if that was `develop`, it needs to be changed to `main`, otherwise every merge to `develop` would redeploy production instead of just generating a preview.
   - I can't check or change this from here (dashboard-only setting) — please confirm it reads `main` before treating any deploy as final.
   - With it set correctly: PRs and pushes to `develop` get preview deployments only; only a push to `main` (i.e., merging the release PR) updates the production URL.

4. **Branch protection (GitHub repo → Settings → Branches)**
   - Rule for `develop`: require the `CI / Lint, typecheck, build` status check to pass before merging.
   - Rule for `main`: require the same status check to pass **and** require the branch to be up to date with `develop` before merging (the "Require branches to be up to date before merging" option) — this stops a stale `main` PR from merging after `develop` has moved on.
   - Neither rule exists yet; both need to be created manually, don't assume they're already active.

5. **Register environment variables in Vercel — Production *and* Preview**
   - See `.env.example` for the full list (currently just `NEXT_PUBLIC_SITE_URL`).
   - Vercel project → Settings → Environment Variables → add `NEXT_PUBLIC_SITE_URL`:
     - **Production**: the real production domain (custom domain once set, or the `*.vercel.app` URL otherwise).
     - **Preview**: either the same production URL, or leave it unset — sitemap/robots/JSON-LD on preview deployments aren't indexed by anyone, so it matters far less there. Just don't leave *Production* unset, or those artifacts silently fall back to `http://localhost:3000`.
   - Redeploy after adding it (env var changes don't apply to already-built deployments).

6. **Enable Vercel Analytics**
   - Vercel project → Analytics tab → Enable. It's privacy-friendly by default (no cookies, no consent banner needed).
   - Until this is enabled, the `/_vercel/insights/script.js` the site requests will 404 — that's expected and harmless (confirmed via Lighthouse during PBW-14/16: it doesn't affect functionality, only a `best-practices` audit point locally, and resolves automatically once Analytics is turned on).

7. **Submit to Google Search Console**
   - [search.google.com/search-console](https://search.google.com/search-console) → Add property → use the same domain as `NEXT_PUBLIC_SITE_URL`.
   - Verify ownership (Vercel supports the DNS or HTML-file methods; the HTML-meta-tag method also works by adding a `verification` field to `app/layout.tsx`'s `metadata.other` if needed).
   - Submit `sitemap.xml` (already generated at `/sitemap.xml`) under Sitemaps.

8. **Submit to Bing Webmaster Tools**
   - [bing.com/webmasters](https://www.bing.com/webmasters) → Add site → same domain.
   - Bing Webmaster Tools can also **import verified sites directly from Google Search Console** (faster than manual verification) if step 7 is done first.
   - Submit the same `sitemap.xml` URL.

Once steps 1–2 are done, every PR will show both the GitHub Actions CI check and a Vercel preview deployment link automatically.

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

## Content backlog (owner-only — can't be automated or guessed)

These are already wired up in code as graceful no-ops, not blockers, but nothing shows on the live site until you do them:

- **Profile photo**: drop a ~480×480 square image at `public/images/profile.jpg`. `ProfilePhoto` (`components/ui/profile-photo.tsx`) renders nothing until the file 200s.
- **Video intro**: drop an MP4 at `public/videos/intro.mp4`. `VideoIntro` (`components/ui/video-intro.tsx`) same graceful-degrade pattern.
- **Testimonials**: add entries to `TESTIMONIALS` in `lib/testimonials.ts` (empty array today). The section renders nothing at all until it has at least one.
- **Business-impact numbers**: each case study (`content/work/{en,id}/*.mdx`) has a `<!-- TODO(business-impact) -->` comment marking where one real, concrete number belongs (turnaround time, dispute count, hours saved). Deliberately left unfilled rather than guessed — don't publish a number that isn't real.
