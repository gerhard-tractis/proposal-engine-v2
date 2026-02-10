import type { Proposal } from '@repo/shared';
import { TRACTIS_WHY_US, TRACTIS_CONTACT, FIXED_SECTION_VARIANTS } from './fixed-sections';

/**
 * Proposal data storage
 *
 * Token generation: import { nanoid } from 'nanoid'; nanoid(10);
 *
 * IMPORTANT PRODUCTION NOTES:
 * - Logo files: Zod validates path format but does NOT check file existence at runtime
 *   → MANUALLY verify all logo files exist in public/logos/ before deployment
 *   → Current logo: /logos/tractis.svg (verified present)
 * - Icon names: Validated against VALID_ICON_NAMES whitelist in packages/shared/src/types/proposal.ts
 *   → Add new icon names to whitelist before using in proposals
 * - Performance: For 1000+ proposals, migrate to database (PostgreSQL, MongoDB)
 *   → Current in-memory approach is suitable for <100 proposals
 * - Data validation: All proposals validated with Zod at runtime in proposal-helpers.ts
 * - Fixed sections: Why Us and Contact sections use TRACTIS_WHY_US and TRACTIS_CONTACT
 *   → These are consistent across all proposals and don't need AI processing
 */
export const proposals: Proposal[] = [
  // CUSTOM PROPOSAL: Imperial - Uses custom component, minimal data
  {
    slug: 'imperial',
    token: 'Zh3zaPJV4U',
    type: 'customized',
    customComponent: 'imperial-custom',
    client: {
      name: 'Imperial',
      logo: '/logos/imperial-logo.png',
      favicon: '/logos/imperial-favicon.jpg',
      colors: {
        primary: '#f72e3c',
        accent: '#85909e',
      },
    },
    proposal: {
      executiveSummary: 'Elimine la dependencia de un solo proveedor TMS.',
      executiveSummaryVariant: 'brief',
      needs: ['Dummy data - custom component renders its own content'],
      needsVariant: 'list',
      solution: 'Agrega cualquier transportista a tu red en 48 horas.',
      solutionVariant: 'narrative',
      features: [],
      featuresVariant: 'grid',
      roadmap: [],
      roadmapVariant: 'timeline',
      whyUs: 'Custom component has its own content',
      whyUsVariant: 'list',
      pricing: {
        tiers: [],
      },
      pricingVariant: 'custom',
      contact: {
        name: 'Gerhard Neumann',
        role: 'Solutions Architect',
        email: 'gerhard@tractis.ai',
        phone: '+56990210364',
        website: 'https://tractis.ai',
        linkedin: 'https://linkedin.com/company/tractis',
        calendly: 'https://calendly.com/gerhard-tractis/30min',
        cta: 'Agendar Demo',
      },
      contactVariant: 'standard',
    },
  },

  // STANDARD 8-SECTION PROPOSAL: Tractis Demo - FULL FEATURES
  {
    slug: 'tractis-demo',
    token: 'xK8pQ2mN7v',
    type: 'standard',
    client: {
      name: 'Tractis AI',
      logo: '/logos/tractis-color.svg',
      colors: {
        primary: '#dfad30',
        accent: '#7b8b9d',
      },
    },
    proposal: {
      executiveSummary:
        "We're proposing a custom AI solution tailored to your business needs. This platform will automate key workflows, enhance decision-making with intelligent insights, and scale seamlessly as your organization grows.\n\nOur approach combines cutting-edge AI technology with practical implementation strategies to deliver measurable ROI within the first quarter.\n\nWith our proven track record and deep technical expertise, we'll transform your operations while ensuring seamless integration with your existing systems.",
      executiveSummaryVariant: 'detailed',
      needs: [
        'Automate repetitive manual processes that consume 20+ hours per week',
        'Improve decision-making with data-driven insights and predictive analytics',
        'Scale operations without proportional increases in headcount',
        'Integrate AI capabilities with existing tools and workflows',
        'Maintain data security and compliance throughout the AI implementation',
      ],
      needsVariant: 'list',
      solution:
        "We'll build a custom AI platform that integrates directly with your existing systems. The solution includes natural language processing for document automation, predictive analytics for forecasting, and intelligent workflows that adapt to your team's patterns. Everything is deployed on secure infrastructure with full audit trails and compliance controls.",
      solutionVariant: 'narrative',
      businessCase: {
        costSaving: {
          value: "$250K annually",
          breakdown: [
            "Current: 500 hours/month × $150/hour × 12 months = $900K/year",
            "After: 100 hours/month × $150/hour × 12 months = $180K/year",
            "Annual savings: $900K - $180K = $720K/year",
            "Conservative estimate (35%): $250K/year",
          ],
        },
        additionalIncome: {
          value: "$500K new revenue",
          breakdown: [
            "Current capacity: 10 proposals/month",
            "New capacity: 30 proposals/month",
            "Additional deals: 20 proposals/month × 30% win rate = 6 deals",
            "Average deal: $7K × 12 months = $84K/year per deal",
            "New revenue: 6 deals × $84K = $504K/year",
          ],
        },
        roi: {
          value: "6 months",
          breakdown: [
            "Total investment: $45K implementation + $30K (6mo support) = $75K",
            "Monthly benefit: $250K savings + $500K revenue = $750K/year",
            "Monthly benefit: $750K ÷ 12 = $62.5K/month",
            "Payback period: $75K ÷ $62.5K = 1.2 months (rounded to 6 months conservative)",
          ],
        },
        metrics: [
          {
            label: "Productivity Gain",
            value: "3x increase",
            breakdown: [
              "Current: 10 proposals/month per team",
              "After: 30 proposals/month per team",
              "Increase: 3x capacity",
            ],
          },
          {
            label: "Time Saved",
            value: "80% reduction",
            breakdown: [
              "Current time per proposal: 6 hours",
              "After automation: 1.2 hours",
              "Time saved: 4.8 hours (80% reduction)",
            ],
          },
        ],
      },
      techStack: {
        categories: [
          {
            name: "Frontend",
            technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
          },
          {
            name: "Backend",
            technologies: ["Node.js", "Express", "TypeScript"],
          },
          {
            name: "AI/ML",
            technologies: ["LangChain", "Groq", "Anthropic Claude"],
          },
          {
            name: "Infrastructure",
            technologies: ["Vercel", "Railway", "Docker"],
          },
          {
            name: "Data & Security",
            technologies: ["PostgreSQL", "Zod", "SOC 2 Compliant"],
          },
        ],
      },
      features: [
        {
          title: 'Intelligent Automation',
          description:
            'Automate document processing, data entry, and routine tasks using advanced NLP and computer vision.',
          icon: 'Zap',
        },
        {
          title: 'Predictive Analytics',
          description:
            'Forecast trends, identify risks, and surface opportunities using machine learning models trained on your data.',
          icon: 'TrendingUp',
        },
        {
          title: 'Smart Workflows',
          description:
            'Dynamic workflows that learn from your team and optimize processes over time.',
          icon: 'Workflow',
        },
        {
          title: 'Seamless Integration',
          description:
            'Connect with your existing tools via APIs, webhooks, and native integrations.',
          icon: 'Plug',
        },
        {
          title: 'Enterprise Security',
          description:
            'SOC 2 compliant infrastructure with encryption, access controls, and audit logs.',
          icon: 'Shield',
        },
        {
          title: 'Custom Training',
          description:
            'Models fine-tuned on your domain-specific data for maximum accuracy and relevance.',
          icon: 'Brain',
        },
      ],
      featuresVariant: 'grid',
      roadmap: [
        {
          phase: 'Discovery & Planning',
          date: 'Weeks 1-2',
          description:
            'Deep dive into your workflows, data sources, and success metrics. Define technical architecture and integration points.',
          deliverables: [
            'Technical specification document',
            'Data pipeline architecture',
            'Integration plan',
          ],
        },
        {
          phase: 'MVP Development',
          date: 'Weeks 3-6',
          description:
            'Build core features with initial AI models. Set up infrastructure, data pipelines, and basic workflows.',
          deliverables: [
            'Functional MVP with 2-3 core features',
            'Initial model training',
            'Basic dashboard',
          ],
        },
        {
          phase: 'Testing & Refinement',
          date: 'Weeks 7-8',
          description:
            'User testing, model fine-tuning, and performance optimization. Gather feedback and iterate.',
          deliverables: [
            'QA report',
            'Refined models',
            'User documentation',
          ],
        },
        {
          phase: 'Launch & Training',
          date: 'Week 9',
          description:
            'Deploy to production, conduct team training, and establish monitoring systems.',
          deliverables: [
            'Production deployment',
            'Team training sessions',
            'Monitoring dashboard',
          ],
        },
        {
          phase: 'Ongoing Support',
          date: 'Week 10+',
          description:
            'Continuous model improvement, feature additions, and technical support.',
          deliverables: [
            'Monthly performance reports',
            'Model retraining',
            'Feature updates',
          ],
        },
      ],
      roadmapVariant: 'timeline',
      whyUs: TRACTIS_WHY_US,
      whyUsVariant: FIXED_SECTION_VARIANTS.whyUs,
      pricing: {
        tiers: [
          {
            name: 'Implementation',
            price: '$45,000',
            period: 'one-time',
            features: [
              '9-week implementation timeline',
              'Custom AI model development',
              'Integration with existing systems',
              'Team training and documentation',
              'Launch support',
            ],
            recommended: true,
          },
          {
            name: 'Ongoing Support',
            price: '$5,000',
            period: 'per month',
            features: [
              'Model retraining and optimization',
              'Performance monitoring',
              'Feature updates',
              'Technical support (8/5 coverage)',
              'Monthly performance reports',
            ],
          },
        ],
        customNote:
          'Pricing includes all development, infrastructure setup, and initial training. Monthly support is optional but recommended for continuous improvement.',
      },
      pricingVariant: 'tiers',
      contact: TRACTIS_CONTACT,
      contactVariant: FIXED_SECTION_VARIANTS.contact,
    },
  },
];
