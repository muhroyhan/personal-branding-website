# Development Docs — Personal Branding Website
**Muhammad Royhan — Tech Lead / Senior Software Engineer**

Target: remote/international engineering roles. Website ini bukan cuma "CV online" — perannya adalah membuktikan kapabilitas senior/tech-lead level lewat storytelling teknis, bukan cuma daftar skill.

---

## 1. Poin yang Ditonjolkan

Dari CV kamu, ada gap yang cukup besar: CV menyebut "led development of enterprise payroll system" dalam satu bullet, tapi kedalaman kerjanya (tax engine PPh21/TER, BPJS, idempotency pattern, audit trail, security hardening) jauh lebih dalam dari itu. Untuk pasar internasional, satu case study yang dalam jauh lebih meyakinkan daripada 10 bullet point achievement yang generik. Rekomendasi saya: jadikan payroll system sebagai **flagship case study**, bukan sekadar item di daftar pengalaman.

| # | Poin | Alasan / catatan |
|---|------|-------------------|
| 1 | **Career progression Junior → Tech Lead dalam ~3.5 tahun** (di satu perusahaan yang sama) | Sinyal kuat untuk reviewer internasional: growth trajectory yang konsisten, bukan job-hopping. Tampilkan sebagai timeline, bukan cuma teks. |
| 2 | **Payroll system architecture case study** (bukan cuma "led development") | Ini yang membedakan kamu dari kandidat lain. Fokuskan ke *keputusan arsitektur*: scope resolution engine (priority hierarchy employee>division>department>position>type), idempotency pada kasbon/payroll run, state machine payroll run + BullMQ chunked processing, audit trail generik 10 entitas. Reviewer senior/tech-lead peduli pada *trade-off reasoning*, bukan daftar fitur. |
| 3 | **Regulatory/domain complexity** (PPh21 TER method, BPJS, PP 58/2023) | Untuk role fintech/payroll internasional, ini nilai jual unik — kamu paham bagaimana menerjemahkan regulasi kompleks jadi sistem yang correct & auditable. Ceritakan *bagaimana* kamu handle ini (mis. constants admin-editable dengan default seeded dari pemerintah), bukan detail regulasinya sendiri (audiens internasional tidak butuh detail PPh21). |
| 4 | **Security & correctness mindset** | Security audit pass (immutability guard, JWT revocation, rate limiting), tax correctness fixes (negative take-home rejection, prorate berbasis working-days), bug-bug halus yang kamu temukan (passwordHash leak lewat eager-load, race condition kasbon). Ini bukti kamu bukan sekadar "bisa coding fitur" tapi paham *production-grade engineering*. |
| 5 | **Leadership & client-facing scope** | Manage 2 proyek + 2 engineer, scoping requirement client, reusable architecture yang dipakai lintas proyek klien. Tampilkan sebagai bukti kamu bisa jadi tech lead yang juga bisa komunikasi ke stakeholder non-teknis — penting untuk role remote lead di luar negeri. |
| 6 | **International project exposure** | "Contributed to international software project involving teams across multiple countries" — perkuat dengan detail konkret kalau memungkinkan (timezone collaboration, cross-team code review, dsb), karena ini langsung relevan untuk remote-first company. |
| 7 | **Fullstack + polyglot delivery** (Flutter, React, NestJS) | Cukup ditampilkan ringkas di skill section — jangan overload, karena fokus positioning kamu sekarang condong ke backend architecture/tech lead, bukan generalist. |

**Catatan meragukan #1:** CV menyebut "7+ years" tapi timeline (Jun 2019–2026) menunjukkan ~7 tahun di *satu* perusahaan. Untuk market internasional, single-employer 7-year tenure kadang perlu narasi tambahan (kenapa stay, apa yang terus berubah/growth) supaya tidak dibaca sebagai "kurang exposure ke lingkungan lain." Saya sarankan bagian About menyinggung ini secara halus lewat framing "grew from IC ke tech lead while shipping X production systems," bukan cuma menyebut lama kerja.

---

## 2. Tech Stack

