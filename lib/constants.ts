export type StoryAct = {
  id: string;
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
    year: "2019",
    role: "Junior Software Engineer",
    title: "The one who wasn't ready",
  },
  {
    id: "act-cost",
    year: "2021",
    role: "Software Engineer → Senior",
    title: "The cost nobody bills you for",
  },
  {
    id: "act-decision",
    year: "2022",
    role: "Senior Software Engineer",
    title: "The decision",
  },
  {
    id: "act-people",
    year: "2023",
    role: "Tech Lead",
    title: "When the variables are people",
  },
  {
    id: "act-now",
    year: "Now",
    role: "Tech Lead",
    title: "Where that leaves me",
  },
];

export const ACT_ONE_PARAGRAPHS = [
  "Moving Bytes Digital hired me as a junior and then, fairly quickly, stopped treating me like one. The company's first Flutter app shipped with my name on it. Production React.js and Express.js work followed — mostly problems nobody had fully solved yet, handed to whoever was free. That was usually me.",
  "I was underprepared for most of it, and that turned out to be the useful part. Being out of my depth forced a question I couldn't answer with better syntax: how do you make good decisions when you don't control most of the variables?",
  "At the time I assumed it was a temporary problem — something more experience would eventually dissolve. It didn't.",
];

export const ACT_TWO_PARAGRAPHS = [
  "A second client project arrived. Then a third. The same four problems every time — auth, job queues, error handling, the shape of a survivable migration — solved again from scratch, slightly differently, by whoever reached them first.",
  "I was promoted twice across those two years. It would be a better story if those promotions had come from solving that. They didn't. They came from shipping, and shipping fast was quietly making everything after it slower.",
  "By the third codebase the arithmetic was hard to ignore: three versions of the same decision, three places for the same bug to live. Fixing something once no longer meant it was fixed. I had been optimising for output while the structure underneath got more expensive to change every month — and I was being rewarded for it the entire time.",
  "That's the part I'd want you to read carefully. Not that I found the answer, but that it took me two years and three codebases to admit there was a question.",
];

export const ACT_FOUR_PARAGRAPHS = [
  "In 2023 I became Tech Lead: two client projects, two engineers, scoping through to production. The first thing leading changes is the variable count. Code does what you tell it. People, deadlines, and shifting priorities do not.",
  "The clearest test was an enterprise payroll system running for more than 800 employees. A wrong number there isn't a bug report — it's somebody's paycheck. So I built for traceability and recovery before raw speed. Every write path costs more design work upfront; in exchange, every number in the system can be explained instead of trusted.",
  "Scaling the team needed the same instinct. I split ownership by domain module rather than by ticket. It demanded tighter documentation than anyone enjoys writing, and it let two engineers move in parallel without blocking on each other — or on me.",
  "Contributing to an international project spanning teams across countries and timezones only sharpened the point. The further a system spreads, the less of it you control directly, and the more the structure has to hold on its own.",
];

export const ACT_FIVE_PARAGRAPHS = [
  "I still don't have a clean answer, and I've stopped expecting one. What I have is a method that works: separate the variables you can actually design — boundaries, ownership, observability, what happens on failure — from the ones you can only respond to. Spend your effort almost entirely on the first set. Build so the second set can't take you down.",
  "That isn't a philosophy I read somewhere and applied. It's what seven years, three promotions, and one expensive detour through three duplicated codebases taught me — and it's what I'd bring to your team well before any particular framework.",
];

export type ArchitectureStoryStep = {
  id: string;
  caption: string;
  body: string;
};

/**
 * ADR-01 ("Reusable patterns over one-off builds") retold as a five-beat
 * scroll narrative — the diagram in `architecture-story.tsx` keys its state
 * off this array's index, so reordering or resizing it changes the animation.
 */
export const ARCHITECTURE_STORY: ArchitectureStoryStep[] = [
  {
    id: "one-project",
    caption: "One project",
    body: "2019. One client, one codebase. Auth, job queues, error handling — all written from scratch, and all of it perfectly fine. At this size, nothing about it looks like a problem yet.",
  },
  {
    id: "second-project",
    caption: "A second project",
    body: "Then a second project landed. Same four problems, solved again — slightly differently, by whoever reached them first. Still defensible. Still just a little duplication.",
  },
  {
    id: "third-project",
    caption: "The cost shows up",
    body: "By the third, the cost stopped being theoretical. Three codebases, three versions of the same decisions, three separate places for the same bug to live. Fixing something once no longer meant it was fixed.",
  },
  {
    id: "extract-core",
    caption: "Extracting the core",
    body: "So I stopped optimizing individual projects and started extracting what they already shared — auth, queues, error handling, the boring parts nobody wants to rewrite and everybody rewrites anyway.",
  },
  {
    id: "shared-foundation",
    caption: "A foundation to start from",
    body: "Now a new project doesn't start at zero. It starts on a foundation three projects have already stress-tested. The first one cost me time I couldn't bill. Every one since has been faster — which is the whole trade, stated honestly.",
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
    id: "traffic-spikes",
    label: "Traffic spikes on launch day",
    category: "uncontrollable",
    note: "You can't control demand. You can control whether the system degrades gracefully or falls over.",
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
