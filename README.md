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
5. Open the Vercel dashboard → Deployments → confirm the new production deployment succeeded (not just "Building") and the production URL actually serves the new commit.

## SEO artifacts

- `app/sitemap.ts` → `/sitemap.xml` (auto-includes every `content/work/*.mdx` slug)
- `app/robots.ts` → `/robots.txt`
- `app/opengraph-image.tsx` → dynamic branded OG image (`next/og`), used as the default for every page unless a route defines its own
- JSON-LD `Person` schema in `app/layout.tsx` (name, jobTitle, `sameAs` → LinkedIn/GitHub)
- `public/llms.txt` — plain-text site summary for LLM crawlers
