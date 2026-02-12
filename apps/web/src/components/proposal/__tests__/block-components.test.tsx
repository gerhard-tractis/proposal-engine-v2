import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Client } from '@repo/shared';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Import all block components
import { DataTableStandard } from '../blocks/data-table-standard';
import { DataTableComparison } from '../blocks/data-table-comparison';
import { ChecklistTable } from '../blocks/checklist-table';
import { MetricsGrid } from '../blocks/metrics-grid';
import { KpiDashboard } from '../blocks/kpi-dashboard';
import { KpiBeforeAfter } from '../blocks/kpi-before-after';
import { KpiTargets } from '../blocks/kpi-targets';
import { SecurityOverview } from '../blocks/security-overview';
import { SecurityControls } from '../blocks/security-controls';
import { ComplianceMatrix } from '../blocks/compliance-matrix';
import { RiskMatrix } from '../blocks/risk-matrix';
import { RiskHeatmap } from '../blocks/risk-heatmap';
import { RiskMitigationPlan } from '../blocks/risk-mitigation-plan';
import { ExecutiveSummaryMetrics } from '../blocks/executive-summary-metrics';
import { ExecutiveSummaryTimeline } from '../blocks/executive-summary-timeline';
import { ProblemMetricsTable } from '../blocks/problem-metrics-table';
import { SolutionCapabilities } from '../blocks/solution-capabilities';
import { FeaturesAccordion } from '../blocks/features-accordion';
import { FeaturesTabs } from '../blocks/features-tabs';
import { PricingDetailed } from '../blocks/pricing-detailed';
import { TimelineTable } from '../blocks/timeline-table';
import { TimelineGantt } from '../blocks/timeline-gantt';
import { CtaActionItems } from '../blocks/cta-action-items';
import { SlaTiers } from '../blocks/sla-tiers';
import { SlaComparison } from '../blocks/sla-comparison';
import { GuaranteesGrid } from '../blocks/guarantees-grid';
import { LegalTermsTable } from '../blocks/legal-terms-table';
import { LegalSections } from '../blocks/legal-sections';
import { LegalSignature } from '../blocks/legal-signature';
import { TrustCredentials } from '../blocks/trust-credentials';
import { TrustSocialProof } from '../blocks/trust-social-proof';
import { HeroSplit } from '../blocks/hero-split';
import { HeroCentered } from '../blocks/hero-centered';

const mockClient: Client = {
  name: 'Test Client',
  logo: '/logos/test.svg',
  colors: { primary: '#1a73e8', accent: '#34a853' },
};

