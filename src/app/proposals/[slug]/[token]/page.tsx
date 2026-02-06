import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';
import { ExecutiveSummary } from '@/components/proposal/executive-summary';
import { UnderstandingNeeds } from '@/components/proposal/understanding-needs';
import { Solution } from '@/components/proposal/solution';
import { FeaturesSection } from '@/components/proposal/features-section';
import { Roadmap } from '@/components/proposal/roadmap';
import { WhyUs } from '@/components/proposal/why-us';
import { PricingSection } from '@/components/proposal/pricing-section';
import { ContactSection } from '@/components/proposal/contact-section';
import { ProposalErrorBoundary } from '@/components/proposal/proposal-error-boundary';

interface ProposalPageProps {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata({
  params,
}: ProposalPageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const proposal = getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    return {
      title: 'Proposal Not Found',
    };
  }

  return {
    title: `Proposal for ${proposal.client.name} | Tractis`,
    description: `Custom AI proposal for ${proposal.client.name}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { slug, token } = await params;
  const proposal = getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-16" style={{ backgroundColor: 'var(--background)' }}>
      {/* Title Section */}
      <div className="text-center space-y-4 py-8 border-b-2" style={{ borderColor: 'var(--brand-primary)' }}>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--brand-primary)' }}>
          Custom AI Solution
        </h1>
        <p className="text-xl text-muted-foreground">
          Tailored to Your Business Needs
        </p>
      </div>

      {/* 8 Sections */}
      <ProposalErrorBoundary>
        <ExecutiveSummary content={proposal.proposal.executiveSummary} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <UnderstandingNeeds needs={proposal.proposal.needs} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <Solution content={proposal.proposal.solution} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <FeaturesSection features={proposal.proposal.features} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <Roadmap items={proposal.proposal.roadmap} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <WhyUs points={proposal.proposal.whyUs} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <PricingSection pricing={proposal.proposal.pricing} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <ContactSection contact={proposal.proposal.contact} />
      </ProposalErrorBoundary>
    </div>
  );
}
