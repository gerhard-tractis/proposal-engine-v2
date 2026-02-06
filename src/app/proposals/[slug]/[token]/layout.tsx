import { notFound } from 'next/navigation';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';

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
  const brandingStyles = {
    '--brand-primary': proposal.client.colors.primary,
    '--brand-accent': proposal.client.colors.accent,
  } as React.CSSProperties;

  return (
    <div style={brandingStyles} className="min-h-screen bg-background">
      {children}
    </div>
  );
}
