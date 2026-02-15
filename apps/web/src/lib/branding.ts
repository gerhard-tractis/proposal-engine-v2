import tractisTheme from '@/data/tractis-theme.json';
import type { Proposal } from '@repo/shared';

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
  const colors = proposal.client.colors;
  const theme = TRACTIS_THEME;


  const h = (hex: string) => hexToHsl(hex);

  const bg = colors?.background || '#ffffff';
  const fg = colors?.foreground || '#1a1a1a';
  const cd = colors?.card || '#f8f9fa';
  const cdFg = colors?.cardForeground || fg;
  const mt = colors?.muted || '#f1f5f9';
  const mtFg = colors?.mutedForeground || '#64748b';
  const bd = colors?.border || branding.colors.accent;

  return {
    // Brand colors (hex — used in inline styles, not Tailwind)
    '--brand-primary': branding.colors.primary,
    '--brand-accent': branding.colors.accent,
    '--brand-primary-hover': adjustColorBrightness(branding.colors.primary, -10),
    '--brand-accent-hover': adjustColorBrightness(branding.colors.accent, -10),

    // Surface colors (HSL — consumed by Tailwind via hsl() wrapper)
    '--background': h(bg),
    '--foreground': h(fg),
    '--card': h(cd),
    '--card-foreground': h(cdFg),
    '--popover': h(cd),
    '--popover-foreground': h(fg),

    // Primary brand colors
    '--primary': h(branding.colors.primary),
    '--primary-foreground': h(bg),

    // Secondary colors
    '--secondary': h(mt),
    '--secondary-foreground': h(fg),

    // Muted colors
    '--muted': h(mt),
    '--muted-foreground': h(mtFg),

    // Accent colors
    '--accent': h(mt),
    '--accent-foreground': h(fg),

    // Borders
    '--border': h(bd),
    '--input': h(bd),
    '--ring': h(branding.colors.primary),

    // Destructive
    '--destructive': h(theme.colors.semantic.error.DEFAULT),
    '--destructive-foreground': h(theme.colors.semantic.error.text),

    // Chart colors
    '--chart-1': theme.colors.charts.series[0],
    '--chart-2': theme.colors.charts.series[1],
    '--chart-3': theme.colors.charts.series[2],
    '--chart-4': theme.colors.charts.series[3],
    '--chart-5': theme.colors.charts.series[4],
  } as React.CSSProperties;
}

/**
 * Convert hex color to HSL space-separated string for CSS variables
 * e.g., "#af1212" → "0 82% 38%"
 */
function hexToHsl(hex: string): string {
  const color = hex.replace('#', '');
  const num = parseInt(color, 16);
  let r = (num >> 16) / 255;
  let g = ((num >> 8) & 0xff) / 255;
  let b = (num & 0xff) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Utility: Adjust hex color brightness
 */
function adjustColorBrightness(hex: string, percent: number): string {
  const color = hex.replace('#', '');
  const num = parseInt(color, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent * 2.55));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent * 2.55));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent * 2.55));
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}

/**
 * Validate hex color string. Returns the color if valid, fallback otherwise.
 */
export function validHex(color: string | undefined, fallback: string): string {
  if (!color) return fallback;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color) ? color : fallback;
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
