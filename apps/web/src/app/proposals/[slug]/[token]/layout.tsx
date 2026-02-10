import { notFound } from 'next/navigation';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';
import { generateBrandingCSSVars } from '@/lib/branding';
import { LogoWithFallback } from '@/components/proposal/logo-with-fallback';

interface ProposalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; token: string }>;
}

export default async function ProposalLayout({
  children,
  params,
}: ProposalLayoutProps) {
  const { slug, token } = await params;
  const proposal = getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    notFound();
  }

  // Apply client-specific branding via CSS variables
  const brandingStyles = generateBrandingCSSVars(proposal);

  // For custom proposals, render minimal wrapper with just sticky header
  if (proposal.type === 'customized') {
    return (
      <div style={brandingStyles}>
        {/* Sticky Header */}
        <header
          className="border-b sticky top-0 z-50 backdrop-blur-md"
          style={{
            backgroundColor: '#0c3a6380',
            borderColor: '#0c3a63',
            borderWidth: '2px'
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <LogoWithFallback
                src={proposal.client.logo}
                alt={`${proposal.client.name} logo`}
                fallbackSrc="/logos/tractis-white.svg"
                fallbackAlt="Tractis logo"
                width={140}
                height={46}
                className="h-10 w-auto"
                priority
              />
              <div className="text-right">
                {proposal.slug === 'imperial' ? (
                  <>
                    <p className="text-sm font-semibold text-white">Aureon Connect</p>
                    <p className="text-xs text-white/80">Propuesta Confidencial</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-white/80">Custom Proposal</p>
                    <p className="font-medium text-white">{proposal.client.name}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        ...brandingStyles,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
      className="min-h-screen proposal-branded"
    >
      {/* Header with logo */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--brand-primary)',
          borderWidth: '2px'
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between">
            <LogoWithFallback
              src={proposal.client.logo}
              alt={`${proposal.client.name} logo`}
              fallbackSrc="/logos/tractis-white.svg"
              fallbackAlt="Tractis logo"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Custom Proposal</p>
              <p className="font-medium" style={{ color: 'var(--brand-accent)' }}>{proposal.client.name}</p>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
