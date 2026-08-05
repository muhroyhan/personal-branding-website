# Tech Manual — Personal Branding Website

Panduan teknis cepat untuk memahami codebase ini. Untuk *kenapa* keputusan desain/produk diambil, baca [`ai_dev_doc.md`](./ai_dev_doc.md) (§7-nya paling akurat ke kondisi sekarang). Dokumen ini fokus ke *bagaimana* kode disusun dan cara kerja tiap bagian, supaya kamu bisa langsung ubah sesuatu tanpa harus reverse-engineer dulu.

---

## 1. Quick start

```bash
npm install
npm run dev            # http://localhost:3000
npm run build           # production build
npm run start            # jalankan hasil build
npm run lint              # eslint
npx tsc --noEmit           # typecheck saja, tanpa output
```

Branch flow: kerja harian → PR ke `develop` → merge → PR `develop` ke `main` → merge `main` = deploy production (Vercel). Detail lengkap + checklist setup manual (Vercel, env var, branch protection, dst) ada di `README.md` — itu sumber kebenarannya, jangan dobel-catat di sini.

---

## 2. Stack

| Layer | Package | Catatan |
|---|---|---|
| Framework | `next@15` (App Router), `react@19` | RSC by default; komponen interaktif ditandai `"use client"` eksplisit |
| Bahasa | TypeScript | strict, `tsc --noEmit` adalah salah satu CI gate |
| Styling | `tailwindcss@4`, `tw-animate-css`, `shadcn` | Tailwind v4 pakai `@theme inline` di CSS, bukan `tailwind.config.js` |
| Animasi | `motion` (ex-Framer Motion) | scroll-linked (`useScroll`), viewport-triggered (`whileInView`), dan `MotionConfig reducedMotion="user"` global |
| Konten | `next-mdx-remote` (RSC variant), `gray-matter`, `remark-gfm` | case study & esai ditulis sebagai `.mdx` + frontmatter |
| Analytics | `@vercel/analytics` | dipasang di root layout, tanpa cookie banner |
| Utility | `clsx`, `tailwind-merge` | lewat `lib/utils.ts` |

