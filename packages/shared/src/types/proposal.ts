import { z } from 'zod';

// Lucide React icon names whitelist (add icons as needed)
// Prevents runtime errors from typos or removed icons
const VALID_ICON_NAMES = [
  'Zap', 'TrendingUp', 'Workflow', 'Plug', 'Shield', 'Brain',
  'CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'Calendar',
  'Mail', 'Phone', 'MapPin', 'Clock', 'Users', 'Star',
  'Globe', 'Linkedin', 'Code2', 'DollarSign',
] as const;

// Component Variant Enums - Defines available UI variations for each section
export const ExecutiveSummaryVariants = ['brief', 'detailed', 'visual', 'timeline'] as const;
export const UnderstandingNeedsVariants = ['list', 'grid', 'cards', 'timeline'] as const;
export const SolutionVariants = ['narrative', 'structured', 'visual', 'comparison'] as const;
export const FeaturesSectionVariants = ['grid', 'list', 'showcase', 'tabbed'] as const;
export const RoadmapVariants = ['timeline', 'phases', 'gantt', 'milestones'] as const;
export const WhyUsVariants = ['list', 'grid', 'testimonial', 'stats'] as const;
export const PricingSectionVariants = ['tiers', 'table', 'custom', 'simple'] as const;
export const ContactSectionVariants = ['standard', 'card', 'inline', 'footer'] as const;

// Feature Schema
export const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum(VALID_ICON_NAMES).optional(),
});

// Roadmap Item Schema
export const RoadmapItemSchema = z.object({
  phase: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  deliverables: z.array(z.string().min(1)).optional(),
});

// Pricing Tier Schema
export const PricingTierSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  period: z.string().min(1).optional(),
  features: z.array(z.string().min(1)),
  recommended: z.boolean().optional(),
});

// Pricing Section Schema
export const PricingSectionSchema = z.object({
  tiers: z.array(PricingTierSchema).optional(),
  customNote: z.string().min(1).optional(),
});

// Business Case Schema (cost savings, ROI metrics with transparent calculations)
export const BusinessCaseSchema = z.object({
  costSaving: z.object({
    value: z.string().min(1), // e.g., "$250K annually"
    breakdown: z.array(z.string().min(1)), // Calculation steps: ["Current cost: $400K/year", "After: $150K/year", "Savings: $250K/year"]
  }).optional(),
  additionalIncome: z.object({
    value: z.string().min(1), // e.g., "$500K new revenue"
    breakdown: z.array(z.string().min(1)), // Calculation steps
  }).optional(),
  roi: z.object({
    value: z.string().min(1), // e.g., "6 months"
    breakdown: z.array(z.string().min(1)), // Calculation steps: ["Investment: $50K", "Annual savings: $100K", "Payback: 6 months"]
  }).optional(),
  metrics: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    breakdown: z.array(z.string().min(1)).optional(), // Optional calculation breakdown for custom metrics
  })).optional(),
});

// Tech Stack Schema
export const TechStackSchema = z.object({
  categories: z.array(z.object({
    name: z.string().min(1), // e.g., "Frontend", "Backend", "AI/ML"
    technologies: z.array(z.string().min(1)), // e.g., ["Next.js", "React", "TypeScript"]
  })),
});

// Contact Info Schema
export const ContactInfoSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  website: z.string().url(),
  linkedin: z.string().url(),
  calendly: z.string().url().nullable(),
  cta: z.string().min(1),
});

// Client Schema
export const ClientSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1).regex(/^(\/[\w\/\-\.]+\.(svg|png|jpg|jpeg|webp)|https?:\/\/.+)$/i, 'Invalid logo path or URL'),
  favicon: z.string().regex(/^(\/[\w\/\-\.]+\.(svg|png|jpg|jpeg|webp|ico)|https?:\/\/.+)$/i, 'Invalid favicon path or URL').optional(),
  colors: z.object({
    primary: z.string().regex(/^(#[0-9a-f]{3,8}|rgb\(|hsl\(|oklch\()/i, 'Invalid CSS color format'),
    accent: z.string().regex(/^(#[0-9a-f]{3,8}|rgb\(|hsl\(|oklch\()/i, 'Invalid CSS color format'),
  }),
});

// Proposal Data Schema with Component Variants
export const ProposalDataSchema = z.object({
  executiveSummary: z.string().min(1),
  executiveSummaryVariant: z.enum(ExecutiveSummaryVariants).optional().default('brief'),

  needs: z.array(z.string().min(1)),
  needsVariant: z.enum(UnderstandingNeedsVariants).optional().default('list'),

  solution: z.string().min(1),
  solutionVariant: z.enum(SolutionVariants).optional().default('narrative'),
  businessCase: BusinessCaseSchema.optional(), // Optional BC metrics for solution
  techStack: TechStackSchema.optional(), // Optional tech stack for solution

  features: z.array(FeatureSchema),
  featuresVariant: z.enum(FeaturesSectionVariants).optional().default('grid'),

  roadmap: z.array(RoadmapItemSchema),
  roadmapVariant: z.enum(RoadmapVariants).optional().default('timeline'),

  whyUs: z.string().min(1), // Markdown string with company info (fixed across all proposals)
  whyUsVariant: z.enum(WhyUsVariants).optional().default('list'),

  pricing: PricingSectionSchema,
  pricingVariant: z.enum(PricingSectionVariants).optional().default('tiers'),

  contact: ContactInfoSchema,
  contactVariant: z.enum(ContactSectionVariants).optional().default('standard'),
});

// Proposal Type - Standard (8 sections) or Customized (flexible structure)
export const ProposalTypes = ['standard', 'customized'] as const;

// Main Proposal Schema
export const ProposalSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  token: z.string().length(10).regex(/^[A-Za-z0-9_-]+$/, 'Token must be 10-char alphanumeric'),
  type: z.enum(ProposalTypes).optional().default('standard'), // Default to standard for backward compatibility
  customComponent: z.string().optional(), // Path to custom component (e.g., 'imperial-custom')
  client: ClientSchema,
  proposal: ProposalDataSchema,
});

// Derive TypeScript types from Zod schemas (single source of truth)
export type ProposalType = typeof ProposalTypes[number];
export type Feature = z.infer<typeof FeatureSchema>;
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type PricingSection = z.infer<typeof PricingSectionSchema>;
export type BusinessCase = z.infer<typeof BusinessCaseSchema>;
export type TechStack = z.infer<typeof TechStackSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type ProposalData = z.infer<typeof ProposalDataSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;

// Variant type exports
export type ExecutiveSummaryVariant = typeof ExecutiveSummaryVariants[number];
export type UnderstandingNeedsVariant = typeof UnderstandingNeedsVariants[number];
export type SolutionVariant = typeof SolutionVariants[number];
export type FeaturesSectionVariant = typeof FeaturesSectionVariants[number];
export type RoadmapVariant = typeof RoadmapVariants[number];
export type WhyUsVariant = typeof WhyUsVariants[number];
export type PricingSectionVariant = typeof PricingSectionVariants[number];
export type ContactSectionVariant = typeof ContactSectionVariants[number];
