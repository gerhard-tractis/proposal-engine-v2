import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Client } from '@repo/shared';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Import surviving block components
import { KpiBeforeAfter } from '../blocks/kpi-before-after';
import { KpiTargets } from '../blocks/kpi-targets';
import { SecurityOverview } from '../blocks/security-overview';
import { RiskMitigationPlan } from '../blocks/risk-mitigation-plan';
import { ExecutiveSummaryMetrics } from '../blocks/executive-summary-metrics';
import { ProblemMetricsTable } from '../blocks/problem-metrics-table';
import { SolutionCapabilities } from '../blocks/solution-capabilities';
import { FeaturesAccordion } from '../blocks/features-accordion';
import { FeaturesTabs } from '../blocks/features-tabs';
import { PricingDetailed } from '../blocks/pricing-detailed';
import { CtaActionItems } from '../blocks/cta-action-items';
import { SlaTiers } from '../blocks/sla-tiers';
import { LegalSections } from '../blocks/legal-sections';
import { LegalSignature } from '../blocks/legal-signature';
import { TrustCredentials } from '../blocks/trust-credentials';
import { TrustSocialProof } from '../blocks/trust-social-proof';
import { TitleHeader } from '../blocks/title-header';

const mockClient: Client = {
  name: 'Test Client',
  logo: '/logos/test.svg',
  colors: { primary: '#1a73e8', accent: '#34a853' },
};