describe('Block Components', () => {
  describe('Utility Components', () => {
    describe('DataTableStandard', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Test Table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'value', label: 'Value' },
          ],
          rows: [
            { name: 'Item 1', value: '100' },
            { name: 'Item 2', value: '200' },
          ],
        };

        render(<DataTableStandard data={data} client={mockClient} />);

        expect(screen.getByText('Test Table')).toBeInTheDocument();
        expect(screen.getAllByText('Name')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Value')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
        expect(screen.getAllByText('100')[0]).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { columns: [], rows: [] };
        const { container } = render(<DataTableStandard data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('DataTableComparison', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Comparison Table',
          columns: [
            { key: 'feature', label: 'Feature' },
            { key: 'basic', label: 'Basic' },
            { key: 'pro', label: 'Pro' },
          ],
          rows: [
            { feature: 'Users', basic: '5', pro: '50' },
          ],
          recommendedColumn: 'pro',
        };

        render(<DataTableComparison data={data} client={mockClient} />);

        expect(screen.getByText('Comparison Table')).toBeInTheDocument();
        expect(screen.getAllByText('Feature')[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Recommended/)[0]).toBeInTheDocument();
        expect(screen.getAllByText('Users')[0]).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { columns: [], rows: [] };
        const { container } = render(<DataTableComparison data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('ChecklistTable', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Compliance Checklist',
          items: [
            { item: 'Security Review', status: 'compliant' },
            { item: 'Data Privacy', status: 'partial' },
          ],
        };

        render(<ChecklistTable data={data} client={mockClient} />);

        expect(screen.getByText('Compliance Checklist')).toBeInTheDocument();
        expect(screen.getByText('Security Review')).toBeInTheDocument();
        expect(screen.getByText('Compliant')).toBeInTheDocument();
        expect(screen.getByText('Partial')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { items: [] };
        const { container } = render(<ChecklistTable data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('KPIs/Metrics Components', () => {
    describe('MetricsGrid', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Key Metrics',
          metrics: [
            { label: 'Revenue', value: '$1M', trend: 'up' },
            { label: 'Users', value: '10,000', trend: 'down' },
          ],
        };

        render(<MetricsGrid data={data} client={mockClient} />);

        expect(screen.getByText('Key Metrics')).toBeInTheDocument();
        expect(screen.getByText('Revenue')).toBeInTheDocument();
        expect(screen.getByText('$1M')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { metrics: [] };
        const { container } = render(<MetricsGrid data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('KpiDashboard', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'KPI Dashboard',
          categories: [
            {
              name: 'Performance',
              kpis: [
                { metric: 'Uptime', target: '99.9%', measurement: 'Monthly' },
              ],
            },
          ],
        };

        render(<KpiDashboard data={data} client={mockClient} />);

        expect(screen.getByText('KPI Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Performance')).toBeInTheDocument();
        expect(screen.getByText('Uptime')).toBeInTheDocument();
        expect(screen.getByText('99.9%')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { categories: [] };
        const { container } = render(<KpiDashboard data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

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
        expect(screen.getAllByText('Response Time')[0]).toBeInTheDocument();
        expect(screen.getAllByText('2s')[0]).toBeInTheDocument();
        expect(screen.getAllByText('0.5s')[0]).toBeInTheDocument();
        expect(screen.getAllByText('75%')[0]).toBeInTheDocument();
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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
      });
    });

    describe('SecurityControls', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Security Controls',
          controls: [
            { category: 'Access Control', items: ['MFA', 'SSO'] },
          ],
        };

        render(<SecurityControls data={data} client={mockClient} />);

        expect(screen.getByText('Security Controls')).toBeInTheDocument();
        expect(screen.getByText('Access Control')).toBeInTheDocument();
        expect(screen.getByText('MFA')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { controls: [] };
        const { container } = render(<SecurityControls data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('ComplianceMatrix', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Compliance Matrix',
          standards: [
            {
              name: 'GDPR',
              requirements: [
                { requirement: 'Data encryption', status: 'compliant' },
              ],
            },
          ],
        };

        render(<ComplianceMatrix data={data} client={mockClient} />);

        expect(screen.getByText('Compliance Matrix')).toBeInTheDocument();
        expect(screen.getByText('GDPR')).toBeInTheDocument();
        expect(screen.getByText('Data encryption')).toBeInTheDocument();
        expect(screen.getByText('Compliant')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { standards: [] };
        const { container } = render(<ComplianceMatrix data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('Risk Components', () => {
    describe('RiskMatrix', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Risk Assessment',
          risks: [
            {
              risk: 'Data breach',
              probability: 'low',
              impact: 'high',
              mitigation: 'Encryption',
            },
          ],
        };

        render(<RiskMatrix data={data} client={mockClient} />);

        expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
        expect(screen.getByText('Data breach')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('Encryption')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { risks: [] };
        const { container } = render(<RiskMatrix data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('RiskHeatmap', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Risk Heatmap',
          risks: [
            { id: 'R1', probability: 3, impact: 4, label: 'System failure' },
          ],
        };

        render(<RiskHeatmap data={data} client={mockClient} />);

        expect(screen.getByText('Risk Heatmap')).toBeInTheDocument();
        expect(screen.getByText('R1')).toBeInTheDocument();
        expect(screen.getByText('System failure')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { risks: [] };
        const { container } = render(<RiskHeatmap data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
      });
    });

    describe('ExecutiveSummaryTimeline', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Project Timeline',
          content: 'Timeline overview',
          milestones: [
            { label: 'Kickoff', date: '2024-01-01' },
            { label: 'Launch', date: '2024-06-01' },
          ],
        };

        render(<ExecutiveSummaryTimeline data={data} client={mockClient} />);

        expect(screen.getByText('Project Timeline')).toBeInTheDocument();
        expect(screen.getByText('Timeline overview')).toBeInTheDocument();
        expect(screen.getByText('Kickoff')).toBeInTheDocument();
        expect(screen.getByText('2024-01-01')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<ExecutiveSummaryTimeline data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
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
        expect(screen.getByText('Detail A')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { features: [] };
        const { container } = render(<FeaturesAccordion data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
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
        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Tab content here')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { tabs: [] };
        const { container } = render(<FeaturesTabs data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('Roadmap Components', () => {
    describe('TimelineTable', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Implementation Timeline',
          phases: [
            {
              week: '1-2',
              phase: 'Phase 1',
              milestone: 'Setup',
              deliverables: ['Item 1'],
              responsible: 'Team A',
            },
          ],
        };

        render(<TimelineTable data={data} client={mockClient} />);

        expect(screen.getByText('Implementation Timeline')).toBeInTheDocument();
        expect(screen.getByText('Phase 1')).toBeInTheDocument();
        expect(screen.getByText('Setup')).toBeInTheDocument();
        expect(screen.getByText('Team A')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { phases: [] };
        const { container } = render(<TimelineTable data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('TimelineGantt', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Gantt Chart',
          totalWeeks: 8,
          phases: [
            { name: 'Phase 1', startWeek: 1, endWeek: 4 },
          ],
        };

        render(<TimelineGantt data={data} client={mockClient} />);

        expect(screen.getByText('Gantt Chart')).toBeInTheDocument();
        expect(screen.getByText('Phase 1')).toBeInTheDocument();
        expect(screen.getByText('W1')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { phases: [] };
        const { container } = render(<TimelineGantt data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
      });
    });

    describe('SlaComparison', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Service Level Comparison',
          plans: [
            { name: 'Basic', features: { 'Support': '9-5' } },
            { name: 'Premium', features: { 'Support': '24/7' }, recommended: true },
          ],
          featureLabels: ['Support'],
        };

        render(<SlaComparison data={data} client={mockClient} />);

        expect(screen.getByText('Service Level Comparison')).toBeInTheDocument();
        expect(screen.getByText('Basic')).toBeInTheDocument();
        expect(screen.getByText('Premium')).toBeInTheDocument();
        expect(screen.getByText('Recommended')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { plans: [], featureLabels: [] };
        const { container } = render(<SlaComparison data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('GuaranteesGrid', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Our Guarantees',
          guarantees: [
            {
              title: 'Uptime Guarantee',
              commitment: 'We guarantee 99.9% uptime',
              remedy: 'Service credits',
            },
          ],
        };

        render(<GuaranteesGrid data={data} client={mockClient} />);

        expect(screen.getByText('Our Guarantees')).toBeInTheDocument();
        expect(screen.getByText('Uptime Guarantee')).toBeInTheDocument();
        expect(screen.getByText('We guarantee 99.9% uptime')).toBeInTheDocument();
        expect(screen.getByText('Service credits')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { guarantees: [] };
        const { container } = render(<GuaranteesGrid data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('Legal Components', () => {
    describe('LegalTermsTable', () => {
      it('renders with valid data', () => {
        const data = {
          sectionTitle: 'Terms and Definitions',
          categories: [
            {
              name: 'General Terms',
              terms: [
                { term: 'Service', description: 'The software platform' },
              ],
            },
          ],
        };

        render(<LegalTermsTable data={data} client={mockClient} />);

        expect(screen.getByText('Terms and Definitions')).toBeInTheDocument();
        expect(screen.getByText('General Terms')).toBeInTheDocument();
        expect(screen.getByText('Service')).toBeInTheDocument();
        expect(screen.getByText('The software platform')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = { categories: [] };
        const { container } = render(<LegalTermsTable data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
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
        expect(container.innerHTML).toBe('');
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
        expect(screen.getByText('"Great service!"')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('XYZ Inc')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<TrustSocialProof data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('Hero Components', () => {
    describe('HeroSplit', () => {
      it('renders with valid data', () => {
        const data = {
          title: 'Welcome to Our Solution',
          subtitle: 'The best platform for your needs',
        };

        render(<HeroSplit data={data} client={mockClient} />);

        expect(screen.getByText('Welcome to Our Solution')).toBeInTheDocument();
        expect(screen.getByText('The best platform for your needs')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<HeroSplit data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });

    describe('HeroCentered', () => {
      it('renders with valid data', () => {
        const data = {
          title: 'Transform Your Business',
          subtitle: 'With our innovative solution',
        };

        render(<HeroCentered data={data} client={mockClient} />);

        expect(screen.getByText('Transform Your Business')).toBeInTheDocument();
        expect(screen.getByText('With our innovative solution')).toBeInTheDocument();
      });

      it('returns null with empty data', () => {
        const data = {};
        const { container } = render(<HeroCentered data={data} client={mockClient} />);
        expect(container.innerHTML).toBe('');
      });
    });
  });
});
