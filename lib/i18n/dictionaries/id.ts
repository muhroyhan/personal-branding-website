import type { Dictionary } from "./en";

/**
 * Indonesian is a different *register*, not a translation of `en.ts`.
 *
 * Who reads this page: HR at large Indonesian companies — Astra, Tokopedia,
 * Shopee, Grab and their peers. They screen dozens of candidates a week and
 * give each one a minute at most. The English page can afford a five-act
 * narrative and a formal syllogism; this one cannot.
 *
 * Rules for this file:
 *   - short sentences, full stops over em dashes. Indonesian professional
 *     writing does not use the long appositive clauses English editorial does,
 *     and an em dash mid-sentence is the fastest way to sound translated
 *   - no calques. "least forgiving domain" is not "domain yang paling tidak
 *     memaafkan"; "clean answer" is not "jawaban bersih". Say the thing the
 *     way an Indonesian engineer would say it out loud
 *   - one voice: "saya" for me, "kita" when the point generalises. Never
 *     "Anda" in the reflective copy — it turns a reflection into a lecture
 *   - fact first, reasoning second. Never the reverse
 *   - earn the next scroll. Each act ends on something unresolved, because a
 *     reader with sixty seconds only continues if stopping costs them something
 *
 * Exception: `privacy` below addresses the reader directly ("Anda") rather
 * than reflecting in "saya/kita". That's the register an Indonesian privacy
 * notice is actually written in — a policy is not a story, and "kita" would
 * blur "the site" and "you" together in exactly the sentences where the
 * distinction matters most.
 *
 * Typed as `Dictionary`, so any key added to `en.ts` breaks the build here
 * rather than silently rendering English inside an Indonesian page.
 */
