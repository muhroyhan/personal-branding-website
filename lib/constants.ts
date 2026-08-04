export type StoryAct = {
  id: string;
  numeral: string;
  year: string;
  role: string;
  title: string;
};

/**
 * The homepage is one continuous story; these five acts are its spine.
 * `id` doubles as the section anchor and as the StoryRail's observer target,
 * so renaming one means updating the nav links in navbar/footer too.
 */
export const STORY_ACTS: StoryAct[] = [
  {
    id: "act-beginnings",
    numeral: "I",
    year: "2019",
    role: "Junior Software Engineer",
    title: "The one who never meant to be here",
  },
  {
    id: "act-banking",
    numeral: "II",
    year: "2022",
    role: "Senior Software Engineer",
    title: "Numbers that belong to someone else",
  },
  {
    id: "act-inherited",
    numeral: "III",
    year: "2023",
    role: "Team Lead — Legacy Maintenance",
    title: "Promoted into other people's decisions",
  },
  {
    id: "act-payroll",
    numeral: "IV",
    year: "2024",
    role: "Team Lead",
    title: "The one that had to be right",
  },
  {
    id: "act-now",
    numeral: "V",
    year: "Now",
    role: "Team Lead",
    title: "Where that leaves me",
  },
];

/*
 * Copy budget: no paragraph over ~40 words, no act over ~110, roughly 430
 * across the homepage. Readers skim; every sentence here has to earn its line.
 */

export const ACT_ONE_PARAGRAPHS = [
  "I avoided software on purpose. The field looked overcrowded, and I had no appetite for competing against people who had wanted it far longer than I had.",
  "Moving Bytes Digital hired me anyway. My first work was an ERP build and a rental marketplace someone else had started — inherited code, inherited decisions, a project handed over mid-run.",
  "By 2021 I was maintaining that marketplace and building its mobile app in a team. The competition never arrived; the obligation did — and with it a question. How do you decide well without controlling the variables?",
];

export const ACT_TWO_PARAGRAPHS = [
  "In 2022 I took an operational system for a rural credit bank — first commit through to handover. My first project owned end to end, in the least forgiving domain I had touched.",
  "Banking software has no cosmetic bugs. A misplaced figure is somebody's balance, and the people it belongs to find out before you do.",
  "The handover taught me more than the build did. Code you hand to someone else has to explain itself without you in the room — a constraint I have designed for ever since.",
];

export const ACT_THREE_PARAGRAPHS = [
  "The promotion to Team Lead came in 2023. Not the lead who builds new systems, or the one running the flagship manufacturing project — the one who keeps everything already shipped still running.",
  "This is the part nobody puts in a portfolio. Most of that year was spent inside decisions I had not made, in code I could not rewrite, against timelines I did not set.",
  "It taught the lesson this whole page rests on: you rarely control what you inherit. You only control whether it is more explainable when you hand it on.",
];

export const ACT_NOW_PARAGRAPHS = [
  "I still have no clean answer to the question from 2019, and I have stopped expecting one. What I have is a method: separate what you can design — boundaries, ownership, traceability — from what you can only answer.",
  "I never chose this field for love of it. I stayed because people depended on the work being right, and that turned out to be the more durable reason.",
  "Between March and June 2025, the same discipline carried into a project spanning more than one country.",
];

export type ArchitectureStoryStep = {
  id: string;
  caption: string;
  body: string;
};

/**
 * The payroll arc (2024 internal → 2025 client at 800+ → shipped June 2026)
 * as a five-beat scroll narrative. The diagram in `architecture-story.tsx`
 * keys its state off this array's index, so reordering or resizing it changes
 * the animation.
 */
export const ARCHITECTURE_STORY: ArchitectureStoryStep[] = [
  {
    id: "internal",
    caption: "One company",
    body: "2024. A payroll system for our own company — small, internal, forgiving. If it broke, I heard about it down the hall.",
  },
  {
    id: "quiet-year",
    caption: "A year of quiet",
    body: "It ran correctly for a year, and became the foundation the client build started from — not a rewrite, an inheritance.",
  },
  {
    id: "client-scale",
    caption: "800+ people",
    body: "2025. The same problem for a client, at more than 800 employees. A wrong figure was no longer a bug report. It was a wage that did not arrive.",
  },
  {
    id: "re-derivable",
    caption: "Every figure re-derivable",
    body: "So I built for re-derivation before speed: every number traceable to its inputs, every run reproducible from scratch.",
  },
  {
    id: "shipped",
    caption: "Shipped, and still running",
    body: "Delivered June 2026. It has been running since, and I still maintain it — which is its own kind of verdict.",
  },
];

export type SyllogismLine = {
  label: string;
  text: string;
};

/**
 * The Anatomy scrollytelling (ARCHITECTURE_STORY) makes this argument through
 * five narrative beats; this is the same reasoning stated in Aristotelian
 * form — premise, premise, conclusion — as a formal check on the story rather
 * than a retelling of it.
 */
export const SYLLOGISM: SyllogismLine[] = [
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
];

export type DichotomyItem = {
  id: string;
  label: string;
  category: "controllable" | "uncontrollable";
  note: string;
};

export const DICHOTOMY_ITEMS: DichotomyItem[] = [
  {
    id: "inherited-code",
    label: "The codebase you inherit",
    category: "uncontrollable",
    note: "You don't get to pick the decisions already made. You only pick whether the next person inherits something clearer.",
  },
  {
    id: "client-deadline",
    label: "A client's deadline",
    category: "uncontrollable",
    note: "Rarely yours to set. What's yours is how honestly you scope against it.",
  },
  {
    id: "codebase-structure",
    label: "How the codebase is structured",
    category: "controllable",
    note: "This one's actually yours. Most of the job lives here.",
  },
  {
    id: "teammate-debugging",
    label: "A teammate's debugging style",
    category: "uncontrollable",
    note: "You can share context and docs. You can't make someone think the way you do.",
  },
  {
    id: "third-party-uptime",
    label: "Whether a third-party API stays up",
    category: "uncontrollable",
    note: "You only control how your system behaves when it doesn't.",
  },
  {
    id: "test-coverage",
    label: "Test coverage on what you ship",
    category: "controllable",
    note: "Nobody else decides this. If it's thin, that was a choice.",
  },
];

export const CONTACT_LINKS = {
  email: "muhroyhan@gmail.com",
  whatsapp: "https://wa.me/6285157550160",
  linkedin: "https://www.linkedin.com/in/muhammad-royhan-077830168",
  github: "https://github.com/muhroyhan",
};

// Must be set to the real production URL (Vercel project URL or custom
// domain) once deployed — see README's manual setup checklist. Falls back
// to localhost so sitemap/robots/JSON-LD still generate valid absolute
// URLs during local dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type TechStackGroup = {
  label: string;
  items: string[];
};

export const TECH_STACK_GROUPS: TechStackGroup[] = [
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "Flutter", "TypeScript"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "REST API", "Sequelize.js", "JavaScript"],
  },
  {
    label: "Infra & Tools",
    items: ["PostgreSQL", "MySQL", "Docker", "GitHub", "Postman"],
  },
];