Tidak perlu ikut stack lama kamu (React CRA-style/Express). Untuk personal site di 2026, standar industri dan performa terbaik:

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19** | Standar de facto portfolio/marketing site 2026, RSC untuk performa, built-in image/font optimization |
| Bahasa | **TypeScript** | Konsisten dengan positioning tech-lead, juga best practice standar |
| Styling | **Tailwind CSS v4** | Cepat iterasi, utility-first, zero runtime CSS-in-JS overhead |
| Animasi | **Motion (ex-Framer Motion) + Lenis** (smooth scroll, opsional) | Motion untuk scroll-reveal & micro-interaction; Lenis hanya jika benar-benar butuh smooth-scroll — jangan dipaksakan kalau menambah jank di mobile |
| Komponen UI dasar | **shadcn/ui** (Radix primitives) | Accessible by default, gampang di-custom total (tidak terlihat templated selama kamu ubah token desain) |
| Konten case study | **MDX** (`next-mdx-remote` atau native App Router MDX) | Supaya nulis case study payroll system semi-terstruktur (heading, code block, diagram) tanpa hardcode JSX tiap kali update |
| Form kontak | **Resend + React Email**, atau sekadar `mailto` + link WhatsApp/LinkedIn | Resend kalau mau form beneran; kalau mau simple & zero-backend, cukup direct links (lihat catatan #2) |
| Rendering strategy | **Static Generation (SSG)** untuk semua halaman (`/`, `/work`, `/work/[slug]`), bukan SSR | Konten portfolio bersifat statis (berubah hanya saat kamu update, bukan per-request). SSG = HTML di-generate saat `next build`/deploy, hasilnya di-serve sebagai file statis → jauh lebih cepat & murah dibanding SSR tiap request. Route Handler (`/api/contact`, kalau dipakai) tetap server-side tapi itu endpoint, bukan halaman |
| Hosting | **Vercel** (domain free `*.vercel.app` dulu) | Native fit untuk Next.js, preview deployment per PR, gratis untuk personal site |
| Source control / CI | **GitHub** repo → Vercel Git Integration (auto-deploy tiap push) + **GitHub Actions** untuk lint/typecheck/build-check di PR | Repo GitHub jadi source of truth duluan, sebelum konek Vercel. Deploy production sebenarnya dihandle Vercel's native Git integration (bukan GitHub Actions yang deploy) — GitHub Actions perannya sebagai *quality gate* (lint, `tsc --noEmit`, `next build` check) sebelum merge ke `main`, bukan mekanisme deploy itu sendiri. Ini kombinasi paling standar & minim maintenance. |
| Analytics | **Vercel Analytics / Plausible** | Ringan, privacy-friendly, tidak perlu cookie consent banner yang mengganggu UX |
| Font | Variable font via `next/font` (contoh: display face + body face — ditentukan saat desain, lihat §4) | Self-hosted otomatis oleh Next.js → tidak ada layout shift dari Google Fonts CDN |

**Catatan meragukan #2 — Contact form:** Form kontak dengan backend (Resend) menambah kompleksitas (env vars, rate limiting, spam handling) untuk value yang kecil di personal site. Rekomendasi: mulai dengan direct contact links (email, WhatsApp, LinkedIn) yang sudah ada di CV kamu + tombol "Copy email." Tambahkan form hanya kalau nanti ternyata butuh (misal untuk lead recruiter yang lebih formal).

**Catatan meragukan #3 — i18n (ID/EN):** Karena target kamu remote internasional, saya sarankan **website full English** saja sebagai default, bukan dual-language toggle. Dual-language menambah kompleksitas routing (`/en`, `/id`) dan maintenance konten dobel, padahal audiens utama adalah recruiter/hiring manager luar negeri. Kalau reach ke market lokal Indonesia juga penting untuk kamu, baru worth it pakai `next-intl`.

---

## 3. Struktur Folder & File

Mengikuti standar Next.js App Router (co-location + feature-based untuk komponen):

```
personal-branding-website/
├── app/
│   ├── layout.tsx                 # root layout, font, metadata, theme provider
│   ├── page.tsx                   # homepage (hero, about, timeline, projects preview, contact)
│   ├── globals.css                # tailwind base + design tokens (CSS vars)
│   ├── work/
│   │   ├── page.tsx                # daftar semua project/case study
│   │   └── [slug]/
│   │       └── page.tsx            # detail case study (payroll system, dll) — render MDX
│   └── api/
│       └── contact/route.ts        # (opsional, lihat catatan #2)
├── content/
│   └── work/
│       ├── payroll-system.mdx      # flagship case study
│       ├── project-2.mdx
│       └── project-3.mdx
├── components/
│   ├── ui/                         # shadcn/ui primitives (button, badge, dialog, dst)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── career-timeline.tsx
│   │   ├── work-preview.tsx
│   │   ├── tech-stack.tsx
│   │   └── contact-cta.tsx
│   └── motion/
│       ├── scroll-reveal.tsx       # wrapper reusable untuk scroll-triggered animation
│       └── timeline-node.tsx
├── lib/
│   ├── mdx.ts                      # loader + frontmatter parser untuk content/work
│   ├── constants.ts                # data statis: skills, links, career data
│   └── utils.ts                    # cn() helper, dsb
├── public/
│   ├── og-image.png
│   └── images/
├── types/
│   └── work.ts                     # tipe frontmatter case study
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

Prinsip: `content/` terpisah dari `components/` supaya nambah case study baru = tulis 1 file MDX, tanpa sentuh kode React sama sekali.

---

## 4. Desain Layout & UX

### Arah desain
Subjek kamu adalah **system architecture & precision** (payroll, tax correctness, idempotency) — jadi arah visual yang pas bukan "cerah & playful," tapi **presisi, terstruktur, technical-but-warm**. Hindari 3 default yang gampang keliatan "AI-generated": (1) cream + serif + terracotta, (2) dark + neon-green/vermilion tunggal, (3) broadsheet dense-column. Rekomendasi arah:

- **Warna**: dasar netral gelap-kebiruan `#0B0F14` (bukan pure black), teks `#E8ECEF`, aksen tunggal **amber-gold** `#D4A24E` (dipakai sangat terbatas — CTA, node timeline aktif, garis progress), abu-kebiruan untuk card `#151B23`, garis pemisah halus `#2A323C`.
- **Tipografi**: display face dengan karakter grotesk-technical (contoh: *Space Grotesk* atau *General Sans*) untuk headline — bukan serif klasik (terlalu "editorial", kurang cocok untuk engineer positioning); body face humanis-netral (*Inter* atau *IBM Plex Sans*) untuk keterbacaan panjang di case study; monospace (*JetBrains Mono* atau *IBM Plex Mono*) untuk label kecil, tanggal timeline, badge tech-stack — ini elemen yang menegaskan "engineer" tanpa harus bilang.
- **Signature element**: career timeline sebagai **node graph vertikal interaktif** — bukan progress bar generik, tapi tiap node (Junior → SE → Senior → Tech Lead) bisa di-hover/tap untuk expand detail achievement tahun itu, dengan garis penghubung yang "menggambar" saat di-scroll (stroke-dashoffset animation). Ini legitimate dipakai sebagai numbered sequence karena memang benar linear career progression kamu — bukan numbering dekoratif.

### Struktur halaman (single-page scroll + halaman detail terpisah untuk case study)

```
┌─────────────────────────────────────┐
│ NAVBAR (sticky, transparent→solid)   │
├─────────────────────────────────────┤
│ HERO                                 │
│ - Headline: bukan "Hi, I'm Royhan"   │
│   generik, tapi statement spesifik:  │
│   mis. "I design payroll systems     │
│   that don't get tax calculations    │
│   wrong." + role/subtitle            │
│ - Micro-animation: garis kode/log    │
│   yang "typing" ringan (opsional,    │
│   respect prefers-reduced-motion)    │
├─────────────────────────────────────┤
│ ABOUT (ringkas, 2-3 kalimat + CTA    │
│ ke resume PDF)                       │
├─────────────────────────────────────┤
│ CAREER TIMELINE (signature element,  │
│ interactive node graph)              │
├─────────────────────────────────────┤
│ FLAGSHIP CASE STUDY PREVIEW          │
│ (payroll system — card besar,        │
│  klik → /work/payroll-system)        │
├─────────────────────────────────────┤
│ OTHER PROJECTS (grid 2 kolom)        │
├─────────────────────────────────────┤
│ TECH STACK (grouped by role: FE/BE/  │
│ Infra — bukan cloud tag acak)        │
├─────────────────────────────────────┤
│ CONTACT CTA + FOOTER                 │
└─────────────────────────────────────┘
```

Halaman `/work/[slug]` untuk case study detail: format long-form dengan heading terstruktur (Problem → Constraint/Decision → Trade-off → Result), diagram arsitektur sederhana (SVG statis, bukan diagram interaktif berat), dan blok "what I'd do differently" — ini yang paling dihargai reviewer senior karena menunjukkan reflektif thinking.

### Motion & performa
- Page-load: satu orchestrated sequence di hero saja (headline fade-up staggered + garis aksen menggambar). Jangan re-run animasi berat di setiap section saat scroll — gunakan `scroll-reveal` ringan (opacity+translateY 20px, threshold-based, IntersectionObserver) untuk section lain.
- Timeline node graph: animasi stroke path pakai CSS/SVG native (bukan library berat) supaya ringan.
- Hover micro-interaction: card project & tech badge cukup scale 1.02 + shadow, tidak perlu 3D tilt kompleks.
- Wajib: `prefers-reduced-motion` dihormati (disable semua transform animation, sisakan fade saja).
- Gambar: pakai `next/image` dengan format AVIF/WebP, lazy load di bawah fold.
- Font: preload hanya display+body face, monospace di-load on-demand kalau dipakai sedikit.
- Lighthouse target: Performance ≥ 90, CLS ~0, karena ini portfolio engineer — recruiter teknis kadang benar-benar cek network tab.

**Catatan meragukan #4 — Dark mode toggle:** Karena arah desain sudah dark-based by default (cocok dengan positioning technical), light mode toggle menambah effort desain 2x tanpa banyak value tambahan untuk portfolio kecil. Rekomendasi: **skip theme toggle**, fokuskan effort ke satu tema gelap yang benar-benar matang. Kalau nanti mau nambah, `next-themes` gampang di-retrofit.

---

## 5. Step Pengerjaan (Task ID: `PBW-XX`)

Mengikuti pola task ID yang sudah kamu pakai di project payroll (FE-Txx, TAX-xxx) — dipakai di sini dengan prefix `PBW` (Personal Branding Website).

| Task ID | Fase | Deskripsi | Output |
|---|---|---|---|
| **PBW-00** | Repo & CI/CD setup | Init repo lokal → push ke **GitHub duluan** → connect repo ke **Vercel** (Git Integration, domain `*.vercel.app`) → tambah workflow **GitHub Actions** (`lint` + `tsc --noEmit` + `next build`) yang jalan di tiap PR sebagai quality gate. Baru setelah ini scaffold Next.js 15 + TS + Tailwind v4 + shadcn/ui | Repo GitHub aktif, auto-deploy preview jalan tiap push, CI check hijau di PR pertama |
| **PBW-01** | Design tokens | Finalisasi palet warna, type scale, spacing scale jadi CSS vars di `globals.css` | `globals.css` dengan token lengkap |
| **PBW-02** | Content inventory | Draft copy non-case-study: headline hero, about, ringkasan career per fase, tech stack grouping. **Case study payroll TIDAK ditulis di sini** (lihat PBW-18) | `content/copy-draft.md` |
| **PBW-03** | Layout shell | Navbar + footer + root layout, font loading via `next/font` | Shell jadi, belum ada konten section |
| **PBW-04** | Hero section | Bangun hero + page-load animation, cek reduced-motion fallback | `components/sections/hero.tsx` |
| **PBW-05** | About section | Section about + CTA download resume | `components/sections/about.tsx` |
| **PBW-06** | Career timeline (signature) | Node graph interaktif, data dari `lib/constants.ts` | `components/sections/career-timeline.tsx` + `motion/timeline-node.tsx` |
| **PBW-07** | MDX pipeline (space only) | Setup loader MDX + tipe frontmatter + folder `content/work/`. **Isi hanya 1-2 file placeholder** (`_placeholder.mdx`) supaya routing `/work/[slug]` bisa dites — konten asli payroll system menyusul di PBW-18 | `lib/mdx.ts`, `types/work.ts`, folder siap pakai |
| **PBW-08** | Work preview + grid project lain | Section preview di homepage + grid project sekunder, render dari placeholder MDX dulu | `work-preview.tsx`, `/work/page.tsx` |
| **PBW-09** | Tech stack section | Grouped badge (FE/BE/Infra), pakai monospace label | `tech-stack.tsx` |
| **PBW-10** | Contact CTA + footer links | Direct contact links (email/WA/LinkedIn), copy-email button | `contact-cta.tsx` |
| **PBW-11** | Scroll-reveal pass | Terapkan `scroll-reveal` wrapper ke semua section non-hero, tuning threshold | Semua section reveal halus, tidak jank |
| **PBW-12** | Responsive pass | Uji breakpoint mobile/tablet, khusus timeline node graph (kemungkinan perlu layout beda di mobile: vertikal simple list) | Semua section responsive down to 360px |
| **PBW-13** | Accessibility pass | Keyboard focus visible, alt text, contrast check (WCAG AA), `prefers-reduced-motion` final check | Checklist a11y lolos |
| **PBW-14** | Performance pass | Audit Lighthouse, optimasi image/font, cek bundle size (`next build` output) | Lighthouse Performance ≥ 90 |
| **PBW-15** | SEO & metadata | `metadata` per halaman, OG image, sitemap, robots.txt | Meta lengkap, OG image custom (bukan default) |
| **PBW-16** | Analytics | Pasang Vercel Analytics/Plausible | Tracking aktif tanpa cookie banner |
| **PBW-17** | Deploy production checks | Review env vars, cek semua CI check hijau, pastikan `main` selalu deployable | Production stabil di domain `*.vercel.app` |
| **PBW-18** | **Case study: Payroll System** (dikerjakan terakhir) | Kamu fokus nulis konten dulu (Problem → Decision → Trade-off → Result) + diagram arsitektur SVG statis. Space & routing sudah siap dari PBW-07, tinggal isi & ganti placeholder | `content/work/payroll-system.mdx` tayang di `/work/payroll-system` |
| **PBW-19** | Content polish (iteratif) | Revisi copy setelah dapat feedback (teman/mentor/recruiter), tambah project baru ke `/work` seiring waktu | Ongoing, bukan one-time |

**Rekomendasi cara eksekusi:** Karena kamu sudah punya kebiasaan minta rekomendasi model+effort per prompt dev, saran saya untuk fase ini:
- **PBW-00** (repo, CI/CD, scaffold): task mekanis tapi banyak moving parts (GitHub + Vercel + Actions) → **Sonnet, effort menengah**, kerjakan sebagai prompt tersendiri, jangan digabung fase lain.
- **PBW-01 s/d PBW-03** (token, copy draft, shell): **Sonnet, effort rendah-menengah**.
- **PBW-04, PBW-06** (hero & signature timeline — perlu presisi animasi/interaksi): **Sonnet, effort tinggi**, karena ini elemen yang paling menentukan kesan pertama.
- **PBW-07** (MDX pipeline + placeholder): **Sonnet, effort rendah-menengah** — ini murni plumbing, isi konten belum masuk di sini.
- **PBW-11 s/d PBW-16** (scroll-reveal, responsive, a11y, perf, SEO, analytics): **Sonnet, effort menengah**, pola-pola standar yang butuh ketelitian checklist, bukan reasoning berat.
- **PBW-18** (case study payroll — dikerjakan paling akhir): tulis **kontennya sendiri dulu** (kamu yang paling paham trade-off nyata dari kerjaan real), baru minta Claude bantu structuring/polish bahasa Inggris. Jangan minta Claude generate cerita teknis dari nol — detail arsitektur harus akurat dari pengalaman kamu, bukan asumsi.

---

## 6. Keputusan Final

| # | Keputusan | Status |
|---|---|---|
| 1 | Flagship case study = payroll system, level detail teknis | ✅ Disetujui |
| 2 | Contact via direct links (bukan form backend) | ✅ Disetujui |
| 3 | Website full English | ✅ Disetujui |
| 4 | Dark-only, tanpa theme toggle | ✅ Disetujui |
| 5 | Domain: `*.vercel.app` (free) dulu, custom domain menyusul | ✅ Disetujui |
| 6 | Deploy via GitHub → Vercel Git Integration + GitHub Actions sebagai CI gate | ✅ Ditambahkan |
| 7 | PBW-18 (case study payroll) dikerjakan paling akhir, space/routing disiapkan lebih awal di PBW-07 | ✅ Ditambahkan |

Semua asumsi sudah terkunci. Tinggal eksekusi mulai **PBW-00**.
