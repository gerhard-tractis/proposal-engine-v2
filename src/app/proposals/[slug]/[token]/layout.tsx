import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';
import { generateBrandingCSSVars } from '@/lib/branding';

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

  return (
    <div style={brandingStyles} className="min-h-screen bg-background text-foreground proposal-branded">
      {/* Header with logo */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur" style={{ borderColor: 'var(--brand-primary)', borderWidth: '2px' }}>
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between">
            <Image
              src={proposal.client.logo}
              alt={`${proposal.client.name} logo`}
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
