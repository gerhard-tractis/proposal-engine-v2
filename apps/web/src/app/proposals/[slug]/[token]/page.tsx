import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProposalBySlugAndToken } from '@/lib/proposal-helpers';
import { ProposalErrorBoundary } from '@/components/proposal/proposal-error-boundary';
import {
  getExecutiveSummaryComponent,
  getUnderstandingNeedsComponent,
  getSolutionComponent,
  getFeaturesSectionComponent,
  getRoadmapComponent,
  getWhyUsComponent,
  getPricingSectionComponent,
  getContactSectionComponent,
} from '@/lib/variant-mapper';

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

  // Use client favicon if available, otherwise Tractis default
  const faviconUrl = proposal.client.favicon || '/favicon.png';

  return {
    title: proposal.slug === 'imperial'
      ? 'Aureon Connect - Integrador Universal de Última Milla | Tractis'
      : `Proposal for ${proposal.client.name} | Tractis`,
    description: proposal.slug === 'imperial'
      ? 'Elimina el vendor lock-in y conecta cualquier sistema de transporte en 48 horas'
      : `Custom AI proposal for ${proposal.client.name}`,
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
  const proposal = getProposalBySlugAndToken(slug, token);

  if (!proposal) {
    notFound();
  }

  // Check if this is Imperial - use custom component
  if (proposal.slug === 'imperial') {
    try {
      const CustomComponent = (await import(`@/components/proposal/custom/imperial-custom`)).default;
      return <CustomComponent proposal={proposal} />;
    } catch (error) {
      console.error(`Failed to load Imperial custom component`, error);
      return (
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h1 className="text-2xl font-bold text-red-600">Custom Proposal Error</h1>
          <p>Failed to load Imperial custom proposal component</p>
        </div>
      );
    }
  }

  // Standard 8-section proposal
  // Use default components (local schema doesn't support variants)
  const ExecutiveSummaryComponent = getExecutiveSummaryComponent('detailed');
  const UnderstandingNeedsComponent = getUnderstandingNeedsComponent('list');
  const SolutionComponent = getSolutionComponent('narrative');
  const FeaturesSectionComponent = getFeaturesSectionComponent('grid');
  const RoadmapComponent = getRoadmapComponent('timeline');
  const WhyUsComponent = getWhyUsComponent('list');
  const PricingSectionComponent = getPricingSectionComponent('tiers');
  const ContactSectionComponent = getContactSectionComponent('standard');

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

      {/* 8 Sections - Now using dynamic variant components */}
      <ProposalErrorBoundary>
        <ExecutiveSummaryComponent content={proposal.proposal.executiveSummary} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <UnderstandingNeedsComponent needs={proposal.proposal.needs} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <SolutionComponent
          content={proposal.proposal.solution}
          businessCase={proposal.proposal.businessCase}
          techStack={proposal.proposal.techStack}
        />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <FeaturesSectionComponent features={proposal.proposal.features} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <RoadmapComponent items={proposal.proposal.roadmap} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <WhyUsComponent content={proposal.proposal.whyUs} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <PricingSectionComponent pricing={proposal.proposal.pricing} />
      </ProposalErrorBoundary>

      <ProposalErrorBoundary>
        <ContactSectionComponent contact={proposal.proposal.contact} />
      </ProposalErrorBoundary>
    </div>
  );
}
