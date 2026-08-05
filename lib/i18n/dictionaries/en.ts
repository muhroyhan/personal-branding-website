/**
 * English is the "long register": the five-act narrative, the Stoic framing and
 * the syllogism all stay, because the international audience this site targets
 * rewards a point of view. The Indonesian dictionary (`id.ts`) deliberately
 * runs a different register — see the note at the top of that file.
 *
 * The shape of this object *is* the contract: `id.ts` is typed as
 * `Dictionary`, so a key added here without an Indonesian counterpart is a
 * build error rather than a page that silently falls back to English.
 */
export const en = {
  meta: {
    title: "Muhammad Royhan — Senior Fullstack Engineer",
    description:
      "Senior Fullstack Engineer and Team Lead. Seven years and three promotions at one company — payroll for 800+ employees, employee lending, ERP and marketplace systems built to stay explainable after handover.",
    workTitle: "Work",
    workDescription:
      "Case studies of production systems architected and shipped by Muhammad Royhan — payroll, employee lending, ERP.",
    writingTitle: "Writing",
    writingDescription:
      "Essays by Muhammad Royhan connecting systems thinking and Stoic philosophy to real software architecture decisions.",
    privacyTitle: "Privacy",
    privacyDescription: "What this site collects, why, and what it doesn't.",
  },

  nav: {
    story: "Story",
    work: "Work",
    writing: "Writing",
    stack: "Stack",
    contact: "Contact",
    resume: "Resume",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageLabel: "Language",
    switchTo: "Baca dalam Bahasa Indonesia",
    storyProgress: "Story progress",
  },

  hero: {
    name: "Muhammad Royhan",
    role: "Senior Fullstack Engineer · Team Lead",
    positioning: "Systems where a wrong number is someone's paycheck — payroll, lending, compliance.",
    headline: "Competition kept me out. Obligation kept me in.",
    leadBefore:
      "Backend and frontend, seven years and three promotions at one company. I lean on ",
    termOne: {
      label: "systems thinking",
      definition:
        "Understanding a system by how its parts affect each other over time, not by inspecting any one part in isolation.",
    },
    leadMiddle: " and a ",
    termTwo: {
      label: "Stoic bias for what's controllable",
      definition:
        "The Stoic dichotomy of control: spend effort only on what you can actually influence, and design for the rest.",
    },
    leadAfter: " to build software that holds up after I hand it over.",
    ctaResume: "Resume (PDF)",
    ctaWork: "Selected work",
    proofLabel: "Track record",
    proof: [
      "7 years, one company",
      "3 promotions to Team Lead",
      "Payroll for 800+ employees",
      "Banking · ERP · Marketplace",
    ],
    scrollCue: "Seven years, three promotions, one question I still can't fully answer",
  },

  /*
   * Copy budget: no paragraph over ~40 words, no act over ~110, roughly 430
   * across the homepage. Readers skim; every sentence here has to earn its line.
   */
  acts: {
    beginnings: {
      year: "2019",
      role: "Junior Software Engineer",
      title: "The one who never meant to be here",
      paragraphs: [
        "I avoided software on purpose. The field looked overcrowded, and I had no appetite for competing against people who had wanted it far longer than I had.",
        "Moving Bytes Digital hired me anyway. My first work was picking up an ERP project already in motion, then a rental marketplace someone else had started — inherited code, inherited decisions, work handed over mid-run.",
        "By 2021 I was maintaining that marketplace and building its mobile app in a team. The competition never arrived; the obligation did — and with it a question. How do you decide well without controlling the variables?",
      ],
    },
    banking: {
      year: "2022",
      role: "Senior Software Engineer",
      title: "Numbers that belong to someone else",
      paragraphs: [
        "In 2022 I took an employee credit system for a rural credit bank — first commit through to handover. My first project owned end to end, in the least forgiving domain I had touched.",
        "An employee credit system has no cosmetic bugs. A misplaced figure is somebody's debt, and the person it belongs to finds out before you do.",
        "The handover taught me more than the build did. Code you hand to someone else has to explain itself without you in the room — a constraint I have designed for ever since.",
      ],
    },
    inherited: {
      year: "2023",
      role: "Team Lead — Legacy Maintenance",
      title: "Promoted into other people's decisions",
      paragraphs: [
        "The promotion to Team Lead came in 2023. Not the lead who builds new systems, or the one running the flagship manufacturing project — the one who keeps everything already shipped still running.",
        "This is the part nobody puts in a portfolio. Most of that year was spent inside decisions I had not made, in code I could not rewrite, against timelines I did not set.",
        "It taught the lesson this whole page rests on: you rarely control what you inherit. You only control whether it is more explainable when you hand it on.",
      ],
      dichotomyIntro:
        "Seven years in, this is roughly how I sort it. Try a few before you read where I land — the disagreements are the interesting part.",
    },
    payroll: {
      year: "2024",
      role: "Team Lead",
      title: "The one that had to be right",
      intro:
        "Two years, two systems, one engineer on each — traded between them whenever one needed to move faster. Scroll through it — the problem earns the solution rather than being told it.",
    },
    now: {
      year: "Now",
      role: "Team Lead",
      title: "Where that leaves me",
      question:
        "So — the question from the beginning. How do you decide well without controlling the variables?",
      paragraphs: [
        "I still have no clean answer to the question from 2019, and I have stopped expecting one. What I have is a method: separate what you can design — boundaries, ownership, traceability — from what you can only answer.",
        "I never chose this field for love of it. I stayed because people depended on the work being right, and that turned out to be the more durable reason.",
        "Alongside the payroll work, the company trusted me with a side project between March and June 2025 — a cross-country initiative meant to test whether I could hold my own next to engineers from other countries.",
      ],
    },
  },

  /**
   * The payroll arc (2024 internal → 2025 client at 800+ → shipped June 2026)
   * as a five-beat scroll narrative. The diagram in `architecture-story.tsx`
   * keys its state off this array's index, so reordering or resizing it changes
   * the animation.
   */
  architecture: {
    diagramLabel: "Payroll system diagram, stage {step} of {total}",
    runLabel: "PAYROLL RUN",
    auditLabel: "RE-DERIVABLE FROM INPUTS",
    steps: [
      {
        caption: "One company",
        body: "2024. A payroll system for our own company — small, internal, forgiving. If it broke, I heard about it down the hall.",
      },
      {
        caption: "A year of quiet",
        body: "It ran correctly for a year, and became the foundation the client build started from — not a rewrite, an inheritance.",
      },
      {
        caption: "800+ people",
        body: "2025. The same problem for a client, at more than 800 employees. A wrong figure was no longer a bug report. It was a wage that did not arrive.",
      },
      {
        caption: "Every figure re-derivable",
        body: "So I built for re-derivation before speed: every number traceable to its inputs, every run reproducible from scratch.",
      },
      {
        caption: "Shipped, and still running",
        body: "Delivered June 2026. It has been running since, and I still maintain it — which is its own kind of verdict.",
      },
    ],
    syllogismLabel: "Stated formally",
    syllogism: [
      {
        label: "Premise I",
        text: "A payroll error is not a defect report. It is a wage that did not arrive.",
      },
      {
        label: "Premise II",
        text: "A figure that cannot be re-derived from its inputs can only be trusted, never verified.",
      },
      {
        label: "Conclusion",
        text: "Build so every figure can be re-derived. Trust is not a control.",
      },
    ],
    conclusionLabel: "Conclusion",
  },

  dichotomy: {
    controllable: "Controllable",
    uncontrollable: "Not controllable",
    verdictLabel: "Where I land",
    sortLabel: "Sort: {item}",
    items: {
      "inherited-code": {
        label: "The codebase you inherit",
        note: "You don't get to pick the decisions already made. You only pick whether the next person inherits something clearer.",
      },
      "client-deadline": {
        label: "A client's deadline",
        note: "Rarely yours to set. What's yours is how honestly you scope against it.",
      },
      "codebase-structure": {
        label: "How the codebase is structured",
        note: "This one's actually yours. Most of the job lives here.",
      },
      "teammate-debugging": {
        label: "A teammate's debugging style",
        note: "You can share context and docs. You can't make someone think the way you do.",
      },
      "third-party-uptime": {
        label: "Whether a third-party API stays up",
        note: "You only control how your system behaves when it doesn't.",
      },
      "test-coverage": {
        label: "Test coverage on what you ship",
        note: "Nobody else decides this. If it's thin, that was a choice.",
      },
    },
  },

  work: {
    eyebrow: "The evidence",
    heading: "Selected Work",
    intro: "The systems behind the story, written up in full.",
    viewAll: "View all work →",
    pageHeading: "Work",
    pageIntro:
      "Production systems I architected and shipped — what the constraint was, what I decided, and what it cost.",
  },

  writing: {
    pageHeading: "Writing",
    pageIntro:
      "Where systems thinking and Stoic philosophy meet actual engineering decisions.",
    empty: "First essays are being written. Check back shortly.",
  },

  /** Section renders nothing while `TESTIMONIALS` (lib/testimonials.ts) is empty. */
  testimonials: {
    eyebrow: "In their words",
    heading: "What people say",
    intro: "Short, unedited, from people who worked with me directly.",
  },

  stack: {
    eyebrow: "The evidence",
    heading: "Tech Stack",
    intro: "The tools I reach for — chosen for what stays boring under pressure.",
    groups: {
      frontend: "Frontend",
      backend: "Backend",
      infra: "Infra & Tools",
    },
  },

  /**
   * Qualifier section, placed right before the contact CTA — answers "should
   * I reach out" before the reader has to ask, and states availability
   * specifics (timezone, contract type) so those never have to be asked in
   * a first email.
   */
  whoFor: {
    eyebrow: "Fit check",
    heading: "Who this is for",
    intro: "Reach out if any of this sounds like your system, not mine.",
    bullets: [
      "A wrong figure has legal or financial consequence — payroll, lending, compliance, anything that produces a number someone signs.",
      "A payroll, lending, or compliance codebase nobody currently understands end to end.",
      "A team that lost the senior engineer who held the context.",
      "A system that has to survive an audit, or a handover to a team that wasn't in the room when it was built.",
    ],
    availabilityLabel: "Availability",
    availability: [
      "Remote-first",
      "WIB · UTC+7",
      "EOR, contract, or full-time",
      "2-week notice",
    ],
  },

  contact: {
    heading: "Want the next chapter written on your team?",
    intro: "Reach out directly — no forms.",
    videoLabel: "Watch a 60-second intro",
    copyEmail: "Copy email",
    copied: "Copied!",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    resume: "Resume (PDF)",
  },

  footer: {
    rights: "Muhammad Royhan",
    email: "Email",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    github: "GitHub",
    resume: "Resume",
    privacy: "Privacy",
  },

  /**
   * Written for what this site actually does, not templated from a generator —
   * a personal site with three data points (a locale cookie, a geo header read
   * once at the edge, and cookieless aggregate analytics) doesn't need the
   * boilerplate a SaaS privacy policy carries, and padding it out would just
   * make the real disclosures harder to find.
   */
  privacy: {
    pageHeading: "Privacy",
    lastUpdated: "Last updated: August 2026",
    intro:
      "This is a personal portfolio, not a company, so this stays short: what's collected, why, and what isn't.",
    collectHeading: "What's collected",
    collectIntro: "Three things, all in service of the site itself — nothing to track you with.",
    collectTable: [
      {
        item: "Language preference (`NEXT_LOCALE` cookie)",
        purpose:
          "Remembers whether you're reading the English or Indonesian version, so you're not redirected on every visit.",
        retention: "1 year, or until you clear it",
      },
      {
        item: "Approximate country, from the hosting provider",
        purpose:
          "Read once at the edge to decide whether to redirect you to the Indonesian version on your first visit. Nothing beyond the resulting locale is stored.",
        retention: "Not stored",
      },
      {
        item: "Aggregated page views (Vercel Analytics)",
        purpose:
          "Counts visits and popular pages. Runs without cookies and isn't tied to you individually.",
        retention: "Per Vercel's own retention policy",
      },
    ],
    notCollectedHeading: "What this site doesn't do",
    notCollectedItems: [
      "No account, login, or user profile of any kind.",
      "No contact form — the buttons here open your email client, WhatsApp, or LinkedIn directly. Whatever you send through those is governed by that platform's own privacy policy, not this one.",
      "No advertising or retargeting cookies. Nothing is sold or shared with data brokers.",
    ],
    thirdPartyHeading: "Who this passes through",
    thirdPartyParagraphs: [
      "The site is hosted on Vercel, which also runs the cookieless analytics mentioned above. Their practices are documented in Vercel's own privacy policy.",
      "The email, WhatsApp, and LinkedIn links in the header and footer send you to those services directly — I don't see anything that happens on their side.",
    ],
    choicesHeading: "Your choices",
    choicesParagraphs: [
      "Block or clear the `NEXT_LOCALE` cookie any time in your browser settings. The site still works — it just re-checks your likely language on the next visit instead of remembering your last one.",
      "Switching language with the EN / ID toggle in the header always overrides whatever the cookie currently says.",
    ],
    contactHeading: "Questions",
    contactParagraph: "Email {email} if anything here is unclear or you'd like it explained further.",
    changesHeading: "Changes",
    changesParagraph:
      "This page may be updated as the site changes. The date at the top always reflects the latest version — there's no separate changelog for a page this short.",
  },
};

/**
 * Intentionally not `as const`: the literal-narrowing that would give us buys
 * nothing here and would force every Indonesian string to equal its English
 * counterpart. What we want from the type is the key structure.
 */
export type Dictionary = typeof en;
