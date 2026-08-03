export type CareerNode = {
  id: string;
  role: string;
  period: string;
  summary: string;
};

export const CAREER_TIMELINE: CareerNode[] = [
  {
    id: "junior-software-engineer",
    role: "Junior Software Engineer",
    period: "Jun 2019 – Dec 2020",
    summary:
      "Started as a fullstack generalist, thrown at problems before I felt ready for them — the company's first Flutter app, then production React.js / Express.js work. I learned more from being underprepared than I would have from being comfortable.",
  },
  {
    id: "software-engineer",
    role: "Software Engineer",
    period: "Jan 2021 – Dec 2021",
    summary:
      "Took on more ownership across web and mobile delivery. This is where I noticed most 'technical' decisions were really judgment calls made under incomplete information — and started treating them that way.",
  },
  {
    id: "senior-software-engineer",
    role: "Senior Software Engineer",
    period: "Jan 2022 – Dec 2022",
    summary:
      "Promoted twice within three years. Handed over three production projects to clients end-to-end — each one a lesson in designing for handoff, not just for launch.",
  },
  {
    id: "tech-lead",
    role: "Tech Lead",
    period: "Jan 2023 – Present",
    summary:
      "Leading 2 client projects and 2 engineers from requirement scoping through production deployment. Architected an enterprise payroll system (800+ employees) and a reusable NestJS/React.js backend architecture now adopted across multiple client projects. Contributing to an international engineering project spanning teams in multiple countries. The through-line: control the structure, accept the uncertainty, design for both.",
  },
];

export type ArchitectureDecision = {
  id: string;
  title: string;
  context: string;
  decision: string;
  tradeoff: string;
};

export const ARCHITECTURE_DECISIONS: ArchitectureDecision[] = [
  {
    id: "reusable-backend-patterns",
    title: "Reusable patterns over one-off builds",
    context:
      "Every new client project re-solved the same structural problems from scratch — auth, job queues, error handling.",
    decision:
      "Extracted a reusable NestJS/React.js backend architecture instead of optimizing each project in isolation.",
    tradeoff:
      "Slower on the first project it touched. Every project after that started from a stronger baseline instead of zero.",
  },
  {
    id: "auditability-over-speed",
    title: "Auditability over raw speed",
    context:
      "An enterprise payroll system for 800+ employees, where a wrong number isn't a bug report — it's a paycheck someone depends on.",
    decision: "Built for traceability and recovery first, raw performance second.",
    tradeoff:
      "More upfront design work on every write path. In exchange, every number in the system can be explained, not just trusted.",
  },
  {
    id: "ownership-by-domain",
    title: "Ownership split by domain, not by ticket",
    context:
      "Systems I used to own alone started needing more than one person to move at the pace clients expected.",
    decision: "Split ownership by domain module rather than by feature ticket.",
    tradeoff:
      "Required tighter documentation upfront. Let the team parallelize work without blocking on each other.",
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
