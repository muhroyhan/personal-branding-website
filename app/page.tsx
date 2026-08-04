import { Hero } from "@/components/sections/hero";
import { ActOneBeginnings } from "@/components/sections/act-one-beginnings";
import { ActTwoBanking } from "@/components/sections/act-two-banking";
import { ActThreeInherited } from "@/components/sections/act-three-inherited";
import { ArchitectureStory } from "@/components/sections/architecture-story";
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
 * Act IV is deliberately not wrapped in ScrollReveal: it drives its own
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
        <ActTwoBanking />
      </ScrollReveal>
      <ScrollReveal>
        <ActThreeInherited />
      </ScrollReveal>
      <ArchitectureStory />
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
