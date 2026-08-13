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
| RAG chatbot | `ai`, `@ai-sdk/groq`, `@ai-sdk/react`, `@huggingface/transformers`, `@upstash/redis`, `@upstash/ratelimit` | lihat §10 |

Satu-satunya backend API sungguhan adalah `app/api/chat/route.ts` (Node runtime, bukan Edge) untuk chatbot RAG — lihat §10. Selain itu tidak ada database, tidak ada API lain kecuali route metadata Next.js (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`). Semua konten lain statis, di-generate saat build (`generateStaticParams` untuk tiap locale).

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

app/api/chat/route.ts               # endpoint chatbot RAG, Node runtime (lihat §10)
middleware.ts                       # geo-redirect + locale rewrite (lihat §4)

components/
├── sections/       # tiap section homepage (act-one..act-five, work-preview, testimonials, who-for, tech-stack, contact-cta, architecture-story)
├── chat/           # widget "Tanya tentang Royhan": hero-ask-bar, chat-conversation, chat-icons, faq-accordion (lihat §10)
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

scripts/rag/                        # pipeline build-time indexing chatbot (lihat §10)
├── collect-sources.ts              # kumpulkan + chunk semua sumber konten
├── build-index.ts                  # generate lib/rag/index.json (npm run rag:build)
└── *.test.ts

lib/
├── constants.ts               # data language-independent: anchor, urutan act, contact links, tech stack list
├── testimonials.ts            # array kosong sampai diisi manual
├── mdx.ts                     # loader + parser MDX, locale fallback ke English
├── utils.ts                   # cn() helper
├── rag/
│   ├── index.json               # vector index statis, di-commit ke repo (lihat §10)
│   ├── retrieve.ts              # retrieval runtime: embed query, cosine similarity, relevance gate
│   └── retrieve.test.ts
└── i18n/
    ├── config.ts                # LOCALES, path helpers (localePath, switchLocalePath)
    ├── dictionaries/{en,id}.ts  # SEMUA prose/copy UI, termasuk dict.askRoyhan (§10)
    └── index.ts                 # getDictionary(), fill() interpolation

types/work.ts, types/writing.ts   # tipe frontmatter MDX
public/
├── llms.txt                     # ringkasan situs untuk AI crawler, juga di-index chatbot (§10)
├── royhan-resume.pdf
└── images/, videos/             # taruh profile.jpg / intro.mp4 di sini untuk aktivasi (§7)

.rag-models/                        # cache model embedding, gitignored — lihat §10
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
- **`lib/rag/index.json` bukan build artifact biasa** — dia di-commit ke git sengaja (bukan digenerate tiap `next build`, bukan di `.gitignore`). Kalau lihat file JSON besar di root `lib/rag/`, itu bukan sampah, itu data chatbot — lihat §9.1 sebelum menghapus/mengabaikannya di PR review.
- **`.rag-models/` gitignored tapi wajib ada saat deploy** — diisi otomatis lewat script `vercel-build` di `package.json` (§9.1), bukan sesuatu yang perlu diaktifkan manual di Vercel dashboard. Kalau chatbot tiba-tiba lambat/gagal di production karena mencoba fetch model dari Hugging Face CDN saat cold start, cek dulu apakah `vercel-build` masih ada & tidak sengaja terhapus, baru cek `outputFileTracingIncludes` di `next.config.ts` (§9.4).

---

## 9. RAG chatbot — "Tanya tentang Royhan"

Widget tanya-jawab di dalam Hero, dijawab oleh LLM (Groq) yang dibatasi hanya boleh menjawab dari konten situs ini sendiri (RAG = retrieval-augmented generation). Tidak ada vector DB terkelola — korpusnya kecil (~110 chunk), jadi index-nya cukup satu file JSON statis + cosine similarity brute-force di JS.

Dua alur yang harus dipahami terpisah: **build-time** (bikin index, manual, jarang jalan) dan **runtime** (jawab pertanyaan user, tiap request).

### 9.1 Build-time: bikin `lib/rag/index.json`

```
scripts/rag/collect-sources.ts     scripts/rag/build-index.ts
  baca semua sumber       ──▶        embed tiap chunk         ──▶   lib/rag/index.json
  + chunking + overlap               (Xenova/multilingual-e5-small)  (di-commit ke repo)
```

- **`collect-sources.ts`** — mengumpulkan teks dari: MDX case study & esai (`content/work`, `content/writing`, kedua locale), `public/llms.txt`, prosa dictionary (`hero`, `acts`, `architecture`, `dichotomy`, `whoFor`, `privacy`), dan fakta terstruktur dari `lib/constants.ts` (tech stack, contact) yang ditulis manual jadi kalimat deklaratif per locale. **Sengaja tidak pernah membaca** `content/copy-draft.md`, `ai_dev_doc.md`, atau `lib/testimonials.ts` — itu bukan sengaja lupa, itu information-disclosure control (lihat komentar `FORBIDDEN_TEXT_PATTERN` di file yang sama). Lalu setiap dokumen dipecah jadi chunk ~150–300 kata dengan overlap ~25 kata antar-chunk bersebelahan (supaya kalimat yang bersandar ke paragraf sebelumnya tidak kehilangan makna kalau diretrieve sendirian).
- **`build-index.ts`** (`npm run rag:build`) — embed tiap chunk pakai model `Xenova/multilingual-e5-small` lewat `@huggingface/transformers` (jalan di CPU, tanpa GPU), prefix `"passage: "` (konvensi E5 — lihat §9.4), lalu tulis `{ generatedAt, model, chunks: [{ id, text, source, url, locale, title, embedding }] }` ke `lib/rag/index.json`.
- **Lokal**: wajib dijalankan manual & di-commit ulang setiap kali MDX, dictionary yang di-index, atau `lib/constants.ts` berubah — index **tidak** digenerate otomatis saat `next build` biasa (`npm run build`). Lupa rebuild = `next dev`/`next start` lokal menjawab dari konten lama.
- **Di Vercel beda ceritanya**: `package.json` punya script `vercel-build` (`rag:build && next build`) yang otomatis dipakai Vercel menggantikan `build` biasa (konvensi Vercel, tanpa perlu ubah setting apa pun di dashboard) — jadi index **selalu** di-generate ulang tiap deploy, terlepas dari `lib/rag/index.json` yang di-commit sudah basi atau belum. Ini bukan cuma jaring pengaman konten: `.rag-models/` (bobot model, lihat baris berikutnya) gitignored, jadi checkout Vercel yang bersih tidak punya folder itu sama sekali — `rag:build` di build step-lah yang mengisinya, supaya `outputFileTracingIncludes` (`next.config.ts`) punya sesuatu untuk di-bundle ke function. Tanpa ini, function production akan mencoba fetch model dari Hugging Face CDN saat cold start, bukan dari cache lokal.
- Model weight (~118MB, quantized `q8`) di-cache di `.rag-models/` (gitignored) — kalau belum ada, `rag:build` akan download dari Hugging Face Hub otomatis di run pertama (lokal maupun di build Vercel).

### 9.2 Runtime: jawab satu pertanyaan

```
ChatConversation          POST /api/chat                 lib/rag/retrieve.ts
(useChat, client)   ──▶   route.ts (Node runtime)   ──▶   embed query + cosine
                             │  │                          similarity ke semua
                             │  └─ rate limit (Upstash)     chunk index.json
                             │
                             ├─ relevance gate (§9.3) ── gagal? balas deterministik,
                             │                            Groq TIDAK pernah dipanggil
                             ▼
                        streamText() (Groq) + system prompt berisi
                        top-K chunk berlabel sumber ──▶ stream balik ke client
                        (data-citations part + text part)
```

Urutan validasi di `route.ts`, dari paling murah ke paling mahal (setiap langkah bisa menolak sebelum langkah berikutnya jalan): method guard (native Next.js, cuma `POST` yang di-export) → `Origin`/`Referer` harus cocok `SITE_URL` → parse & validasi body (locale whitelist `en`/`id`, panjang pesan ≤500 char, riwayat dipotong ke 10 pesan terakhir) → rate limit (15 req/menit/IP, key di-hash SHA-256 sebelum masuk Upstash, **fail-open** kalau Upstash down) → `retrieveTopK` → relevance gate → `streamText`.

### 9.3 Relevance gate — kenapa bukan cosine similarity mentah

`lib/rag/retrieve.ts` mengekspor `RELEVANCE_THRESHOLD` yang dibandingkan ke **z-score** top-1 (`topRelevance`), bukan skor cosine mentah (`topScore`). Sudah dicoba pakai cosine mentah dulu — gagal, karena model `multilingual-e5-small` punya baseline similarity yang tinggi & sempit untuk teks apa pun, sampai-sampai query off-topic ("resep nasi goreng") bisa skor lebih tinggi dari query on-topic. Z-score (skor top-1 dibanding rata-rata+std seluruh index untuk query yang sama) memisahkan cluster on-topic/off-topic jauh lebih baik. **Kalau nanti mau utak-atik threshold ini, baca komentar panjang di atas `RELEVANCE_THRESHOLD` dulu** — di situ ada tabel kalibrasi empiris lengkap, jangan tebak angka baru tanpa mengulang proses itu.

Query yang lolos gate tapi jawabannya tetap tidak ada di konteks (mis. "siapa istri Royhan?") ditangani lapisan kedua: instruksi system prompt (`buildSystemPrompt` di `route.ts`) yang eksplisit melarang mengarang fakta di luar konteks yang diretrieve.

### 9.4 Detail yang gampang salah kalau nambah fitur di sini

- **`useChat` versi ini (AI SDK v7 / `@ai-sdk/react` v4) tidak mengelola state input sendiri** — beda dari tutorial/contoh lama yang masih pakai `input`/`handleInputChange`. Teks dipegang manual lewat `useState` di `ChatConversation`, submit lewat `sendMessage({ text })`.
- **Prefix E5 asimetris**: dokumen di-embed dengan `"passage: "` (build-time), query dengan `"query: "` (runtime, di `embedQuery()`). Ketuker salah satu → kualitas retrieval turun drastis tanpa error apa pun yang kelihatan.
- **Sitasi cuma boleh datang dari `data-citations` part** yang dikirim server (`route.ts`) — `ChatConversation` sengaja tidak pernah parse URL dari teks jawaban LLM. Ini kontrol keamanan (cegah LLM yang "dijailbreak" bikin link palsu), bukan sekadar gaya kode — jangan "disederhanakan" jadi regex parse.
- **`HeroAskBar` dan `ChatConversation` sengaja dua komponen terpisah** (`components/chat/`): `HeroAskBar` eager (tanpa dependency AI SDK), `ChatConversation` di-lazy-load lewat `next/dynamic({ ssr: false })` baru saat user pertama kali berinteraksi. Jangan gabungkan jadi satu file — itu akan menyeret `@ai-sdk/react` masuk ke initial bundle Hero.
- **`ChatConversation` tidak pernah unmount saat panel di-collapse** — `HeroAskBar` menjaganya tetap mounted (cuma disembunyikan lewat CSS grid-row) supaya histori percakapan tidak hilang kalau user tutup-buka lagi.
- **`next.config.ts` punya `outputFileTracingIncludes` untuk `.rag-models/`** — wajib ada karena `@huggingface/transformers` membaca folder model lewat scan filesystem dinamis, bukan `import`/`require` statis, jadi Next's file tracer tidak otomatis mendeteksinya untuk deployment Vercel. Jangan dihapus tanpa alasan kuat.
- **Semua string UI widget** (`placeholder`, `suggestedPrompts`, `faq.items`, pesan error) ada di `dict.askRoyhan` (§4 — pola dictionary yang sama berlaku di sini).

### 9.5 Debugging cepat

| Gejala | Cek dulu |
|---|---|
| Chatbot jawab dari konten lama/salah | Sudah `npm run rag:build` ulang setelah edit MDX/dictionary/constants? Sudah di-commit `lib/rag/index.json`-nya? |
| Semua pertanyaan kena respons "di luar cakupan" | `RELEVANCE_THRESHOLD` kegedean, atau index kosong/corrupt — cek `lib/rag/index.json` ter-generate benar |
| 500 di `/api/chat` lokal | Cek `.env`/`.env.local` punya `GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — tanpa itu beberapa jalur (bukan semua, rate-limiter fail-open) akan gagal |
| 403 terus-terusan saat testing lokal | `Origin` header request harus persis sama dengan `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) — port dev server kamu beda? |
| Build gagal soal `@huggingface/transformers` di client bundle | Pastikan modul itu cuma diimpor dari `app/api/chat/route.ts` dan `scripts/rag/*`, tidak pernah dari `components/chat/*` |

---

## 10. Kalau kamu mau...

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
| Chatbot jawab dari konten terbaru | `npm run rag:build` lalu commit `lib/rag/index.json` (§9.1) |
| Tambah/ubah sumber yang boleh dijawab chatbot | `scripts/rag/collect-sources.ts`, lalu `npm run rag:build` (§9.1) |
| Ubah teks widget chatbot (placeholder, chip, FAQ) | `dict.askRoyhan` di kedua dictionary (§4, §9.4) |
| Debug kenapa chatbot menolak/salah jawab | §9.5 |
