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
// Utility blocks
import { TitleHeader } from './title-header';
// Phase 1: General-Purpose + Critical Gaps
import { DataTableStandard } from './data-table-standard';
import { DataTableComparison } from './data-table-comparison';
import { MetricsGrid } from './metrics-grid';
import { KpiDashboard } from './kpi-dashboard';
import { KpiBeforeAfter } from './kpi-before-after';
import { SecurityOverview } from './security-overview';
import { SecurityControls } from './security-controls';
import { ComplianceMatrix } from './compliance-matrix';
import { RiskMatrix } from './risk-matrix';
import { RiskHeatmap } from './risk-heatmap';
import { RiskMitigationPlan } from './risk-mitigation-plan';
// Phase 2: Easy Chile Coverage
import { ExecutiveSummaryMetrics } from './executive-summary-metrics';
import { ExecutiveSummaryTimeline } from './executive-summary-timeline';
import { ProblemMetricsTable } from './problem-metrics-table';
import { SolutionCapabilities } from './solution-capabilities';
import { FeaturesAccordion } from './features-accordion';
import { FeaturesTabs } from './features-tabs';
import { PricingDetailed } from './pricing-detailed';
import { TimelineTable } from './timeline-table';
import { TimelineGantt } from './timeline-gantt';
import { CtaActionItems } from './cta-action-items';
// Phase 3: SLA + Legal + Trust
import { SlaTiers } from './sla-tiers';
import { SlaComparison } from './sla-comparison';
import { GuaranteesGrid } from './guarantees-grid';
import { LegalTermsTable } from './legal-terms-table';
import { LegalSections } from './legal-sections';
import { LegalSignature } from './legal-signature';
import { TrustCredentials } from './trust-credentials';
import { TrustSocialProof } from './trust-social-proof';
import { KpiTargets } from './kpi-targets';
// Phase 4: Hero + Executive Variants
import { HeroSplit } from './hero-split';
import { HeroCentered } from './hero-centered';
import { ChecklistTable } from './checklist-table';

export const COMPONENT_REGISTRY: Record<string, ComponentType<BlockComponentProps>> = {
  // Standard blocks (9)
  'executive-summary': ExecutiveSummary,
  'understanding-needs': UnderstandingNeeds,
  'solution': Solution,
  'features-section': FeaturesSection,
  'roadmap': Roadmap,
  'why-us': WhyUs,
  'pricing-section': PricingSection,
  'contact-section': ContactSection,
  'title-header': TitleHeader,
  // Phase 1: General-Purpose + Critical Gaps (11)
  'data-table-standard': DataTableStandard,
  'data-table-comparison': DataTableComparison,
  'metrics-grid': MetricsGrid,
  'kpi-dashboard': KpiDashboard,
  'kpi-before-after': KpiBeforeAfter,
  'security-overview': SecurityOverview,
  'security-controls': SecurityControls,
  'compliance-matrix': ComplianceMatrix,
  'risk-matrix': RiskMatrix,
  'risk-heatmap': RiskHeatmap,
  'risk-mitigation-plan': RiskMitigationPlan,
  // Phase 2: Easy Chile Coverage (10)
  'executive-summary-metrics': ExecutiveSummaryMetrics,
  'executive-summary-timeline': ExecutiveSummaryTimeline,
  'problem-metrics-table': ProblemMetricsTable,
  'solution-capabilities': SolutionCapabilities,
  'features-accordion': FeaturesAccordion,
  'features-tabs': FeaturesTabs,
  'pricing-detailed': PricingDetailed,
  'timeline-table': TimelineTable,
  'timeline-gantt': TimelineGantt,
  'cta-action-items': CtaActionItems,
  // Phase 3: SLA + Legal + Trust (9)
  'sla-tiers': SlaTiers,
  'sla-comparison': SlaComparison,
  'guarantees-grid': GuaranteesGrid,
  'legal-terms-table': LegalTermsTable,
  'legal-sections': LegalSections,
  'legal-signature': LegalSignature,
  'trust-credentials': TrustCredentials,
  'trust-social-proof': TrustSocialProof,
  'kpi-targets': KpiTargets,
  // Phase 4: Hero + Executive Variants (3)
  'hero-split': HeroSplit,
  'hero-centered': HeroCentered,
  'checklist-table': ChecklistTable,
};
