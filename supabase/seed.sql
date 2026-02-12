-- Seed data for existing proposals
-- Data matches exactly what is in apps/web/src/data/proposals.ts

-- Imperial - Aureon Connect (customized proposal)
INSERT INTO proposals (slug, token, status, type, custom_component, client, proposal, published_at) VALUES (
  'imperial',
  'Zh3zaPJV4U',
  'published',
  'customized',
  'imperial-custom',
  '{
    "name": "Imperial",
    "logo": "/logos/imperial-logo.png",
    "favicon": "/logos/imperial-favicon.jpg",
    "colors": {
      "primary": "#f72e3c",
      "accent": "#0c3a63"
    }
  }'::jsonb,
  '{
    "executiveSummary": "Elimine la dependencia de un solo proveedor TMS y agregue cualquier transportista a su red en 48 horas. Middleware agnóstico que traduce automáticamente entre cualquier sistema (Beetrack, Driv.in, Simpliroute, Excel) y su TMS actual.",
    "executiveSummaryVariant": "detailed",
    "needs": [
      "Dependes de un solo proveedor TMS - si suben precios o cambian condiciones, tu operación está en riesgo",
      "No puedes agregar transportistas que usan Beetrack, Driv.in o Excel - pierdes capacidad disponible",
      "Integrar un nuevo transporte toma 3-4 semanas - muy lento para escalar rápidamente",
      "Cambiar de TMS significa perder toda tu red de transportes configurada",
      "Cada transporte usa su propio sistema - visibilidad fragmentada y operación compleja",
      "La tecnología limita tu crecimiento - no puedes elegir transportes por calidad de servicio"
    ],
    "needsVariant": "list",
    "solution": "Agrega cualquier transportista a tu red en 48 horas, sin importar qué sistema usen. Ellos trabajan con sus herramientas actuales, tú ves todo unificado en tu TMS. Sin capacitación, sin fricción.",
    "solutionVariant": "narrative",
    "techStack": {
      "categories": [
        { "name": "Middleware/API", "technologies": ["Node.js", "Express", "TypeScript", "REST/GraphQL", "WebSockets"] },
        { "name": "Integraciones", "technologies": ["Simpliroute API", "Beetrack API", "Driv.in API", "Custom Adapters"] },
        { "name": "Base de Datos", "technologies": ["PostgreSQL", "Redis Cache", "Event Sourcing"] },
        { "name": "Infraestructura", "technologies": ["Railway", "Docker", "CI/CD", "Monitoring 24/7"] },
        { "name": "Seguridad", "technologies": ["JWT Auth", "API Rate Limiting", "Encryption at Rest", "Audit Logs"] }
      ]
    },
    "features": [],
    "featuresVariant": "grid",
    "roadmap": [],
    "roadmapVariant": "timeline",
    "whyUs": "Custom component has its own content",
    "whyUsVariant": "list",
    "pricing": {
      "tiers": [
        {
          "name": "Modelo Recurrente",
          "price": "Setup + Licencia Mensual",
          "period": "Pay-per-use: Cobro mensual por orden procesada",
          "features": [
            "Setup inicial de implementación (pago único)",
            "Licencia mensual por cada orden que pasa por el integrador",
            "Modelo pay-per-use: solo pagas por órdenes procesadas",
            "Escala según tu volumen real de operación",
            "Soporte continuo y actualizaciones incluidas",
            "Infraestructura y monitoreo 24/7"
          ],
          "recommended": true
        },
        {
          "name": "Modelo de Compra",
          "price": "Licencia Perpetua",
          "period": "Inversión única - todo incluido",
          "features": [
            "Código fuente completo (llave en mano)",
            "Es tuyo para siempre - sin mensualidades",
            "Control total de tu infraestructura",
            "Documentación técnica completa",
            "Sin dependencia de terceros",
            "Ideal para equipos técnicos in-house"
          ]
        }
      ],
      "customNote": "💬 Inversión personalizada según tu operación. Agenda 30 minutos y construimos la propuesta perfecta para ti."
    },
    "pricingVariant": "tiers",
    "contact": {
      "name": "Gerhard Neumann",
      "role": "Solutions Architect",
      "email": "gerhard@tractis.ai",
      "phone": "+56990210364",
      "website": "https://tractis.ai",
      "linkedin": "https://linkedin.com/company/tractis",
      "calendly": "https://calendly.com/gerhard-tractis/30min",
      "cta": "Agendar Demo"
    },
    "contactVariant": "standard"
  }'::jsonb,
  '2025-01-15T00:00:00Z'
);

