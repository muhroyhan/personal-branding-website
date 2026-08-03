import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { CareerTimeline } from "@/components/sections/career-timeline";
import { ArchitectureDecisions } from "@/components/sections/architecture-decisions";
import { WorkPreview } from "@/components/sections/work-preview";
import { TechStack } from "@/components/sections/tech-stack";
import { ContactCta } from "@/components/sections/contact-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <CareerTimeline />
      </ScrollReveal>
      <ScrollReveal>
        <ArchitectureDecisions />
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
