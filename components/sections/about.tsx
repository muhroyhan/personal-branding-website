import Link from "next/link";

const ABOUT_COPY =
  "I'm a Tech Lead with 7+ years at Moving Bytes Digital, where I grew from Junior Software Engineer to leading two client projects and a team of two engineers — while personally architecting an enterprise payroll system used by a company with 800+ employees. My focus is backend architecture that holds up under real-world constraints: idempotency, auditability, and regulatory correctness, not just feature delivery. I also contribute to an international, cross-country engineering project and design reusable backend patterns adopted across multiple client codebases.";

export function About() {
  return (
    <section
      id="about"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-8 border-b border-border px-6 py-24 text-center"
    >
      <p className="max-w-2xl text-body leading-relaxed text-fg">{ABOUT_COPY}</p>
      <Link
        href="/royhan-resume.pdf"
        download
        className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 font-mono text-caption tracking-wide text-fg uppercase transition-colors hover:border-accent hover:text-accent"
      >
        Download resume
      </Link>
    </section>
  );
}
