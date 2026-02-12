import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';
import { BlockRenderer } from '@/components/proposal/block-renderer';
import { ProposalErrorBoundary } from '@/components/proposal/proposal-error-boundary';

interface ProposalPageProps {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata({
  params,
}: ProposalPageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const proposal = await getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    return {
      title: 'Proposal Not Found',
    };
  }

  const faviconUrl = proposal.client.favicon || '/favicon.png';

  // Use metadata title if available, otherwise fall back to client name
  const title = proposal.metadata?.title
    ? `${proposal.metadata.title} | Tractis`
    : `Proposal for ${proposal.client.name} | Tractis`;

  // Find executive-summary block for description
  const execBlock = proposal.blocks.find(b => b.component === 'executive-summary');
  const description = execBlock
    ? String((execBlock.data as Record<string, unknown>).content || '').slice(0, 160)
    : `Custom proposal for ${proposal.client.name}`;

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { slug, token } = await params;
  const proposal = await getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    notFound();
  }

  return (
    <ProposalErrorBoundary>
      <BlockRenderer blocks={proposal.blocks} client={proposal.client} />
    </ProposalErrorBoundary>
  );
}
