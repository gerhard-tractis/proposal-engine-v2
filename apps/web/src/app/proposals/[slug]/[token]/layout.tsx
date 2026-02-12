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
  const proposal = await getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    notFound();
  }

  const brandingStyles = generateBrandingCSSVars(proposal);
  const headerStyle = proposal.metadata?.headerStyle || 'standard';
  const maxWidth = proposal.metadata?.maxWidth === '7xl' ? 'max-w-7xl' : 'max-w-5xl';
  const headerTitle = proposal.metadata?.title || 'Custom Proposal';
  const headerSubtitle = proposal.metadata?.subtitle || proposal.client.name;

  // Header style configuration
  const isDark = headerStyle === 'dark';
  const headerBg = isDark
    ? { backgroundColor: `${proposal.client.colors.accent}80` }
    : { backgroundColor: 'var(--card)' };
  const headerBorder = isDark
    ? { borderColor: proposal.client.colors.accent, borderWidth: '2px' }
    : { borderColor: 'var(--brand-primary)', borderWidth: '2px' };

  return (
    <div
      style={{
        ...brandingStyles,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
      className="min-h-screen proposal-branded"
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-md"
        style={{ ...headerBg, ...headerBorder }}
      >
        <div className={`mx-auto ${maxWidth} px-4 sm:px-6 py-3 sm:py-4`}>
          <div className="flex items-center justify-between gap-4">
            <LogoWithFallback
              src={proposal.client.logo}
              alt={`${proposal.client.name} logo`}
              fallbackSrc="/logos/tractis-white.svg"
              fallbackAlt="Tractis logo"
              width={isDark ? 140 : 180}
              height={isDark ? 46 : 60}
              className={isDark ? 'h-8 sm:h-10 w-auto max-w-[45%] sm:max-w-none object-contain' : 'h-12 w-auto'}
              priority
            />
            <div className="text-right">
              {isDark ? (
                <>
                  <p className="text-xs sm:text-sm font-semibold text-white">{headerTitle}</p>
                  <p className="text-[10px] sm:text-xs text-white/80">{headerSubtitle}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{headerTitle}</p>
                  <p className="font-medium" style={{ color: 'var(--brand-accent)' }}>{headerSubtitle}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`mx-auto ${maxWidth} px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-16`}>
        {children}
      </main>
    </div>
  );
}
