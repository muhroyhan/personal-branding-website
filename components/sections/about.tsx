import Link from "next/link";

const ABOUT_PARAGRAPHS = [
  "I started as a generalist — shipping the company's first Flutter app, then production React.js and Express.js work, mostly by being handed problems no one had fully solved yet. Somewhere in that process I got interested in a question that had nothing to do with code: how do you make good decisions when you can't control most of the variables? Architecture turned out to be asking the same thing.",
  "Seven years and three promotions later, I'm a Tech Lead at Moving Bytes Digital, leading two client projects and a team of two engineers. I architected an enterprise payroll system running for 800+ employees — not because payroll is my niche, but because it's a good test of a belief I hold: a system doesn't need to be perfect, it needs to fail in ways you can predict, audit, and recover from. I've carried that belief into reusable backend patterns now adopted across multiple client codebases, and into an engineering project spanning teams across countries.",
  "What holds it together isn't a stack or a certification. It's treating architecture the way I'd treat any hard problem — separate what I can control from what I can't, and build for both.",
];

export function About() {
  return (
    <section
      id="about"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-8 border-b border-border px-6 py-24 text-center"
    >
      <span className="font-mono text-caption tracking-wide text-muted-foreground/60 uppercase">
        §01 — About
      </span>
      <div className="flex max-w-2xl flex-col gap-5">
        {ABOUT_PARAGRAPHS.map((paragraph, i) => (
          <p key={i} className="text-body leading-relaxed text-fg">
            {paragraph}
          </p>
        ))}
      </div>
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