export const id: Dictionary = {
  meta: {
    // Deliberately not identical to the English title. Job titles stay in
    // English because that is how they are written in Indonesian job ads, but
    // the two <title> tags must differ or the pages compete in search results.
    title: "Muhammad Royhan — Senior Fullstack Engineer & Team Lead",
    description:
      "Senior Fullstack Engineer & Team Lead. 7 tahun, 3 promosi, satu perusahaan. Sistem payroll 800+ karyawan, kredit karyawan BPR, ERP dan marketplace. Node.js, NestJS, React, Next.js, Flutter, MySQL.",
    workTitle: "Proyek",
    workDescription:
      "Studi kasus sistem produksi yang dirancang dan dirilis Muhammad Royhan: payroll 800+ karyawan, kredit karyawan BPR.",
    writingTitle: "Tulisan",
    writingDescription:
      "Tulisan Muhammad Royhan tentang systems thinking dan filsafat Stoik dalam keputusan arsitektur perangkat lunak.",
    privacyTitle: "Privasi",
    privacyDescription: "Apa yang dikumpulkan situs ini, untuk apa, dan apa yang tidak.",
  },

  nav: {
    story: "Cerita",
    work: "Proyek",
    writing: "Tulisan",
    stack: "Stack",
    contact: "Kontak",
    resume: "CV",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    languageLabel: "Bahasa",
    switchTo: "Read in English",
    storyProgress: "Progres cerita",
  },

  hero: {
    name: "Muhammad Royhan",
    role: "Senior Fullstack Engineer · Team Lead",
    positioning: "Sistem yang salah angkanya berarti gaji orang tidak sampai — payroll, kredit, compliance.",
    headline: "Tujuh tahun membangun sistem yang tidak boleh salah.",
    leadBefore:
      "Backend dan frontend. Tujuh tahun, tiga promosi, satu perusahaan. Cara kerja saya bertumpu pada ",
    termOne: {
      label: "systems thinking",
      definition:
        "Memahami sistem dari cara bagian-bagiannya saling memengaruhi dari waktu ke waktu, bukan dari satu bagian yang dilihat terpisah.",
    },
    leadMiddle: " dan ",
    termTwo: {
      label: "fokus ke hal yang bisa dikendalikan",
      definition:
        "Dikotomi kendali dari Stoikisme: keluarkan tenaga hanya untuk hal yang benar-benar bisa kita pengaruhi, lalu rancang sistem untuk mengantisipasi sisanya.",
    },
    leadAfter: ", supaya sistemnya tetap bisa dirawat setelah saya serahkan.",
    ctaResume: "Unduh CV (PDF)",
    ctaWork: "Lihat proyek",
    proofLabel: "Rekam jejak",
    proof: [
      "7 tahun, 1 perusahaan",
      "3 promosi sampai Team Lead",
      "Payroll 800+ karyawan",
      "Perbankan · ERP · Marketplace",
    ],
    // The question HR actually has about a seven-year single-employer tenure.
    // Answering it before they ask is worth more than another adjective.
    scrollCue: "Tujuh tahun di satu perusahaan. Ini yang berubah tiap tahunnya",
  },

  acts: {
    beginnings: {
      year: "2019",
      role: "Junior Software Engineer",
      title: "Mulai dari kode legacy orang lain",
      paragraphs: [
        "Saya menghindari pekerjaan sebagai Software Engineer karena terlalu banyak saingan, tapi Moving Bytes Digital memberi saya kesempatan di tahun 2019. Pekerjaan pertama saya melanjutkan proyek ERP yang sudah berjalan, disusul proyek marketplace sewa barang yang sebelumnya sudah dikerjakan tim lain.",
        "Sampai 2021 saya merawat marketplace itu sembari membangun aplikasi mobile-nya bersama tim. Dari situ muncul pertanyaan yang saya bawa sampai sekarang. Bagaimana caranya mengambil keputusan yang benar kalau variabelnya bukan milik kita?",
      ],
    },
    banking: {
      year: "2022",
      role: "Senior Software Engineer",
      title: "Sistem bank, dari nol sampai serah terima",
      paragraphs: [
        "Tahun 2022 saya pegang sistem kredit karyawan untuk Bank Perkreditan Rakyat. Dari commit pertama sampai serah terima. Proyek pertama yang saya kerjakan sendiri dari awal, di bidang yang tidak menoleransi kesalahan sekecil apa pun.",
        "Di sistem kredit karyawan, tidak ada bug yang sifatnya cuma tampilan. Angka yang salah itu utang seseorang. Tapi yang paling banyak mengajari saya justru serah terimanya: kode yang dilepas ke tim lain harus bisa menjelaskan dirinya sendiri, tanpa saya di ruangan.",
      ],
    },
    inherited: {
      year: "2023",
      role: "Team Lead — Maintenance Sistem Legacy",
      title: "Dipromosikan untuk merawat sistem orang lain",
      paragraphs: [
        "Promosi Team Lead datang tahun 2023. Bukan yang membangun sistem baru, bukan juga yang memimpin proyek unggulan. Yang menjaga semua sistem yang sudah rilis tetap jalan.",
        "Hampir sepanjang tahun itu saya bekerja di dalam keputusan yang bukan saya buat, di kode yang tidak boleh saya tulis ulang, dengan tenggat yang bukan saya tentukan. Pelajarannya satu. Sistem yang kita lanjutkan hampir tidak pernah bisa kita kendalikan. Yang bisa kita kendalikan cuma satu: apakah orang berikutnya menerimanya dalam kondisi lebih jelas.",
      ],
      dichotomyIntro:
        "Setelah tujuh tahun, kira-kira begini saya memilahnya. Coba dulu beberapa sebelum lihat jawaban saya.",
    },
    payroll: {
      year: "2024",
      role: "Team Lead",
      title: "Payroll untuk 800+ karyawan",
      intro:
        "Dua tahun, dua sistem, satu engineer di masing-masing. Scroll untuk lihat bagaimana skalanya berubah, dan apa akibatnya ke arsitektur.",
    },
    now: {
      year: "Sekarang",
      role: "Team Lead",
      title: "Posisi saya sekarang",
      question:
        "Balik ke pertanyaan di awal. Bagaimana caranya mengambil keputusan yang benar kalau variabelnya bukan milik kita?",
      paragraphs: [
        "Sampai sekarang saya belum punya jawaban yang tepat. Saya sudah berhenti menunggu. Yang saya punya adalah prinsip kerja: pisahkan yang bisa dirancang (batas modul, kepemilikan, keterlacakan) dari yang cuma bisa dihadapi.",
        "Saya masuk bidang ini bukan karena passion. Saya bertahan karena ada orang yang bergantung pada hasil kerja saya. Ternyata itu alasan yang jauh lebih kuat.",
        "Di luar proyek payroll, Maret–Juni 2025 saya dipercaya perusahaan untuk proyek sampingan lintas negara. Semacam pembuktian apakah saya bisa sejajar dengan engineer dari negara lain.",
      ],
    },
  },

  architecture: {
    diagramLabel: "Diagram sistem payroll, tahap {step} dari {total}",
    runLabel: "PAYROLL RUN",
    auditLabel: "SETIAP ANGKA BISA DILACAK",
    steps: [
      {
        caption: "Satu perusahaan",
        body: "2024. Sistem payroll untuk perusahaan sendiri. Internal, skala kecil, risikonya masih terkendali. Kalau ada yang rusak, saya dengar langsung dari meja sebelah.",
      },
      {
        caption: "Setahun tanpa insiden",
        body: "Jalan benar selama setahun. Sistem itu lalu jadi fondasi untuk versi klien. Bukan bikin ulang, tapi melanjutkan.",
      },
      {
        caption: "800+ karyawan",
        body: "2025. Masalah yang sama, tapi untuk klien dengan lebih dari 800 karyawan. Di titik ini angka yang salah bukan lagi laporan bug. Itu gaji yang tidak sampai.",
      },
      {
        caption: "Setiap angka bisa dilacak",
        body: "Jadi saya dahulukan keterlacakan di atas kecepatan. Setiap angka bisa dilacak sampai ke sumbernya, setiap payroll run bisa dihitung ulang dari nol.",
      },
      {
        caption: "Rilis, dan masih jalan",
        body: "Rilis Juni 2026. Jalan terus sejak itu, dan sampai sekarang masih saya yang rawat.",
      },
    ],
    syllogismLabel: "Ringkasan prinsip",
    syllogism: [
      {
        label: "Premis I",
        text: "Salah hitung payroll bukan laporan bug. Itu gaji yang tidak sampai.",
      },
      {
        label: "Premis II",
        text: "Angka yang tidak bisa dihitung ulang dari sumbernya cuma bisa dipercaya, bukan diverifikasi.",
      },
      {
        label: "Kesimpulan",
        text: "Bangun supaya setiap angka bisa dihitung ulang. Kepercayaan bukan pengendalian.",
      },
    ],
    conclusionLabel: "Kesimpulan",
  },

  dichotomy: {
    controllable: "Bisa dikendalikan",
    uncontrollable: "Tidak bisa",
    verdictLabel: "Jawaban saya",
    sortLabel: "Pilah: {item}",
    items: {
      "inherited-code": {
        label: "Codebase yang kita lanjutkan",
        note: "Keputusan yang sudah terlanjur dibuat bukan pilihan kita. Yang jadi pilihan kita cuma satu: apakah orang berikutnya menerimanya lebih jelas.",
      },
      "client-deadline": {
        label: "Tenggat dari klien",
        note: "Jarang kita yang menentukan. Yang milik kita adalah sejujur apa kita menyusun scope terhadap tenggat itu.",
      },
      "codebase-structure": {
        label: "Struktur codebase",
        note: "Ini benar-benar milik kita. Sebagian besar pekerjaan ada di sini.",
      },
      "teammate-debugging": {
        label: "Cara rekan tim melakukan debugging",
        note: "Kita bisa kasih konteks dan dokumentasi. Kita tidak bisa memaksa orang berpikir dengan cara kita.",
      },
      "third-party-uptime": {
        label: "Apakah API pihak ketiga tetap hidup",
        note: "Yang bisa kita atur cuma perilaku sistem kita saat API itu mati.",
      },
      "test-coverage": {
        label: "Test coverage di kode yang kita rilis",
        note: "Tidak ada orang lain yang menentukan ini. Kalau tipis, itu keputusan kita sendiri.",
      },
    },
  },

  work: {
    eyebrow: "Bukti",
    heading: "Proyek Terpilih",
    intro: "Sistem produksi di balik cerita di atas, dibahas lengkap.",
    viewAll: "Lihat semua proyek →",
    pageHeading: "Proyek",
    pageIntro:
      "Sistem produksi yang saya rancang dan rilis. Apa kendalanya, apa keputusan saya, dan apa hasilnya.",
  },

  writing: {
    pageHeading: "Tulisan",
    pageIntro:
      "Tempat systems thinking dan filsafat Stoik bertemu keputusan teknis yang nyata.",
    empty: "Tulisan pertama sedang disiapkan. Silakan mampir lagi.",
  },

  testimonials: {
    eyebrow: "Kata mereka",
    heading: "Testimoni",
    intro: "Singkat, apa adanya, dari orang yang pernah bekerja langsung dengan saya.",
  },

  stack: {
    eyebrow: "Bukti",
    heading: "Tech Stack",
    intro: "Alat yang saya pakai. Dipilih karena tidak bikin kejutan waktu sistem lagi ramai.",
    groups: {
      frontend: "Frontend",
      backend: "Backend",
      infra: "Infra & Tools",
    },
  },

  whoFor: {
    eyebrow: "Kecocokan",
    heading: "Kapan saya cocok direkrut",
    intro: "Hubungi kalau situasinya salah satu dari ini.",
    bullets: [
      "Angka yang salah punya konsekuensi hukum atau finansial. Payroll, kredit, compliance, apa pun yang hasilnya ditandatangani orang.",
      "Codebase payroll, kredit, atau compliance yang sudah tidak ada lagi yang paham sepenuhnya.",
      "Tim kehilangan senior engineer yang memegang konteksnya.",
      "Sistem yang harus lolos audit, atau diserahterimakan ke tim yang tidak ikut membangunnya.",
    ],
    availabilityLabel: "Ketersediaan",
    availability: [
      "Remote-first",
      "WIB · UTC+7",
      "EOR, kontrak, atau full-time",
      "Notice period 2 minggu",
    ],
  },

  contact: {
    heading: "Sedang mencari Senior Fullstack Engineer atau Team Lead?",
    intro: "Silakan hubungi langsung, tidak perlu isi form.",
    videoLabel: "Tonton perkenalan 60 detik",
    copyEmail: "Salin email",
    copied: "Tersalin!",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    resume: "Unduh CV (PDF)",
  },

  footer: {
    rights: "Muhammad Royhan",
    email: "Email",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    github: "GitHub",
    resume: "CV",
    privacy: "Privasi",
  },

  privacy: {
    pageHeading: "Kebijakan Privasi",
    lastUpdated: "Terakhir diperbarui: Agustus 2026",
    intro:
      "Ini situs portofolio pribadi, bukan perusahaan. Jadi halaman ini singkat saja: apa yang dikumpulkan, untuk apa, dan apa yang tidak.",
    collectHeading: "Yang dikumpulkan",
    collectIntro: "Tiga hal saja, semuanya untuk keperluan situs. Bukan untuk melacak Anda.",
    collectTable: [
      {
        item: "Preferensi bahasa (cookie `NEXT_LOCALE`)",
        purpose:
          "Mengingat apakah Anda membaca versi Indonesia atau Inggris, supaya tidak dialihkan ulang setiap kunjungan.",
        retention: "1 tahun, atau sampai Anda hapus sendiri",
      },
      {
        item: "Perkiraan negara, dari penyedia hosting",
        purpose:
          "Dibaca sekali di edge server untuk menentukan pengalihan ke versi Indonesia saat kunjungan pertama. Tidak ada yang disimpan selain hasil akhirnya.",
        retention: "Tidak disimpan",
      },
      {
        item: "Kunjungan halaman teragregasi (Vercel Analytics)",
        purpose:
          "Menghitung jumlah kunjungan dan halaman populer. Berjalan tanpa cookie dan tidak terkait ke Anda secara individu.",
        retention: "Mengikuti kebijakan retensi Vercel sendiri",
      },
    ],
    notCollectedHeading: "Yang tidak dilakukan situs ini",
    notCollectedItems: [
      "Tidak ada akun, login, atau profil pengguna dalam bentuk apa pun.",
      "Tidak ada form kontak. Tombol di situs ini langsung membuka email, WhatsApp, atau LinkedIn Anda. Apa pun yang Anda kirim lewat sana jadi tanggung jawab platform itu, bukan halaman ini.",
      "Tidak ada cookie iklan atau retargeting. Tidak ada data yang dijual atau dibagikan ke pihak ketiga mana pun.",
    ],
    thirdPartyHeading: "Pihak yang terlibat",
    thirdPartyParagraphs: [
      "Situs ini di-hosting di Vercel, yang juga menjalankan analytics tanpa cookie di atas. Kebijakan mereka ada di dokumentasi privasi Vercel sendiri.",
      "Tautan email, WhatsApp, dan LinkedIn di header dan footer membawa Anda langsung ke layanan tersebut. Saya tidak melihat apa pun yang terjadi di sisi mereka.",
    ],
    choicesHeading: "Pilihan Anda",
    choicesParagraphs: [
      "Anda bisa memblokir atau menghapus cookie `NEXT_LOCALE` kapan saja lewat pengaturan browser. Situsnya tetap jalan. Cuma akan memeriksa ulang perkiraan bahasa Anda di kunjungan berikutnya, bukan mengingat pilihan terakhir.",
      "Mengganti bahasa lewat tombol EN / ID di header selalu menang dibanding apa pun yang tersimpan di cookie.",
    ],
    contactHeading: "Pertanyaan",
    contactParagraph: "Kirim email ke {email} kalau ada bagian yang kurang jelas atau ingin dijelaskan lebih lanjut.",
    changesHeading: "Perubahan",
    changesParagraph:
      "Halaman ini bisa diperbarui seiring perubahan situs. Tanggal di atas selalu mencerminkan versi terbaru. Tidak ada changelog terpisah untuk halaman sesingkat ini.",
  },
};
