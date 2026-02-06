import tractisTheme from '@/data/tractis-theme.json';
import type { Proposal } from '@/types/proposal';

/**
 * Tractis Design System
 * Single source of truth for brand identity
 */
export const TRACTIS_THEME = tractisTheme;

/**
 * Get branding for a proposal
 * Returns client branding if provided, otherwise Tractis default
 */
export function getProposalBranding(proposal: Proposal) {
  return {
    logo: proposal.client.logo,
    colors: {
      primary: proposal.client.colors?.primary || TRACTIS_THEME.colors.brand.gold.DEFAULT,
      accent: proposal.client.colors?.accent || TRACTIS_THEME.colors.brand.slate.DEFAULT,
    },
    fonts: {
      display: TRACTIS_THEME.typography.fontFamily.display,
      body: TRACTIS_THEME.typography.fontFamily.body,
      mono: TRACTIS_THEME.typography.fontFamily.mono,
    },
  };
}

/**
 * Generate CSS variables for client branding
 */
export function generateBrandingCSSVars(proposal: Proposal): React.CSSProperties {
  const branding = getProposalBranding(proposal);

  return {
    '--brand-primary': branding.colors.primary,
    '--brand-accent': branding.colors.accent,
    '--brand-primary-hover': adjustColorBrightness(branding.colors.primary, -10),
    '--brand-accent-hover': adjustColorBrightness(branding.colors.accent, -10),
  } as React.CSSProperties;
}

/**
 * Utility: Adjust hex color brightness
 */
function adjustColorBrightness(hex: string, percent: number): string {
  // Handle # prefix
  const color = hex.replace('#', '');

  // Convert to RGB
  const num = parseInt(color, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent * 2.55));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent * 2.55));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent * 2.55));

  // Convert back to hex
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}

/**
 * Tractis brand colors (for use outside proposals)
 */
export const TRACTIS_COLORS = {
  gold: TRACTIS_THEME.colors.brand.gold,
  slate: TRACTIS_THEME.colors.brand.slate,
  success: TRACTIS_THEME.colors.semantic.success,
  warning: TRACTIS_THEME.colors.semantic.warning,
  error: TRACTIS_THEME.colors.semantic.error,
  info: TRACTIS_THEME.colors.semantic.info,
};
