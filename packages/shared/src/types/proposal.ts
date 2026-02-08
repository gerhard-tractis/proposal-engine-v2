import { z } from 'zod';

// Lucide React icon names whitelist (add icons as needed)
// Prevents runtime errors from typos or removed icons
const VALID_ICON_NAMES = [
  'Zap', 'TrendingUp', 'Workflow', 'Plug', 'Shield', 'Brain',
  'CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'Calendar',
  'Mail', 'Phone', 'MapPin', 'Clock', 'Users', 'Star',
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

// Contact Info Schema
export const ContactInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  calendlyUrl: z.string().url().optional(),
  nextSteps: z.array(z.string().min(1)),
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

// Proposal Data Schema
export const ProposalDataSchema = z.object({
  executiveSummary: z.string().min(1),
  needs: z.array(z.string().min(1)),
  solution: z.string().min(1),
  features: z.array(FeatureSchema),
  roadmap: z.array(RoadmapItemSchema),
  whyUs: z.array(z.string().min(1)),
  pricing: PricingSectionSchema,
  contact: ContactInfoSchema,
});

// Main Proposal Schema
export const ProposalSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  token: z.string().length(10).regex(/^[A-Za-z0-9_-]+$/, 'Token must be 10-char alphanumeric'),
  client: ClientSchema,
  proposal: ProposalDataSchema,
});

// Derive TypeScript types from Zod schemas (single source of truth)
export type Feature = z.infer<typeof FeatureSchema>;
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type PricingSection = z.infer<typeof PricingSectionSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type ProposalData = z.infer<typeof ProposalDataSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
