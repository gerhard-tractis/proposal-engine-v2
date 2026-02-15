import { describe, it, expect } from 'vitest';
import { generateBrandingCSSVars, getProposalBranding } from './branding';
import type { Proposal } from '@repo/shared';

// CSS custom properties aren't in CSSProperties index signature
type CSSVarsResult = Record<string, string>;

describe('Branding Module', () => {
  describe('getProposalBranding', () => {
    it('should return client colors when provided', () => {
      const mockProposal: Proposal = {
        slug: 'test-client',
        token: 'test123456',
        client: {
          name: 'Test Client',
          logo: '/logos/test.svg',
          colors: {
            primary: '#ff0000',
            accent: '#00ff00',
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const branding = getProposalBranding(mockProposal);

      expect(branding.colors.primary).toBe('#ff0000');
      expect(branding.colors.accent).toBe('#00ff00');
    });
  });

  describe('generateBrandingCSSVars - Bug Fix Tests', () => {
    it('should use client primary color for --brand-primary (not hardcoded #dfad30)', () => {
      const imperialProposal: Proposal = {
        slug: 'imperial',
        token: 'Zh3zaPJV4U',
        client: {
          name: 'Imperial',
          logo: '/logos/imperial-logo.png',
          colors: {
            primary: '#f72e3c', // Imperial red
            accent: '#85909e',  // Imperial gray
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(imperialProposal) as CSSVarsResult;

      // CRITICAL: These should use client colors, NOT hardcoded Tractis colors
      expect(cssVars['--brand-primary']).toBe('#f72e3c');
      expect(cssVars['--brand-primary']).not.toBe('#dfad30'); // Old hardcoded value

      expect(cssVars['--brand-accent']).toBe('#85909e');
      expect(cssVars['--brand-accent']).not.toBe('#7b8b9d'); // Old hardcoded value
    });

    it('should use client primary color for --primary CSS variable', () => {
      const mockProposal: Proposal = {
        slug: 'test',
        token: 'test123456',
        client: {
          name: 'Test',
          logo: '/logos/test.svg',
          colors: {
            primary: '#00ff00',
            accent: '#0000ff',
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(mockProposal) as CSSVarsResult;

      // --primary returns HSL space-separated string (e.g., "120 100% 50%"), not hex
      expect(cssVars['--primary']).toBe('120 100% 50%'); // #00ff00 in HSL
      expect(cssVars['--primary']).not.toBe('#dfad30'); // Old bug
    });

    it('should use client accent color for --border CSS variable', () => {
      const mockProposal: Proposal = {
        slug: 'test',
        token: 'test123456',
        client: {
          name: 'Test',
          logo: '/logos/test.svg',
          colors: {
            primary: '#00ff00',
            accent: '#0000ff',
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(mockProposal) as CSSVarsResult;

      // --border returns HSL space-separated string (e.g., "240 100% 50%"), not hex
      expect(cssVars['--border']).toBe('240 100% 50%'); // #0000ff in HSL
      expect(cssVars['--border']).not.toBe('#7b8b9d'); // Old bug
    });

    it('should use client primary color for --ring CSS variable', () => {
      const mockProposal: Proposal = {
        slug: 'test',
        token: 'test123456',
        client: {
          name: 'Test',
          logo: '/logos/test.svg',
          colors: {
            primary: '#ff00ff',
            accent: '#00ffff',
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(mockProposal) as CSSVarsResult;

      // --ring returns HSL space-separated string (e.g., "300 100% 50%"), not hex
      expect(cssVars['--ring']).toBe('300 100% 50%'); // #ff00ff in HSL
      expect(cssVars['--ring']).not.toBe('#dfad30'); // Old bug
    });

    it('should generate hover colors based on client primary color', () => {
      const mockProposal: Proposal = {
        slug: 'test',
        token: 'test123456',
        client: {
          name: 'Test',
          logo: '/logos/test.svg',
          colors: {
            primary: '#ffffff', // White
            accent: '#000000', // Black
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(mockProposal) as CSSVarsResult;

      // Hover colors should be calculated from client colors, not hardcoded
      expect(cssVars['--brand-primary-hover']).toBeDefined();
      expect(cssVars['--brand-accent-hover']).toBeDefined();

      // They should be darker versions of the original colors
      expect(typeof cssVars['--brand-primary-hover']).toBe('string');
      expect(typeof cssVars['--brand-accent-hover']).toBe('string');
    });
  });

  describe('Real-world Imperial Proposal Test', () => {
    it('should correctly apply Imperial branding colors', () => {
      const imperialProposal: Proposal = {
        slug: 'imperial',
        token: 'Zh3zaPJV4U',
        client: {
          name: 'Imperial',
          logo: '/logos/imperial-logo.png',
          colors: {
            primary: '#f72e3c', // Imperial red
            accent: '#85909e',  // Imperial gray
          },
        },
        metadata: { headerStyle: 'standard' as const, maxWidth: '5xl' as const },
        blocks: [{ id: 'b1', component: 'executive-summary', data: { content: 'Test' } }],
      };

      const cssVars = generateBrandingCSSVars(imperialProposal) as CSSVarsResult;

      // Verify all Imperial colors are applied correctly
      // --brand-primary and --brand-accent return hex values (direct assignment)
      expect(cssVars['--brand-primary']).toBe('#f72e3c');
      expect(cssVars['--brand-accent']).toBe('#85909e');

      // --primary, --border, and --ring return HSL space-separated strings (via hexToHsl)
      expect(cssVars['--primary']).toBe('356 93% 57%'); // #f72e3c in HSL
      expect(cssVars['--border']).toBe('214 11% 57%');  // #85909e in HSL
      expect(cssVars['--ring']).toBe('356 93% 57%');    // #f72e3c in HSL

      // Verify NO Tractis colors are present
      expect(cssVars['--brand-primary']).not.toBe('#dfad30');
      expect(cssVars['--brand-accent']).not.toBe('#7b8b9d');
    });
  });
});
