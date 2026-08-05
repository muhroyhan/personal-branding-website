import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { ActOneBeginnings } from "@/components/sections/act-one-beginnings";
import { ActTwoBanking } from "@/components/sections/act-two-banking";
import { ActThreeInherited } from "@/components/sections/act-three-inherited";
import { ArchitectureStory } from "@/components/sections/architecture-story";
import { ActFiveNow } from "@/components/sections/act-five-now";
import { WorkPreview } from "@/components/sections/work-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { TechStack } from "@/components/sections/tech-stack";
import { WhoFor } from "@/components/sections/who-for";
import { ContactCta } from "@/components/sections/contact-cta";
import { StoryRail } from "@/components/story/story-rail";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { getDictionary, isLocale } from "@/lib/i18n";

/**
 * One continuous story in five acts, then the evidence layer.
 *
 * The acts run chronologically (2019 → now) and each carries a hard credential
 * in its heading, so a recruiter scanning in twenty seconds still reads the
 * career progression without having to read the prose.
 *
 * Act IV is deliberately not wrapped in ScrollReveal: it drives its own
 * scroll choreography, and a wrapper transform risks its sticky diagram.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      <StoryRail dict={dict} />
      <Hero locale={locale} dict={dict} />

      <ScrollReveal>
        <ActOneBeginnings dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <ActTwoBanking dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <ActThreeInherited dict={dict} />
      </ScrollReveal>
      <ArchitectureStory dict={dict} />
      <ScrollReveal>
        <ActFiveNow dict={dict} />
      </ScrollReveal>

      <ScrollReveal>
        <WorkPreview locale={locale} dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials locale={locale} dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <TechStack dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <WhoFor dict={dict} />
      </ScrollReveal>
      <ScrollReveal>
        <ContactCta dict={dict} />
      </ScrollReveal>
    </>
  );
}