describe('Block Components', () => {
  describe('KPIs/Metrics Components', () => {
    describe('KpiBeforeAfter', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Before & After',
          comparisons: [
            { metric: 'Response Time', before: '2s', after: '0.5s', improvement: '75%' },
          ],
        };

        render(<KpiBeforeAfter data={data} client={mockClient} />);

        expect(screen.getByText('Before & After')).toBeInTheDocument();
        expect(screen.getByText('Response Time')).toBeInTheDocument();
        expect(screen.getByText('2s')).toBeInTheDocument();
        expect(screen.getByText('0.5s')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { comparisons: [] };
        const { container } = render(<KpiBeforeAfter data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('KpiTargets', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Key Performance Targets',
          targets: [
            { metric: 'Revenue Growth', target: '150%', timeline: 'Q4 2024' },
          ],
        };

        render(<KpiTargets data={data} client={mockClient} />);

        expect(screen.getByText('Key Performance Targets')).toBeInTheDocument();
        expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
        expect(screen.getByText('150%')).toBeInTheDocument();
        expect(screen.getByText('Q4 2024')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { targets: [] };
        const { container } = render(<KpiTargets data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Security Components', () => {
    describe('SecurityOverview', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Security Overview',
          content: 'Our security approach',
          badges: ['SOC 2', 'ISO 27001'],
          layers: [
            { layer: 'Network', technology: 'Firewall', description: 'Protection' },
          ],
        };

        render(<SecurityOverview data={data} client={mockClient} />);

        expect(screen.getByText('Security Overview')).toBeInTheDocument();
        expect(screen.getByText('Our security approach')).toBeInTheDocument();
        expect(screen.getByText('SOC 2')).toBeInTheDocument();
        expect(screen.getByText('Network')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<SecurityOverview data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Risk Components', () => {
    describe('RiskMitigationPlan', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Risk Mitigation Plan',
          risks: [
            {
              risk: 'Data loss',
              probability: 'medium',
              impact: 'high',
              actions: [
                {
                  action: 'Daily backups',
                  owner: 'IT Team',
                  deadline: '2024-01-01',
                  status: 'in-progress',
                },
              ],
            },
          ],
        };

        render(<RiskMitigationPlan data={data} client={mockClient} />);

        expect(screen.getByText('Risk Mitigation Plan')).toBeInTheDocument();
        expect(screen.getByText('Data loss')).toBeInTheDocument();
        expect(screen.getByText('Daily backups')).toBeInTheDocument();
        expect(screen.getByText('IT Team')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { risks: [] };
        const { container } = render(<RiskMitigationPlan data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Executive Components', () => {
    describe('ExecutiveSummaryMetrics', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Executive Summary',
          content: 'Summary content here',
          metrics: [
            { label: 'ROI', value: '200%' },
          ],
        };

        render(<ExecutiveSummaryMetrics data={data} client={mockClient} />);

        expect(screen.getByText('Executive Summary')).toBeInTheDocument();
        expect(screen.getByText('Summary content here')).toBeInTheDocument();
        expect(screen.getByText('ROI')).toBeInTheDocument();
        expect(screen.getByText('200%')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<ExecutiveSummaryMetrics data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Problem/Needs Components', () => {
    describe('ProblemMetricsTable', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Current Problems',
          metrics: [
            { metric: 'Downtime', currentValue: '10%', impact: 'High' },
          ],
        };

        render(<ProblemMetricsTable data={data} client={mockClient} />);

        expect(screen.getByText('Current Problems')).toBeInTheDocument();
        expect(screen.getByText('Downtime')).toBeInTheDocument();
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { metrics: [] };
        const { container } = render(<ProblemMetricsTable data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Solution Components', () => {
    describe('SolutionCapabilities', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Our Solution',
          content: 'Solution description',
          capabilities: [
            { number: 1, title: 'Scalability', description: 'Grows with you' },
          ],
        };

        render(<SolutionCapabilities data={data} client={mockClient} />);

        expect(screen.getByText('Our Solution')).toBeInTheDocument();
        expect(screen.getByText('Solution description')).toBeInTheDocument();
        expect(screen.getByText('Scalability')).toBeInTheDocument();
        expect(screen.getByText('Grows with you')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<SolutionCapabilities data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Features Components', () => {
    describe('FeaturesAccordion', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Features',
          features: [
            { id: 'F1', title: 'Feature One', details: ['Detail A', 'Detail B'] },
          ],
        };

        render(<FeaturesAccordion data={data} client={mockClient} />);

        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('F1')).toBeInTheDocument();
        expect(screen.getByText('Feature One')).toBeInTheDocument();
        // Details are inside accordion content and should be visible
        expect(screen.getByText('Detail A')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { features: [] };
        const { container } = render(<FeaturesAccordion data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });

    describe('FeaturesTabs', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Feature Details',
          tabs: [
            { label: 'Tab 1', content: 'Tab content here' },
          ],
        };

        render(<FeaturesTabs data={data} client={mockClient} />);

        expect(screen.getByText('Feature Details')).toBeInTheDocument();
        // Tab label appears twice: in trigger and in content heading
        expect(screen.getAllByText('Tab 1')[0]).toBeInTheDocument();
        expect(screen.getByText('Tab content here')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { tabs: [] };
        const { container } = render(<FeaturesTabs data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Pricing Components', () => {
    describe('PricingDetailed', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Pricing',
          setupFees: [
            { item: 'Installation', cost: '$500' },
          ],
          tiers: [
            { name: 'Basic', price: '$99', period: 'month', features: ['Feature 1'] },
          ],
        };

        render(<PricingDetailed data={data} client={mockClient} />);

        expect(screen.getByText('Pricing')).toBeInTheDocument();
        expect(screen.getByText('Installation')).toBeInTheDocument();
        expect(screen.getByText('$500')).toBeInTheDocument();
        expect(screen.getByText('Basic')).toBeInTheDocument();
        expect(screen.getByText('$99')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<PricingDetailed data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('CTA Components', () => {
    describe('CtaActionItems', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Next Steps',
          actionItems: [
            { step: '1', action: 'Sign contract', responsible: 'Client', timeline: '1 week' },
          ],
        };

        render(<CtaActionItems data={data} client={mockClient} />);

        expect(screen.getByText('Next Steps')).toBeInTheDocument();
        expect(screen.getByText('Sign contract')).toBeInTheDocument();
        expect(screen.getByText('Client')).toBeInTheDocument();
        expect(screen.getByText('1 week')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<CtaActionItems data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('SLA Components', () => {
    describe('SlaTiers', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Service Level Agreement',
          platformSla: { uptime: '99.9%', description: 'Guaranteed uptime' },
          tiers: [
            {
              severity: 'P1 - Critical',
              responseTime: '15 minutes',
              resolutionTarget: '4 hours',
              channels: 'Phone, Email',
            },
          ],
        };

        render(<SlaTiers data={data} client={mockClient} />);

        expect(screen.getByText('Service Level Agreement')).toBeInTheDocument();
        expect(screen.getByText('99.9%')).toBeInTheDocument();
        expect(screen.getByText('P1 - Critical')).toBeInTheDocument();
        expect(screen.getByText('15 minutes')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<SlaTiers data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Legal Components', () => {
    describe('LegalSections', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Terms and Conditions',
          sections: [
            { number: '1', title: 'Agreement', content: 'This agreement...' },
          ],
        };

        render(<LegalSections data={data} client={mockClient} />);

        expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
        expect(screen.getByText('Agreement')).toBeInTheDocument();
        expect(screen.getByText('This agreement...')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { sections: [] };
        const { container } = render(<LegalSections data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });

    describe('LegalSignature', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Signature Page',
          parties: [
            { role: 'Client', company: 'Acme Corp', name: 'John Doe', title: 'CEO' },
          ],
        };

        render(<LegalSignature data={data} client={mockClient} />);

        expect(screen.getByText('Signature Page')).toBeInTheDocument();
        expect(screen.getByText('Client')).toBeInTheDocument();
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('CEO')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { parties: [] };
        const { container } = render(<LegalSignature data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Trust Components', () => {
    describe('TrustCredentials', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Our Team',
          team: [
            { name: 'Jane Smith', role: 'CTO', bio: 'Expert in technology' },
          ],
        };

        render(<TrustCredentials data={data} client={mockClient} />);

        expect(screen.getByText('Our Team')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('CTO')).toBeInTheDocument();
        expect(screen.getByText('Expert in technology')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { team: [] };
        const { container } = render(<TrustCredentials data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });

    describe('TrustSocialProof', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'What Our Clients Say',
          testimonials: [
            { quote: 'Great service!', author: 'Bob', company: 'XYZ Inc' },
          ],
        };

        render(<TrustSocialProof data={data} client={mockClient} />);

        expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
        // Quote uses fancy quotation marks (&ldquo; and &rdquo;)
        expect(screen.getByText(/Great service!/)).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText(/XYZ Inc/)).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<TrustSocialProof data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Utility Components', () => {
    describe('TitleHeader', () => {
      it('renders with valid data', () => {
        const data = {
          title: 'Proposal Title',
          subtitle: 'A compelling subtitle',
        };

        render(<TitleHeader data={data} client={mockClient} />);

        expect(screen.getByText('Proposal Title')).toBeInTheDocument();
        expect(screen.getByText('A compelling subtitle')).toBeInTheDocument();
      });

      it('renders without subtitle', () => {
        const data = {
          title: 'Just a Title',
        };

        render(<TitleHeader data={data} client={mockClient} />);

        expect(screen.getByText('Just a Title')).toBeInTheDocument();
      });

      it('returns null with empty title', () => {
        const data = {};
        const { container } = render(<TitleHeader data={data} client={mockClient} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });
});
