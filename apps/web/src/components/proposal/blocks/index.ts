import type { ComponentType } from 'react';
import type { Client } from '@repo/shared';

export interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

// Standard blocks (from existing section components)
import { ExecutiveSummary } from './executive-summary';
import { UnderstandingNeeds } from './understanding-needs';
import { Solution } from './solution';
import { FeaturesSection } from './features-section';
import { Roadmap } from './roadmap';
import { WhyUs } from './why-us';
import { PricingSection } from './pricing-section';
import { ContactSection } from './contact-section';
// Imperial-specific blocks
import { HeroGradient } from './hero-gradient';
import { ProblemCards } from './problem-cards';
import { SolutionDiagram } from './solution-diagram';
import { PricingTiers } from './pricing-tiers';
import { CtaBanner } from './cta-banner';
import { FooterBranded } from './footer-branded';
// Utility blocks
import { TitleHeader } from './title-header';

export const COMPONENT_REGISTRY: Record<string, ComponentType<BlockComponentProps>> = {
  'executive-summary': ExecutiveSummary,
  'understanding-needs': UnderstandingNeeds,
  'solution': Solution,
  'features-section': FeaturesSection,
  'roadmap': Roadmap,
  'why-us': WhyUs,
  'pricing-section': PricingSection,
  'contact-section': ContactSection,
  'hero-gradient': HeroGradient,
  'problem-cards': ProblemCards,
  'solution-diagram': SolutionDiagram,
  'pricing-tiers': PricingTiers,
  'cta-banner': CtaBanner,
  'footer-branded': FooterBranded,
  'title-header': TitleHeader,
};
