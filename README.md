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

## CI

`.github/workflows/ci.yml` runs on every PR targeting `main`: install deps → lint → typecheck → `next build`. All four must pass before merge — this is a quality gate only, it does not deploy anything.

## Manual setup required (cannot be automated from here)

The steps below need dashboard/OAuth access that only the repo owner has. Do these once, manually:

1. **Push this repo to GitHub**
   - Create a new empty repository on GitHub named `personal-branding-website` (no README/gitignore/license — this repo already has them).
   - From this project directory:
     ```bash
     git remote add origin https://github.com/<your-username>/personal-branding-website.git
     git branch -M main
     git push -u origin main
     ```

2. **Connect the repo to Vercel (Git Integration)**
   - Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import the `personal-branding-website` repo.
   - Framework preset: Next.js (auto-detected). Leave build/output settings as default.
   - Deploy. This gives you the free `*.vercel.app` domain and automatic deployments:
     - every push to `main` → production deploy
     - every PR → unique preview deployment

3. **Set `NEXT_PUBLIC_SITE_URL`** (Vercel project → Settings → Environment Variables)
   - Once you know the real domain (the `*.vercel.app` URL from step 2, or a custom domain later), set `NEXT_PUBLIC_SITE_URL` to it, e.g. `https://personal-branding-website.vercel.app`.
   - Without this, `sitemap.xml`, `robots.txt`, and the JSON-LD `Person` schema fall back to `http://localhost:3000`, which is wrong in production.
   - Redeploy after setting it (env var changes don't apply to already-built deployments).

4. **Enable Vercel Analytics**
   - Vercel project → Analytics tab → Enable. It's privacy-friendly by default (no cookies, no consent banner needed).
   - Until this is enabled, the `/_vercel/insights/script.js` the site requests will 404 — that's expected and harmless (confirmed via Lighthouse during PBW-14/16: it doesn't affect functionality, only a `best-practices` audit point locally, and resolves automatically once Analytics is turned on).

5. **Submit to Google Search Console**
   - [search.google.com/search-console](https://search.google.com/search-console) → Add property → use the same domain as `NEXT_PUBLIC_SITE_URL`.
   - Verify ownership (Vercel supports the DNS or HTML-file methods; the HTML-meta-tag method also works by adding a `verification` field to `app/layout.tsx`'s `metadata.other` if needed).
   - Submit `sitemap.xml` (already generated at `/sitemap.xml`) under Sitemaps.

6. **Submit to Bing Webmaster Tools**
   - [bing.com/webmasters](https://www.bing.com/webmasters) → Add site → same domain.
   - Bing Webmaster Tools can also **import verified sites directly from Google Search Console** (faster than manual verification) if step 5 is done first.
   - Submit the same `sitemap.xml` URL.

7. **Branch protection (recommended, optional)**
   - In GitHub repo settings → Branches → add a rule for `main` requiring the `CI / Lint, typecheck, build` check to pass before merging, so a red CI blocks merge instead of just warning.

Once steps 1–2 are done, every PR will show both the GitHub Actions CI check and a Vercel preview deployment link automatically.

## SEO artifacts

- `app/sitemap.ts` → `/sitemap.xml` (auto-includes every `content/work/*.mdx` slug)
- `app/robots.ts` → `/robots.txt`
- `app/opengraph-image.tsx` → dynamic branded OG image (`next/og`), used as the default for every page unless a route defines its own
- JSON-LD `Person` schema in `app/layout.tsx` (name, jobTitle, `sameAs` → LinkedIn/GitHub)
- `public/llms.txt` — plain-text site summary for LLM crawlers
