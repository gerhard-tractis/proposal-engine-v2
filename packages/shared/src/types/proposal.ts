import { z } from 'zod';

// Lucide React icon names whitelist (add icons as needed)
// Prevents runtime errors from typos or removed icons
export const VALID_ICON_NAMES = [
  'Zap', 'TrendingUp', 'Workflow', 'Plug', 'Shield', 'Brain',
  'CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'Calendar',
  'Mail', 'Phone', 'MapPin', 'Clock', 'Users', 'Star',
  'Globe', 'Linkedin', 'Code2', 'DollarSign',
  'Check', 'ArrowRight', 'ArrowDown', 'Layers',
] as const;

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
    value: z.string().min(1),
    breakdown: z.array(z.string().min(1)),
  }).optional(),
  additionalIncome: z.object({
    value: z.string().min(1),
    breakdown: z.array(z.string().min(1)),
  }).optional(),
  roi: z.object({
    value: z.string().min(1),
    breakdown: z.array(z.string().min(1)),
  }).optional(),
  metrics: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    breakdown: z.array(z.string().min(1)).optional(),
  })).optional(),
});

// Tech Stack Schema
export const TechStackSchema = z.object({
  categories: z.array(z.object({
    name: z.string().min(1),
    technologies: z.array(z.string().min(1)),
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

// Block Schema — core building block of proposals
export const BlockSchema = z.object({
  id: z.string().min(1),
  component: z.string().min(1),
  data: z.record(z.unknown()),
});

// Proposal Metadata Schema — proposal-level configuration
export const ProposalMetadataSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  headerStyle: z.enum(['standard', 'dark', 'transparent']).optional().default('standard'),
  maxWidth: z.enum(['5xl', '7xl']).optional().default('5xl'),
});

// Main Proposal Schema
export const ProposalSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  token: z.string().length(10).regex(/^[A-Za-z0-9_-]+$/, 'Token must be 10-char alphanumeric'),
  client: ClientSchema,
  metadata: ProposalMetadataSchema.optional().default({}),
  blocks: z.array(BlockSchema).min(1),
});

// Derive TypeScript types from Zod schemas (single source of truth)
export type Feature = z.infer<typeof FeatureSchema>;
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type PricingSection = z.infer<typeof PricingSectionSchema>;
export type BusinessCase = z.infer<typeof BusinessCaseSchema>;
export type TechStack = z.infer<typeof TechStackSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type ProposalMetadata = z.infer<typeof ProposalMetadataSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
