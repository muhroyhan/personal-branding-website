import { Hero } from "@/components/sections/hero";
import { ActOneBeginnings } from "@/components/sections/act-one-beginnings";
import { ActTwoCost } from "@/components/sections/act-two-cost";
import { ArchitectureStory } from "@/components/sections/architecture-story";
import { ActFourPeople } from "@/components/sections/act-four-people";
import { ActFiveNow } from "@/components/sections/act-five-now";
import { WorkPreview } from "@/components/sections/work-preview";
import { TechStack } from "@/components/sections/tech-stack";
import { ContactCta } from "@/components/sections/contact-cta";
import { StoryRail } from "@/components/story/story-rail";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

/**
 * One continuous story in five acts, then the evidence layer.
 *
 * The acts run chronologically (2019 → now) and each carries a hard credential
 * in its heading, so a recruiter scanning in twenty seconds still reads the
 * career progression without having to read the prose.
 *
 * Act III is deliberately not wrapped in ScrollReveal: it drives its own
 * scroll choreography, and a wrapper transform risks its sticky diagram.
 */
export default function Home() {
  return (
    <>
      <StoryRail />
      <Hero />

      <ScrollReveal>
        <ActOneBeginnings />
      </ScrollReveal>
      <ScrollReveal>
        <ActTwoCost />
      </ScrollReveal>
      <ArchitectureStory />
      <ScrollReveal>
        <ActFourPeople />
      </ScrollReveal>
      <ScrollReveal>
        <ActFiveNow />
      </ScrollReveal>

      <ScrollReveal>
        <WorkPreview />
      </ScrollReveal>
      <ScrollReveal>
        <TechStack />
      </ScrollReveal>
      <ScrollReveal>
        <ContactCta />
      </ScrollReveal>
    </>
  );
}