-- Tractis Demo (standard proposal with TRACTIS_WHY_US and TRACTIS_CONTACT inlined)
INSERT INTO proposals (slug, token, status, type, custom_component, client, proposal, published_at) VALUES (
  'tractis-demo',
  'xK8pQ2mN7v',
  'published',
  'standard',
  NULL,
  '{
    "name": "Tractis AI",
    "logo": "/logos/tractis-color.svg",
    "colors": {
      "primary": "#dfad30",
      "accent": "#7b8b9d"
    }
  }'::jsonb,
  '{
    "executiveSummary": "We''re proposing a custom AI solution tailored to your business needs. This platform will automate key workflows, enhance decision-making with intelligent insights, and scale seamlessly as your organization grows.\n\nOur approach combines cutting-edge AI technology with practical implementation strategies to deliver measurable ROI within the first quarter.\n\nWith our proven track record and deep technical expertise, we''ll transform your operations while ensuring seamless integration with your existing systems.",
    "executiveSummaryVariant": "detailed",
    "needs": [
      "Automate repetitive manual processes that consume 20+ hours per week",
      "Improve decision-making with data-driven insights and predictive analytics",
      "Scale operations without proportional increases in headcount",
      "Integrate AI capabilities with existing tools and workflows",
      "Maintain data security and compliance throughout the AI implementation"
    ],
    "needsVariant": "list",
    "solution": "We''ll build a custom AI platform that integrates directly with your existing systems. The solution includes natural language processing for document automation, predictive analytics for forecasting, and intelligent workflows that adapt to your team''s patterns. Everything is deployed on secure infrastructure with full audit trails and compliance controls.",
    "solutionVariant": "narrative",
    "businessCase": {
      "costSaving": {
        "value": "$250K annually",
        "breakdown": [
          "Current: 500 hours/month × $150/hour × 12 months = $900K/year",
          "After: 100 hours/month × $150/hour × 12 months = $180K/year",
          "Annual savings: $900K - $180K = $720K/year",
          "Conservative estimate (35%): $250K/year"
        ]
      },
      "additionalIncome": {
        "value": "$500K new revenue",
        "breakdown": [
          "Current capacity: 10 proposals/month",
          "New capacity: 30 proposals/month",
          "Additional deals: 20 proposals/month × 30% win rate = 6 deals",
          "Average deal: $7K × 12 months = $84K/year per deal",
          "New revenue: 6 deals × $84K = $504K/year"
        ]
      },
      "roi": {
        "value": "6 months",
        "breakdown": [
          "Total investment: $45K implementation + $30K (6mo support) = $75K",
          "Monthly benefit: $250K savings + $500K revenue = $750K/year",
          "Monthly benefit: $750K ÷ 12 = $62.5K/month",
          "Payback period: $75K ÷ $62.5K = 1.2 months (rounded to 6 months conservative)"
        ]
      },
      "metrics": [
        {
          "label": "Productivity Gain",
          "value": "3x increase",
          "breakdown": [
            "Current: 10 proposals/month per team",
            "After: 30 proposals/month per team",
            "Increase: 3x capacity"
          ]
        },
        {
          "label": "Time Saved",
          "value": "80% reduction",
          "breakdown": [
            "Current time per proposal: 6 hours",
            "After automation: 1.2 hours",
            "Time saved: 4.8 hours (80% reduction)"
          ]
        }
      ]
    },
    "techStack": {
      "categories": [
        { "name": "Frontend", "technologies": ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
        { "name": "Backend", "technologies": ["Node.js", "Express", "TypeScript"] },
        { "name": "AI/ML", "technologies": ["LangChain", "Groq", "Anthropic Claude"] },
        { "name": "Infrastructure", "technologies": ["Vercel", "Railway", "Docker"] },
        { "name": "Data & Security", "technologies": ["PostgreSQL", "Zod", "SOC 2 Compliant"] }
      ]
    },
    "features": [
      { "title": "Intelligent Automation", "description": "Automate document processing, data entry, and routine tasks using advanced NLP and computer vision.", "icon": "Zap" },
      { "title": "Predictive Analytics", "description": "Forecast trends, identify risks, and surface opportunities using machine learning models trained on your data.", "icon": "TrendingUp" },
      { "title": "Smart Workflows", "description": "Dynamic workflows that learn from your team and optimize processes over time.", "icon": "Workflow" },
      { "title": "Seamless Integration", "description": "Connect with your existing tools via APIs, webhooks, and native integrations.", "icon": "Plug" },
      { "title": "Enterprise Security", "description": "SOC 2 compliant infrastructure with encryption, access controls, and audit logs.", "icon": "Shield" },
      { "title": "Custom Training", "description": "Models fine-tuned on your domain-specific data for maximum accuracy and relevance.", "icon": "Brain" }
    ],
    "featuresVariant": "grid",
    "roadmap": [
      { "phase": "Discovery & Planning", "date": "Weeks 1-2", "description": "Deep dive into your workflows, data sources, and success metrics. Define technical architecture and integration points.", "deliverables": ["Technical specification document", "Data pipeline architecture", "Integration plan"] },
      { "phase": "MVP Development", "date": "Weeks 3-6", "description": "Build core features with initial AI models. Set up infrastructure, data pipelines, and basic workflows.", "deliverables": ["Functional MVP with 2-3 core features", "Initial model training", "Basic dashboard"] },
      { "phase": "Testing & Refinement", "date": "Weeks 7-8", "description": "User testing, model fine-tuning, and performance optimization. Gather feedback and iterate.", "deliverables": ["QA report", "Refined models", "User documentation"] },
      { "phase": "Launch & Training", "date": "Week 9", "description": "Deploy to production, conduct team training, and establish monitoring systems.", "deliverables": ["Production deployment", "Team training sessions", "Monitoring dashboard"] },
      { "phase": "Ongoing Support", "date": "Week 10+", "description": "Continuous model improvement, feature additions, and technical support.", "deliverables": ["Monthly performance reports", "Model retraining", "Feature updates"] }
    ],
    "roadmapVariant": "timeline",
    "whyUs": "## Why Tractis?\n\n**Deep AI + Logistics Expertise**\nWe''re not just AI developers - we''re logistics technology specialists who build intelligent systems for complex operational challenges. Our team combines expert AI engineering with deep domain knowledge in supply chain, last-mile delivery, and logistics operations.\n\n**World-Class Infrastructure**\nWe don''t just solve problems - we architect solutions that scale. Every system we build is designed with production-grade infrastructure that can handle whatever you throw at it. Reliability isn''t an afterthought; it''s foundational. Our DevOps practices ensure uptime, performance, and resilience from day one.\n\n**Security & Privacy First**\nYour data is your business. Our AI agents are built with strict data isolation - they only access information they''re authorized to see, never leaking data between customers or contexts. When you ask an agent a question, it retrieves answers exclusively from your designated knowledge base using RAG technology. We engineer privacy into every layer: secure data handling, encrypted storage, and compliance-ready architecture. Your sensitive information stays yours.\n\n**Proven Track Record Across Industries**\n\n🛒 **FMCG/CPG Sector**\n- **Route Optimizer**: Outperforms standard SaaS solutions by adapting to client-specific business rules and constraints. Delivers measurable cost savings through smarter routing.\n- **Transport Control Tower**: Proactive AI agents that monitor fleet operations in real-time, detect issues before they escalate, and provide intelligent recommendations to drivers and operations teams.\n\n📦 **E-commerce**\n- **WISMO Agents**: Keep customers informed automatically, handle rescheduling, and trigger reverse logistics - reducing support tickets and improving customer satisfaction without human intervention.\n\n🚚 **Last Mile Operations**\n- **Crossdock Operations SaaS**: Complete visibility and control over pickup, reception, distribution, and dispatch. Real-time business intelligence that enables data-driven decisions and operational excellence.\n\n**Our Three Pillars**\n\n1. **Problem Solving**: We focus on outcomes, not features. Every solution is designed to deliver measurable business value.\n\n2. **Rock-Solid Infrastructure**: Production-grade systems that scale, perform, and never let you down. Built to handle enterprise workloads from day one.\n\n3. **Security & Privacy**: Your data is isolated, encrypted, and protected. Our agents are designed to prevent information leakage and maintain strict data boundaries.\n\n**Why This Matters for You**\nThe same discipline that ensures delivery trucks stay on route, operations run 24/7, and sensitive logistics data stays secure now powers your proposal generation. We build systems that work, scale, protect your data, and deliver ROI.",
    "whyUsVariant": "list",
    "pricing": {
      "tiers": [
        {
          "name": "Implementation",
          "price": "$45,000",
          "period": "one-time",
          "features": [
            "9-week implementation timeline",
            "Custom AI model development",
            "Integration with existing systems",
            "Team training and documentation",
            "Launch support"
          ],
          "recommended": true
        },
        {
          "name": "Ongoing Support",
          "price": "$5,000",
          "period": "per month",
          "features": [
            "Model retraining and optimization",
            "Performance monitoring",
            "Feature updates",
            "Technical support (8/5 coverage)",
            "Monthly performance reports"
          ]
        }
      ],
      "customNote": "Pricing includes all development, infrastructure setup, and initial training. Monthly support is optional but recommended for continuous improvement."
    },
    "pricingVariant": "tiers",
    "contact": {
      "name": "Gerhard Neumann",
      "role": "Founder & CEO",
      "email": "gerhard@tractis.ai",
      "phone": "+56 990210364",
      "website": "https://tractis.ai",
      "linkedin": "https://linkedin.com/in/gneumannv",
      "calendly": "https://calendly.com/gerhard-tractis/30min",
      "cta": "Schedule a call to discuss how we can transform your proposal process"
    },
    "contactVariant": "standard"
  }'::jsonb,
  '2025-01-15T00:00:00Z'
);
