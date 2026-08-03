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
      "Started as a fullstack generalist — shipped the company's first Flutter mobile app for a client and contributed to production React.js / Express.js projects.",
  },
  {
    id: "software-engineer",
    role: "Software Engineer",
    period: "Jan 2021 – Dec 2021",
    summary:
      "Took on more ownership across web and mobile delivery, participating directly in technical decision-making and client issue resolution.",
  },
  {
    id: "senior-software-engineer",
    role: "Senior Software Engineer",
    period: "Jan 2022 – Dec 2022",
    summary:
      "Promoted twice within three years. Handed over three production projects to clients end-to-end.",
  },
  {
    id: "tech-lead",
    role: "Tech Lead",
    period: "Jan 2023 – Present",
    summary:
      "Leading 2 client projects and 2 engineers from requirement scoping through production deployment. Architected an enterprise payroll system (800+ employees) and a reusable NestJS/React.js backend architecture now adopted across multiple client projects. Contributing to an international engineering project spanning teams in multiple countries.",
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
