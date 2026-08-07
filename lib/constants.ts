/**
 * Everything in this file is language-independent by design: anchors, ordering,
 * categories, product names, URLs. All prose moved to `lib/i18n/dictionaries`
 * when Indonesian was added — if you find yourself adding a sentence here,
 * it belongs there instead.
 */

export const ACT_KEYS = ["beginnings", "banking", "inherited", "payroll", "now"] as const;

export type ActKey = (typeof ACT_KEYS)[number];

/**
 * `id` doubles as the section anchor and as the StoryRail's observer target,
 * so renaming one means updating the nav links in navbar/footer too. These are
 * shared across locales — the Indonesian page uses the same anchors so the
 * language switcher can preserve a reader's position.
 */
export const ACT_ANCHORS: Record<ActKey, string> = {
  beginnings: "act-beginnings",
  banking: "act-banking",
  inherited: "act-inherited",
  payroll: "act-payroll",
  now: "act-now",
};

export const ACT_NUMERALS: Record<ActKey, string> = {
  beginnings: "I",
  banking: "II",
  inherited: "III",
  payroll: "IV",
  now: "V",
};

export type DichotomyKey =
  | "inherited-code"
  | "client-deadline"
  | "codebase-structure"
  | "teammate-debugging"
  | "third-party-uptime"
  | "test-coverage";

/** Order and verdict are the same in both languages; only the copy differs. */
export const DICHOTOMY_ITEMS: { id: DichotomyKey; category: "controllable" | "uncontrollable" }[] = [
  { id: "inherited-code", category: "uncontrollable" },
  { id: "client-deadline", category: "uncontrollable" },
  { id: "codebase-structure", category: "controllable" },
  { id: "teammate-debugging", category: "uncontrollable" },
  { id: "third-party-uptime", category: "uncontrollable" },
  { id: "test-coverage", category: "controllable" },
];

export const CONTACT_LINKS = {
  email: "muhroyhan@gmail.com",
  whatsapp: "https://wa.me/6285157550160",
  linkedin: "https://www.linkedin.com/in/muhammad-royhan-077830168",
  github: "https://github.com/muhroyhan",
};

/** The site's own repo, not the profile link above — used for the release/version link in the footer. */
export const REPO_URL = "https://github.com/muhroyhan/personal-branding-website";

/** Lives in `public/`, so it is locale-independent and needs no prefix. */
export const RESUME_PATH = "/royhan-resume.pdf";

/**
 * Neither file exists yet — both components that use these paths
 * (`ProfilePhoto`, `VideoIntro`) render nothing until something actually
 * answers at the path, so adding the file is the whole activation step: drop
 * a square photo at `public/images/profile.jpg` (roughly 480×480, it renders
 * as a circle so a tight square crop works best), or an MP4 at
 * `public/videos/intro.mp4`. No other code change needed.
 */
export const PROFILE_PHOTO_PATH = "/images/profile.jpg";
export const VIDEO_INTRO_PATH = "/videos/intro.mp4";

// Must be set to the real production URL (Vercel project URL or custom
// domain) once deployed — see README's manual setup checklist. Falls back
// to localhost so sitemap/robots/JSON-LD still generate valid absolute
// URLs during local dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type TechStackGroupKey = "frontend" | "backend" | "infra";

/** Product names are proper nouns — only the group headings are translated. */
export const TECH_STACK_GROUPS: { key: TechStackGroupKey; items: string[] }[] = [
  {
    key: "frontend",
    items: ["React.js", "Next.js", "Flutter", "TypeScript"],
  },
  {
    key: "backend",
    items: ["Node.js", "Express.js", "NestJS", "REST API", "Sequelize.js", "JavaScript"],
  },
  {
    key: "infra",
    items: ["MySQL", "Docker", "GitHub", "Postman"],
  },
];
