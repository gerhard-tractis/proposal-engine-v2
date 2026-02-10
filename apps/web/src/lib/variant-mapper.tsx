import type { ComponentType } from 'react';
import type {
  ExecutiveSummaryVariant,
  UnderstandingNeedsVariant,
  SolutionVariant,
  FeaturesSectionVariant,
  RoadmapVariant,
  WhyUsVariant,
  PricingSectionVariant,
  ContactSectionVariant,
} from '@repo/shared';

// Import existing components
import { ExecutiveSummary } from '@/components/proposal/executive-summary';
import { UnderstandingNeeds } from '@/components/proposal/understanding-needs';
import { Solution } from '@/components/proposal/solution';
import { FeaturesSection } from '@/components/proposal/features-section';
import { Roadmap } from '@/components/proposal/roadmap';
import { WhyUs } from '@/components/proposal/why-us';
import { PricingSection } from '@/components/proposal/pricing-section';
import { ContactSection } from '@/components/proposal/contact-section';

// Import variant components (we'll create these incrementally)
import { ExecutiveSummaryDetailed } from '@/components/proposal/variants/executive-summary-detailed';
// import { ExecutiveSummaryVisual } from '@/components/proposal/variants/executive-summary-visual';
// ... more imports as we create them

/**
 * Variant Component Mapping System
 *
 * Maps variant names to their corresponding React components.
 * Add new variants here as they're created.
 */

// Executive Summary Variants
export const executiveSummaryVariants: Record<ExecutiveSummaryVariant, ComponentType<any>> = {
  brief: ExecutiveSummary, // Default - simple, clean presentation
  detailed: ExecutiveSummaryDetailed, // ✅ Structured with visual cards
  visual: ExecutiveSummary, // TODO: Create ExecutiveSummaryVisual
  timeline: ExecutiveSummary, // TODO: Create ExecutiveSummaryTimeline
};

// Understanding Needs Variants
export const understandingNeedsVariants: Record<UnderstandingNeedsVariant, ComponentType<any>> = {
  list: UnderstandingNeeds, // Current default
  grid: UnderstandingNeeds, // TODO: Create UnderstandingNeedsGrid
  cards: UnderstandingNeeds, // TODO: Create UnderstandingNeedsCards
  timeline: UnderstandingNeeds, // TODO: Create UnderstandingNeedsTimeline
};

// Solution Variants
export const solutionVariants: Record<SolutionVariant, ComponentType<any>> = {
  narrative: Solution, // Current default
  structured: Solution, // TODO: Create SolutionStructured
  visual: Solution, // TODO: Create SolutionVisual
  comparison: Solution, // TODO: Create SolutionComparison
};

// Features Section Variants
export const featuresSectionVariants: Record<FeaturesSectionVariant, ComponentType<any>> = {
  grid: FeaturesSection, // Current default
  list: FeaturesSection, // TODO: Create FeaturesSectionList
  showcase: FeaturesSection, // TODO: Create FeaturesSectionShowcase
  tabbed: FeaturesSection, // TODO: Create FeaturesSectionTabbed
};

// Roadmap Variants
export const roadmapVariants: Record<RoadmapVariant, ComponentType<any>> = {
  timeline: Roadmap, // Current default
  phases: Roadmap, // TODO: Create RoadmapPhases
  gantt: Roadmap, // TODO: Create RoadmapGantt
  milestones: Roadmap, // TODO: Create RoadmapMilestones
};

// Why Us Variants
export const whyUsVariants: Record<WhyUsVariant, ComponentType<any>> = {
  list: WhyUs, // Current default
  grid: WhyUs, // TODO: Create WhyUsGrid
  testimonial: WhyUs, // TODO: Create WhyUsTestimonial
  stats: WhyUs, // TODO: Create WhyUsStats
};

// Pricing Section Variants
export const pricingSectionVariants: Record<PricingSectionVariant, ComponentType<any>> = {
  tiers: PricingSection, // Current default
  table: PricingSection, // TODO: Create PricingSectionTable
  custom: PricingSection, // TODO: Create PricingSectionCustom
  simple: PricingSection, // TODO: Create PricingSectionSimple
};

// Contact Section Variants
export const contactSectionVariants: Record<ContactSectionVariant, ComponentType<any>> = {
  standard: ContactSection, // Current default
  card: ContactSection, // TODO: Create ContactSectionCard
  inline: ContactSection, // TODO: Create ContactSectionInline
  footer: ContactSection, // TODO: Create ContactSectionFooter
};

/**
 * Helper function to get the correct component based on variant name
 */
export function getExecutiveSummaryComponent(variant?: ExecutiveSummaryVariant) {
  return executiveSummaryVariants[variant || 'brief'];
}

export function getUnderstandingNeedsComponent(variant?: UnderstandingNeedsVariant) {
  return understandingNeedsVariants[variant || 'list'];
}

export function getSolutionComponent(variant?: SolutionVariant) {
  return solutionVariants[variant || 'narrative'];
}

export function getFeaturesSectionComponent(variant?: FeaturesSectionVariant) {
  return featuresSectionVariants[variant || 'grid'];
}

export function getRoadmapComponent(variant?: RoadmapVariant) {
  return roadmapVariants[variant || 'timeline'];
}

export function getWhyUsComponent(variant?: WhyUsVariant) {
  return whyUsVariants[variant || 'list'];
}

export function getPricingSectionComponent(variant?: PricingSectionVariant) {
  return pricingSectionVariants[variant || 'tiers'];
}

export function getContactSectionComponent(variant?: ContactSectionVariant) {
  return contactSectionVariants[variant || 'standard'];
}
