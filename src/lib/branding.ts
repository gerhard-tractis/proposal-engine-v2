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
 * Uses scraped palette to simulate agent extraction from customer website
 */
export function generateBrandingCSSVars(proposal: Proposal): React.CSSProperties {
  const branding = getProposalBranding(proposal);
  const theme = TRACTIS_THEME;

  return {
    // Brand colors from scraped palette
    '--brand-primary': branding.colors.primary,
    '--brand-accent': branding.colors.accent,
    '--brand-primary-hover': adjustColorBrightness(branding.colors.primary, -10),
    '--brand-accent-hover': adjustColorBrightness(branding.colors.accent, -10),

    // Surface colors - Testing dark gray background
    '--background': theme.colors.gray['800'], // #1e293b (dark gray)
    '--foreground': theme.colors.text.inverse, // #ffffff (white text on dark)
    '--card': theme.colors.gray['700'], // #334155 (darker cards)
    '--card-foreground': theme.colors.text.inverse, // #ffffff (white text)
    '--popover': theme.colors.surface.card,
    '--popover-foreground': theme.colors.text.primary,

    // Primary brand colors
    '--primary': branding.colors.primary, // #e6c15c
    '--primary-foreground': theme.colors.gray['900'], // #0f172a

    // Secondary colors - Light grays
    '--secondary': theme.colors.gray['100'], // #f1f5f9
    '--secondary-foreground': theme.colors.text.primary,

    // Muted colors for less prominent text
    '--muted': theme.colors.gray['700'],
    '--muted-foreground': theme.colors.gray['400'], // #94a3b8 (lighter gray for dark bg)

    // Accent colors
    '--accent': theme.colors.gray['100'],
    '--accent-foreground': theme.colors.text.primary,

    // Borders - Subtle light gray
    '--border': theme.colors.border.subtle, // #e2e8f0
    '--input': theme.colors.border.default, // #cbd5e1
    '--ring': branding.colors.primary,

    // Destructive
    '--destructive': theme.colors.semantic.error.DEFAULT,
    '--destructive-foreground': theme.colors.semantic.error.text,

    // Chart colors
    '--chart-1': theme.colors.charts.series[0],
    '--chart-2': theme.colors.charts.series[1],
    '--chart-3': theme.colors.charts.series[2],
    '--chart-4': theme.colors.charts.series[3],
    '--chart-5': theme.colors.charts.series[4],
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
