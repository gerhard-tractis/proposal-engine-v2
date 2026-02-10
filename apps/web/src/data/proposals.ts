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
 * - Icon names: Validated against VALID_ICON_NAMES whitelist in src/types/proposal.ts
 *   → Add new icon names to whitelist before using in proposals
 * - Performance: For 1000+ proposals, migrate to database (PostgreSQL, MongoDB)
 *   → Current in-memory approach is suitable for <100 proposals
 * - Data validation: All proposals validated with Zod at runtime in proposal-helpers.ts
 * - Fixed sections: Why Us and Contact sections use TRACTIS_WHY_US and TRACTIS_CONTACT
 *   → These are consistent across all proposals and don't need AI processing
 */
export const proposals: Proposal[] = [
  {
    slug: 'imperial',
    token: 'Zh3zaPJV4U', // Generated via nanoid(10)
    client: {
      name: 'Imperial',
      logo: '/logos/imperial-logo.png',
      favicon: '/logos/imperial-favicon.jpg',
      colors: {
        primary: '#f72e3c', // Imperial Red (Dembrandt extracted)
        accent: '#85909e', // Blue-Gray (Dembrandt extracted)
      },
    },
    proposal: {
      executiveSummary:
        'Elimine la dependencia de un solo proveedor TMS y agregue cualquier transportista a su red en 48 horas. Middleware agnóstico que traduce automáticamente entre cualquier sistema (Beetrack, Driv.in, Simpliroute, Excel) y su TMS actual.',
      needs: [
        'Dependes de un solo proveedor TMS - si suben precios o cambian condiciones, tu operación está en riesgo',
        'No puedes agregar transportistas que usan Beetrack, Driv.in o Excel - pierdes capacidad disponible',
        'Integrar un nuevo transporte toma 3-4 semanas - muy lento para escalar rápidamente',
        'Cambiar de TMS significa perder toda tu red de transportes configurada',
        'Cada transporte usa su propio sistema - visibilidad fragmentada y operación compleja',
        'La tecnología limita tu crecimiento - no puedes elegir transportes por calidad de servicio',
      ],
      solution:
        'Agrega cualquier transportista a tu red en 48 horas, sin importar qué sistema usen. Ellos trabajan con sus herramientas actuales, tú ves todo unificado en tu TMS. Sin capacitación, sin fricción.',
      features: [], // Not used in custom template
      roadmap: [], // Not used in custom template
      whyUs: ['Not used in custom template'], // Custom component has its own content
      pricing: {
        tiers: [
          {
            name: 'Modelo Recurrente',
            price: 'Setup + Licencia Mensual',
            period: 'Pay-per-use: Cobro mensual por orden procesada',
            features: [
              'Setup inicial de implementación (pago único)',
              'Licencia mensual por cada orden que pasa por el integrador',
              'Modelo pay-per-use: solo pagas por órdenes procesadas',
              'Escala según tu volumen real de operación',
              'Soporte continuo y actualizaciones incluidas',
              'Infraestructura y monitoreo 24/7',
            ],
            recommended: true,
          },
          {
            name: 'Modelo de Compra',
            price: 'Licencia Perpetua',
            period: 'Inversión única - todo incluido',
            features: [
              'Código fuente completo (llave en mano)',
              'Es tuyo para siempre - sin mensualidades',
              'Control total de tu infraestructura',
              'Documentación técnica completa',
              'Sin dependencia de terceros',
              'Ideal para equipos técnicos in-house',
            ],
          },
        ],
        customNote:
          '💬 Inversión personalizada según tu operación. Agenda 30 minutos y construimos la propuesta perfecta para ti.',
      },
      contact: {
        name: 'Gerhard Neumann',
        email: 'gerhard@tractis.ai',
        phone: '+56990210364',
        calendlyUrl: 'https://calendly.com/gerhard-tractis/30min',
        nextSteps: [
          'Agenda una demo de 30 minutos',
          'Discutimos tu operación y necesidades específicas',
          'Construimos una propuesta personalizada',
        ],
      },
    },
  },
  {
    slug: 'tractis-demo',
    token: 'xK8pQ2mN7v', // Generated via nanoid(10)
    client: {
      name: 'Tractis AI',
      logo: '/logos/tractis-color.svg',
      colors: {
        primary: '#dfad30', // Tractis Gold (Dembrandt extracted)
        accent: '#7b8b9d', // Tractis Border/Accent (Dembrandt extracted)
      },
    },
    proposal: {
      executiveSummary:
        "We're proposing a custom AI solution tailored to your business needs. This platform will automate key workflows, enhance decision-making with intelligent insights, and scale seamlessly as your organization grows.\n\nOur approach combines cutting-edge AI technology with practical implementation strategies to deliver measurable ROI within the first quarter.\n\nWith our proven track record and deep technical expertise, we'll transform your operations while ensuring seamless integration with your existing systems.",
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
      whyUs: [TRACTIS_WHY_US], // Fixed content - consistent across all proposals (wrapped in array for local schema)
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
      contact: TRACTIS_CONTACT, // Fixed content - consistent across all proposals
    },
  },
];