Tidak ada database, tidak ada backend API selain route metadata Next.js (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`). Semua konten statis, di-generate saat build (`generateStaticParams` untuk tiap locale).

---

## 3. Peta folder (kondisi aktual, bukan rencana awal)

```
app/
├── globals.css                    # semua design token (warna, font, type scale)
├── robots.ts, sitemap.ts          # metadata routes, locale-aware
├── apple-icon.tsx
└── [locale]/                      # "en" | "id" — lihat §4
    ├── layout.tsx                 # font loading, <html lang>, JSON-LD, generateMetadata (hreflang)
    ├── page.tsx                   # homepage: orkestrasi 5 babak + evidence layer
    ├── opengraph-image.tsx
    ├── privacy/page.tsx
    ├── work/
    │   ├── page.tsx                # daftar case study
    │   └── [slug]/page.tsx          # detail case study, render MDX
    └── writing/
        ├── page.tsx
        └── [slug]/page.tsx

middleware.ts                       # geo-redirect + locale rewrite (lihat §4)

components/
├── sections/       # tiap section homepage (act-one..act-five, work-preview, testimonials, who-for, tech-stack, contact-cta, architecture-story)
├── story/          # story-rail (progress nav), act-heading
├── motion/         # scroll-reveal, carved-text — wrapper animasi reusable
├── motifs/         # SVG dekoratif: blueprint-grid, live-blueprint, meander-rule, lambda-mark, act-silhouette
├── layout/         # navbar, footer, language-switcher
├── ui/             # term-tooltip, profile-photo, video-intro (placeholder graceful-degrade)
├── writing/        # reading-progress, writing-card
├── icons/          # logomark
└── mdx/            # prose.ts — styling untuk konten MDX yang di-render

content/
├── work/{en,id}/*.mdx        # case study, slug = nama file
└── writing/{en,id}/*.mdx     # esai, slug = nama file

lib/
├── constants.ts               # data language-independent: anchor, urutan act, contact links, tech stack list
├── testimonials.ts            # array kosong sampai diisi manual
├── mdx.ts                     # loader + parser MDX, locale fallback ke English
├── utils.ts                   # cn() helper
└── i18n/
    ├── config.ts                # LOCALES, path helpers (localePath, switchLocalePath)
    ├── dictionaries/{en,id}.ts  # SEMUA prose/copy UI
    └── index.ts                 # getDictionary(), fill() interpolation

types/work.ts, types/writing.ts   # tipe frontmatter MDX
public/
├── llms.txt                     # ringkasan situs untuk AI crawler
├── royhan-resume.pdf
└── images/, videos/             # taruh profile.jpg / intro.mp4 di sini untuk aktivasi (§7)
```

---

## 4. Sistem i18n — bagian paling non-obvious di codebase ini

Prinsip kunci: **English memegang bare path (`/`, `/work`), Indonesian selalu diprefix (`/id`, `/id/work`)**. Ini bukan default Next.js — butuh middleware untuk mensimulasikannya.

**Alurnya:**

1. Request masuk ke `middleware.ts`.
2. Kalau path sudah `/id/...` → biarkan lewat apa adanya, cuma stempel cookie `NEXT_LOCALE=id`.
3. Kalau path bukan `/id/...` (berarti calon bare-path English) → middleware cek cookie `NEXT_LOCALE` dulu. Kalau belum ada cookie, geolocate lewat header `x-vercel-ip-country` (Vercel-only, kosong di local dev) → IP Indonesia di-**redirect** ke `/id/...` sekali, lalu dikunci ke cookie. Selain itu, **rewrite** (bukan redirect, URL bar tidak berubah) ke `/en/...` secara internal supaya match struktur folder `app/[locale]/`.
4. Kenapa harus ada `app/[locale]/` untuk English juga kalau URL-nya bare? Karena route Next.js App Router butuh direktori fisik untuk di-match — middleware yang menjembatani "URL publik bare" dengan "internal route `/en`".

**Dua path helper yang gampang tertukar — jangan salah pakai:**
- `localePath(locale, path)` di `lib/i18n/config.ts` — untuk href yang **terlihat user** (skip prefix untuk English). Pakai ini di semua komponen (`Navbar`, dst).
- `withLocalePrefix(locale, pathname)` di `middleware.ts` — untuk rewrite target **internal**, selalu prefix termasuk English. Jangan pernah pakai ini di komponen React.

**Ganti bahasa manual** (`LanguageSwitcher`): set cookie *sebelum* navigasi (bukan sesudah) + `prefetch={false}` pada `Link`-nya. Kalau kamu lupa salah satu, klik EN↔ID akan terlihat "nyangkut"/tidak berubah — root cause-nya sudah didokumentasikan panjang di komentar `components/layout/language-switcher.tsx`, baca itu dulu sebelum utak-atik logic ini.

Loading state tombol EN/ID pakai `useLinkStatus()` dari `next/link`, dipanggil dari komponen anak kecil (`LocaleLabel`) yang dirender **di dalam** `<Link>`, bukan dibaca dari komponen induk — itu satu-satunya cara tahu link *mana* yang sedang pending waktu ada dua `Link` bersebelahan di DOM, karena hook ini scoped ke navigasi milik Link terdekat di atasnya, bukan ke navigasi apa pun secara global.

**Semua string UI ada di `lib/i18n/dictionaries/{en,id}.ts`.** Kedua file itu punya shape identik (`en` adalah source of truth tipe — `Dictionary = typeof en`), TypeScript akan error kalau `id.ts` kekurangan key. `lib/constants.ts` sengaja tidak boleh berisi kalimat/prose — kalau kamu nemu string bahasa manusia di situ, itu sinyal harusnya pindah ke dictionary.

---

## 5. Sistem konten (MDX)

Case study (`/work`) dan esai (`/writing`) pakai pipeline yang identik lewat `lib/mdx.ts`:

- Slug **dibagi lintas locale** — `content/work/en/payroll-system.mdx` dan `content/work/id/payroll-system.mdx` adalah case study yang sama di dua bahasa, bukan dua entri terpisah. `getAllWorkSlugs()` gabungkan slug dari kedua folder locale.
- Kalau versi terjemahan untuk satu slug belum ada, `readLocalisedFile()` **fallback otomatis ke English** — jadi kamu bisa publish case study baru dalam satu bahasa dulu tanpa menunggu terjemahan, tanpa 404.
- Frontmatter wajib: `title`, `slug`, `summary`, `tech: string[]`, `date` (ISO, untuk sorting saja), opsional `period` (string tampilan, mis. `"2024 — 2026 · Team Lead"`), `featured?: boolean`.
- GFM (`remark-gfm`) aktif — tabel markdown akan ter-render benar (dipakai di case study Indonesia yang buka dengan tabel ringkasan).

**Cara nambah case study baru:** buat `content/work/en/nama-slug.mdx` dengan frontmatter di atas → otomatis muncul di `/work` dan (kalau `featured: true`) di homepage `WorkPreview`. Tambah versi `content/work/id/nama-slug.mdx` kalau mau override fallback English.

---

## 6. Desain: token, bukan nilai hardcode

Semua warna/font/type-scale didefinisikan sekali di `app/globals.css` sebagai CSS variable, lalu dipetakan ke Tailwind v4 lewat `@theme inline` (bukan `tailwind.config.js` — itu pola lama Tailwind v3). Jangan pernah hardcode hex/px di komponen; selalu pakai class semantik (`text-fg`, `bg-card`, `text-accent`, `border-border-strong`, `text-h2`, `font-mono`, dst).

**Palet inti** (`app/globals.css`): bg `#0d0b0a`, fg `#ece6da`, card `#17140f`, accent tunggal `#d4a24e` (dipakai sangat terbatas — CTA, node aktif, garis progres). `--border` untuk divider dekoratif saja (kontras di bawah 3:1, tidak boleh dipakai sebagai batas komponen interaktif); `--border-strong` (3.92:1) untuk apa pun yang harus terbaca sebagai tombol/card/edge yang bisa diklik.

**5 font**, tiap satu punya peran ketat — jangan campur:
- `--font-display` (Cormorant Garamond) — headline panjang.
- `--font-inscribed` (Cinzel) — **hanya** angka Romawi babak (I–V) dan label pendek "carved". Jangan dipakai untuk running text, terlalu berat dibaca panjang.
- `--font-lambda` (EB Garamond) — **hanya** untuk glyph λ (`LambdaMark`), karena Cormorant tidak punya subset Yunani.
- `--font-body`/`--font-sans` (Inter) — body text.
- `--font-mono` (JetBrains Mono) — nav, label, caption, tanggal, badge tech-stack.

`prefers-reduced-motion` dihormati di dua tempat sekaligus, jangan cuma patch satu: (1) `MotionConfig reducedMotion="user"` di root layout untuk animasi Motion biasa, dan (2) override CSS manual di `globals.css` untuk scroll-linked values (`useScroll`/`useSpring`) yang bind langsung ke style prop dan **melewati** mekanisme MotionConfig.

---

## 7. Pola komponen yang berulang, kenali sekali biar tidak bingung tiap section baru

**Section homepage standar** (lihat `who-for.tsx`, `testimonials.tsx` sebagai contoh paling sederhana): terima `dict` (dan kadang `locale`) sebagai prop, dibungkus `<ScrollReveal>` dari pemanggilnya di `page.tsx`, pakai `CarvedText` untuk heading dan `MeanderRule` sebagai divider dekoratif. Section IV (`ArchitectureStory`, payroll) sengaja **tidak** dibungkus `ScrollReveal` — dia scroll-driven sendiri (`useScroll` + sticky diagram), wrapper transform akan merusak sticky-nya.

**Placeholder graceful-degrade** (`ProfilePhoto`, `VideoIntro`, dan `Testimonials` lewat array kosong): komponen render `null` sampai asetnya benar-benar ada, jadi aman di-deploy sebelum konten final siap. **Cara aktivasi:**
- Foto profil: taruh file di `public/images/profile.jpg` (~480×480, crop persegi karena dirender lingkaran). Tidak ada perubahan kode.
- Video intro: taruh file di `public/videos/intro.mp4`. Tidak ada perubahan kode.
- Testimoni: isi array `TESTIMONIALS` di `lib/testimonials.ts` (`quoteEn` wajib, `quoteId` opsional — fallback ke `quoteEn` kalau orangnya memang tidak bicara Indonesia).

**Anchor scroll** (`ACT_ANCHORS` di `lib/constants.ts`): `id` section dipakai ganda sebagai anchor link (`#act-payroll`) dan target `IntersectionObserver` `StoryRail`. Ganti salah satu tanpa yang lain akan diam-diam merusak nav aktif di `StoryRail` atau link di navbar/footer — grep semua pemakaian `ACT_ANCHORS` sebelum rename key-nya.

---

## 8. Gotcha yang sudah pernah ditemukan (baca sebelum "memperbaiki")

- **`SITE_URL` fallback ke `localhost:3000`** di `lib/constants.ts` itu **disengaja**, bukan bug — didokumentasikan di `.env.example`. Yang wajib dicek kalau OG image/sitemap/JSON-LD salah di production adalah env var `NEXT_PUBLIC_SITE_URL` di Vercel, bukan kode ini.
- **Anchor href untuk locale `id`**: `localePath("id", "/#work")` harus collapse jadi `/id#work`, bukan `/id/#work` — kalau salah, klik nav dari halaman lain akan full-navigate dulu baru scroll, terasa patah. Logic collapse-nya ada di `localePath()`.
- **`ArchitectureStory` grid vs block**: wrapper dua-kolomnya sengaja `lg:grid` (bukan grid dari mobile) karena grid-container membuat sticky child terjebak setinggi grid area-nya sendiri dan tidak pernah nge-pin. Kalau mau ubah layout ini, baca komentar di file itu dulu.
- **`svh` bukan `vh`** dipakai di step-height `ArchitectureStory` — `vh` akan lompat-lompat di mobile saat browser chrome collapse/expand pas scroll.
- **CI jalan di PR ke `develop` *dan* `main`** (bukan cuma `main`) — kalau nambah workflow baru, jangan scope cuma ke `main`, itu pola lama yang sudah sengaja diperbaiki.

---

## 9. Kalau kamu mau...

| Mau ngapain | Mulai dari |
|---|---|
| Ganti/tambah teks UI | `lib/i18n/dictionaries/en.ts` **dan** `id.ts` (TypeScript akan protes kalau salah satu ketinggalan) |
| Tambah case study | `content/work/en/<slug>.mdx` (§5) |
| Tambah esai | `content/writing/en/<slug>.mdx`, pola sama |
| Tambah section baru di homepage | Buat di `components/sections/`, ikuti pola §7, daftarkan di `app/[locale]/page.tsx` dibungkus `<ScrollReveal>` |
| Ubah warna/font/spacing | `app/globals.css` saja — jangan hardcode di komponen |
| Aktifkan foto/video/testimoni | §7 "Placeholder graceful-degrade" |
| Tambah locale baru (mis. bahasa ketiga) | `lib/i18n/config.ts` (`LOCALES`), dictionary baru, `content/*/**` folder baru, cek ulang logic `middleware.ts` |
| Nambah link nav | `components/layout/navbar.tsx` (`navLinks`) + `footer.tsx` + label baru di kedua dictionary |
