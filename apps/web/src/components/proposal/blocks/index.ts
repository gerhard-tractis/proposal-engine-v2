import type { ComponentType } from 'react';
import type { Client } from '@repo/shared';

export interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

// Heroes
import { HeroGradient } from './hero-gradient';
// Executive Summary
import { ExecutiveSummaryMetrics } from './executive-summary-metrics';
// Problem / Needs
import { ProblemMetricsTable } from './problem-metrics-table';
// Solution
import { SolutionCapabilities } from './solution-capabilities';
// Features
import { FeaturesAccordion } from './features-accordion';
import { FeaturesTabs } from './features-tabs';
// Data & Metrics
import { KpiBeforeAfter } from './kpi-before-after';
import { KpiTargets } from './kpi-targets';
// Timeline
import { Roadmap } from './roadmap';
// Pricing
import { PricingDetailed } from './pricing-detailed';
// Security & Risk
import { SecurityOverview } from './security-overview';
import { RiskMitigationPlan } from './risk-mitigation-plan';
// SLA
import { SlaTiers } from './sla-tiers';
// Legal
import { LegalSections } from './legal-sections';
import { LegalSignature } from './legal-signature';
// Trust & Social Proof
import { TrustCredentials } from './trust-credentials';
import { TrustSocialProof } from './trust-social-proof';
import { WhyUs } from './why-us';
// CTA & Contact
import { CtaActionItems } from './cta-action-items';
import { ContactSection } from './contact-section';
// Utility
import { TitleHeader } from './title-header';
import { FooterBranded } from './footer-branded';

export const COMPONENT_REGISTRY: Record<string, ComponentType<BlockComponentProps>> = {
  // Heroes (1)
  'hero-gradient': HeroGradient,
  // Executive Summary (1)
  'executive-summary-metrics': ExecutiveSummaryMetrics,
  // Problem / Needs (1)
  'problem-metrics-table': ProblemMetricsTable,
  // Solution (1)
  'solution-capabilities': SolutionCapabilities,
  // Features (2)
  'features-accordion': FeaturesAccordion,
  'features-tabs': FeaturesTabs,
  // Data & Metrics (2)
  'kpi-before-after': KpiBeforeAfter,
  'kpi-targets': KpiTargets,
  // Timeline (1)
  'roadmap': Roadmap,
  // Pricing (1)
  'pricing-detailed': PricingDetailed,
  // Security & Risk (2)
  'security-overview': SecurityOverview,
  'risk-mitigation-plan': RiskMitigationPlan,
  // SLA (1)
  'sla-tiers': SlaTiers,
  // Legal (2)
  'legal-sections': LegalSections,
  'legal-signature': LegalSignature,
  // Trust & Social Proof (3)
  'trust-credentials': TrustCredentials,
  'trust-social-proof': TrustSocialProof,
  'why-us': WhyUs,
  // CTA & Contact (2)
  'cta-action-items': CtaActionItems,
  'contact-section': ContactSection,
  // Utility (2)
  'title-header': TitleHeader,
  'footer-branded': FooterBranded,
};
