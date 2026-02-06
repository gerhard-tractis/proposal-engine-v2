import type { Proposal } from '@/types/proposal';

/**
 * Proposal data storage
 *
 * Token generation: import { nanoid } from 'nanoid'; nanoid(10);
 *
 * IMPORTANT PRODUCTION NOTES:
 * - Logo files: Zod validates path format but does NOT check file existence at runtime
 *   → MANUALLY verify all logo files exist in public/logos/ before deployment
 *   → Current logo: /logos/tractis.svg (verified present)
 * - Icon names: Validated against VALID_ICON_NAMES whitelist in src/types/proposal.ts
 *   → Add new icon names to whitelist before using in proposals
 * - Performance: For 1000+ proposals, migrate to database (PostgreSQL, MongoDB)
 *   → Current in-memory approach is suitable for <100 proposals
 * - Data validation: All proposals validated with Zod at runtime in proposal-helpers.ts
 */
export const proposals: Proposal[] = [
  {
    slug: 'tractis-demo',
    token: 'xK8pQ2mN7v', // Generated via nanoid(10)
    client: {
      name: 'Tractis AI',
      logo: '/logos/tractis-color.svg',
      colors: {
        primary: '#e6c15c', // Tractis Gold
        accent: '#5e6b7b', // Tractis Slate
      },
    },
    proposal: {
      executiveSummary:
        "We're proposing a custom AI solution tailored to your business needs. This platform will automate key workflows, enhance decision-making with intelligent insights, and scale seamlessly as your organization grows. Our approach combines cutting-edge AI technology with practical implementation strategies to deliver measurable ROI within the first quarter.",
      needs: [
        'Automate repetitive manual processes that consume 20+ hours per week',
        'Improve decision-making with data-driven insights and predictive analytics',
        'Scale operations without proportional increases in headcount',
        'Integrate AI capabilities with existing tools and workflows',
        'Maintain data security and compliance throughout the AI implementation',
      ],
      solution:
        "We'll build a custom AI platform that integrates directly with your existing systems. The solution includes natural language processing for document automation, predictive analytics for forecasting, and intelligent workflows that adapt to your team's patterns. Everything is deployed on secure infrastructure with full audit trails and compliance controls.",
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
      whyUs: [
        'Track record of delivering AI projects that generate 3-5x ROI within 6 months',
        'Deep expertise in LLMs, machine learning, and production AI systems',
        'Pragmatic approach focused on business outcomes, not just technology',
        'End-to-end capability from strategy through implementation and support',
        'Transparent communication with regular updates and demos throughout the project',
      ],
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
      contact: {
        name: 'Gerhard Neumann',
        email: 'gerhard@tractis.ai',
        phone: '+1 (555) 123-4567',
        calendlyUrl: 'https://calendly.com/tractis/demo',
        nextSteps: [
          'Schedule a 30-minute discovery call to discuss your specific needs',
          'Review technical architecture and integration requirements',
          'Finalize scope, timeline, and pricing',
          'Kick off project with a planning workshop',
        ],
      },
    },
  },
];
