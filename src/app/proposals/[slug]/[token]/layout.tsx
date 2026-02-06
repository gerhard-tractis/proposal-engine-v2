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
    <div style={brandingStyles} className="min-h-screen bg-background">
      {/* Header with logo */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <p className="font-medium text-foreground">{proposal.client.name}</p>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
