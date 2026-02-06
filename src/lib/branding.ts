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
 * Applies full Tractis theme including surfaces, text, borders
 */
export function generateBrandingCSSVars(proposal: Proposal): React.CSSProperties {
  const branding = getProposalBranding(proposal);
  const theme = TRACTIS_THEME;

  return {
    // Brand colors
    '--brand-primary': branding.colors.primary,
    '--brand-accent': branding.colors.accent,
    '--brand-primary-hover': adjustColorBrightness(branding.colors.primary, -10),
    '--brand-accent-hover': adjustColorBrightness(branding.colors.accent, -10),

    // Surface colors (light theme)
    '--background': theme.colors.surface.page,
    '--foreground': theme.colors.text.primary,
    '--card': theme.colors.surface.card,
    '--card-foreground': theme.colors.text.primary,
    '--popover': theme.colors.surface.card,
    '--popover-foreground': theme.colors.text.primary,

    // Primary brand colors
    '--primary': branding.colors.primary,
    '--primary-foreground': theme.colors.gray['900'],

    // Secondary colors
    '--secondary': theme.colors.gray['100'],
    '--secondary-foreground': theme.colors.text.primary,

    // Muted colors
    '--muted': theme.colors.gray['100'],
    '--muted-foreground': theme.colors.text.secondary,

    // Accent colors
    '--accent': theme.colors.gray['100'],
    '--accent-foreground': theme.colors.text.primary,

    // Borders
    '--border': theme.colors.border.subtle,
    '--input': theme.colors.border.default,
    '--ring': branding.colors.primary,

    // Destructive
    '--destructive': theme.colors.semantic.error.DEFAULT,
    '--destructive-foreground': theme.colors.semantic.error.text,
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
