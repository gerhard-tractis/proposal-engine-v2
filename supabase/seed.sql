-- Seed data for block-based proposals (V2)

-- Imperial - Aureon Connect
INSERT INTO proposals (slug, token, status, client, metadata, blocks, published_at) VALUES (
  'imperial',
  'Zh3zaPJV4U',
  'published',
  '{
    "name": "Imperial",
    "logo": "/logos/imperial-logo.png",
    "favicon": "/logos/imperial-favicon.jpg",
    "colors": {
      "primary": "#f72e3c",
      "accent": "#0c3a63",
      "background": "#485360",
      "foreground": "#ffffff",
      "card": "#3a4349",
      "cardForeground": "#ffffff",
      "muted": "#2d3238",
      "mutedForeground": "#b0b8c0",
      "border": "#5a6269"
    }
  }'::jsonb,
  '{
    "title": "Aureon Connect",
    "subtitle": "Propuesta Confidencial",
    "headerStyle": "standard",
    "maxWidth": "7xl"
  }'::jsonb,
  '[
    {
      "id": "imperial-hero",
      "component": "hero-gradient",
      "data": {
        "title": "Aureon Connect",
        "subtitle": "Integrador Universal de Última Milla",
        "tagline": "Para Ecommerce y Operadores Logísticos",
        "stats": [
          { "value": "48h", "label": "Integración" },
          { "value": "100%", "label": "Agnóstico" },
          { "value": "0", "label": "Vendor Lock-in" }
        ]
      }
    },
    {
      "id": "imperial-problem",
      "component": "executive-summary-metrics",
      "data": {
        "sectionTitle": "El Problema",
        "content": "Dependencia crítica de un solo proveedor TMS limita su red de transportes",
        "metrics": [
          { "label": "Tiempo de integración actual", "value": "3-4 semanas" },
          { "label": "Proveedores TMS soportados", "value": "1 solo" },
          { "label": "Riesgo de vendor lock-in", "value": "Crítico" }
        ],
        "differentiators": [
          "Dependes de un solo proveedor TMS - si suben precios o cambian condiciones, tu operación está en riesgo",
          "No puedes agregar transportistas que usan Beetrack, Driv.in o Excel - pierdes capacidad disponible",
          "Integrar un nuevo transporte toma 3-4 semanas - muy lento para escalar rápidamente",
          "Cambiar de TMS significa perder toda tu red de transportes configurada",
          "Cada transporte usa su propio sistema - visibilidad fragmentada y operación compleja",
          "La tecnología limita tu crecimiento - no puedes elegir transportes por calidad de servicio"
        ]
      }
    },
    {
      "id": "imperial-solution",
      "component": "solution-capabilities",
      "data": {
        "sectionTitle": "La Solución",
        "content": "Agrega cualquier transportista a tu red en 48 horas, sin importar qué sistema usen. Ellos trabajan con sus herramientas actuales, tú ves todo unificado en tu TMS. Sin capacitación, sin fricción.",
        "capabilities": [
          { "number": 1, "title": "Eliminar Fricción para Agregar Transportes", "description": "¿Encontraste un transportista que usa Beetrack? Lo agregamos en 48 horas. ¿Necesitas capacidad urgente y el transporte usa Excel? Lo configuramos igual. Sin capacitación, sin integración técnica compleja." },
          { "number": 2, "title": "Reducir Riesgo Operativo Crítico", "description": "Tu continuidad operativa ya no depende de un solo proveedor. Puedes migrar de TMS sin perder tu red de transportes. Mantén flexibilidad tecnológica sin sacrificar operación." },
          { "number": 3, "title": "Escalar Sin Límites Tecnológicos", "description": "Cada nuevo transporte que encuentres puede integrarse. La calidad del servicio es el único criterio de selección. Tu red crece según necesidades del negocio, no limitaciones técnicas." },
          { "number": 4, "title": "Visibilidad Unificada", "description": "Todos los transportes visibles en tu TMS actual. Formato estándar independiente del sistema origen. Trazabilidad completa sin importar heterogeneidad de proveedores." }
        ],
        "architecture": [
          { "component": "Middleware/API", "technology": "Node.js, Express, TypeScript", "purpose": "REST/GraphQL + WebSockets" },
          { "component": "Integraciones", "technology": "Simpliroute, Beetrack, Driv.in API", "purpose": "Custom Adapters" },
          { "component": "Base de Datos", "technology": "PostgreSQL, Redis Cache", "purpose": "Event Sourcing" },
          { "component": "Infraestructura", "technology": "Railway, Docker, CI/CD", "purpose": "Monitoring 24/7" },
          { "component": "Seguridad", "technology": "JWT Auth, API Rate Limiting", "purpose": "Encryption at Rest + Audit Logs" }
        ]
      }
    },
    {
      "id": "imperial-pricing",
      "component": "pricing-detailed",
      "data": {
        "sectionTitle": "Inversión",
        "tiers": [
          {
            "name": "Modelo Recurrente",
            "price": "Setup + Licencia Mensual",
            "period": "Pay-per-use",
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
            "period": "Inversión única",
            "features": [
              "Código fuente completo (llave en mano)",
              "Es tuyo para siempre - sin mensualidades",
              "Control total de tu infraestructura",
              "Documentación técnica completa",
              "Sin dependencia de terceros",
              "Ideal para equipos técnicos in-house"
            ]
          }
        ]
      }
    },
    {
      "id": "imperial-cta",
      "component": "cta-action-items",
      "data": {
        "sectionTitle": "¿Listo para eliminar el vendor lock-in?",
        "actionItems": [
          { "step": 1, "action": "Agenda una reunión de 30 minutos", "responsible": "Gerhard Neumann", "timeline": "Esta semana" },
          { "step": 2, "action": "Te mostramos cómo Aureon Connect integra tu red", "responsible": "Equipo Tractis", "timeline": "En la reunión" },
          { "step": 3, "action": "Integración completa de transportes", "responsible": "Equipo Tractis", "timeline": "48 horas" }
        ],
        "contact": {
          "name": "Gerhard Neumann",
          "role": "Founder & CEO",
          "email": "gerhard@tractis.ai",
          "phone": "+56990210364"
        }
      }
    },
    {
      "id": "imperial-footer",
      "component": "footer-branded",
      "data": {
        "poweredBy": {
          "name": "Tractis AI",
          "logo": "/logos/tractis-color.svg",
          "url": "https://tractis.ai"
        }
      }
    }
  ]'::jsonb,
  '2025-01-15T00:00:00Z'
);

-- Tractis Demo (standard proposal)
INSERT INTO proposals (slug, token, status, client, metadata, blocks, published_at) VALUES (
  'tractis-demo',
  'xK8pQ2mN7v',
  'published',
  '{
    "name": "Tractis AI",
    "logo": "/logos/tractis-color.svg",
    "colors": {
      "primary": "#dfad30",
      "accent": "#7b8b9d",
      "background": "#ffffff",
      "foreground": "#1a1a1a",
      "card": "#f8f9fa",
      "cardForeground": "#1a1a1a",
      "muted": "#f1f5f9",
      "mutedForeground": "#64748b",
      "border": "#e2e8f0"
    }
  }'::jsonb,
  '{
    "headerStyle": "standard",
    "maxWidth": "5xl"
  }'::jsonb,
  '[
    {
      "id": "demo-title",
      "component": "title-header",
      "data": {
        "title": "Custom AI Solution",
        "subtitle": "Tailored to Your Business Needs"
      }
    },
    {
      "id": "demo-exec-summary",
      "component": "executive-summary-metrics",
      "data": {
        "sectionTitle": "Executive Summary",
        "content": "We''re proposing a custom AI solution tailored to your business needs. This platform will automate key workflows, enhance decision-making with intelligent insights, and scale seamlessly as your organization grows.\n\nOur approach combines cutting-edge AI technology with practical implementation strategies to deliver measurable ROI within the first quarter.",
        "metrics": [
          { "label": "Productivity Gain", "value": "3x increase" },
          { "label": "Time Saved", "value": "80% reduction" },
          { "label": "ROI Timeline", "value": "6 months" }
        ],
        "differentiators": [
          "Automate repetitive manual processes that consume 20+ hours per week",
          "Improve decision-making with data-driven insights and predictive analytics",
          "Scale operations without proportional increases in headcount",
          "Integrate AI capabilities with existing tools and workflows",
          "Maintain data security and compliance throughout the AI implementation"
        ]
      }
    },
    {
      "id": "demo-solution",
      "component": "solution-capabilities",
      "data": {
        "sectionTitle": "Our Solution",
        "content": "We''ll build a custom AI platform that integrates directly with your existing systems. The solution includes natural language processing for document automation, predictive analytics for forecasting, and intelligent workflows that adapt to your team''s patterns.",
        "capabilities": [
          { "number": 1, "title": "Intelligent Automation", "description": "Automate document processing, data entry, and routine tasks using advanced NLP and computer vision." },
          { "number": 2, "title": "Predictive Analytics", "description": "Forecast trends, identify risks, and surface opportunities using machine learning models trained on your data." },
          { "number": 3, "title": "Smart Workflows", "description": "Dynamic workflows that learn from your team and optimize processes over time." },
          { "number": 4, "title": "Seamless Integration", "description": "Connect with your existing tools via APIs, webhooks, and native integrations." },
          { "number": 5, "title": "Enterprise Security", "description": "SOC 2 compliant infrastructure with encryption, access controls, and audit logs." },
          { "number": 6, "title": "Custom Training", "description": "Models fine-tuned on your domain-specific data for maximum accuracy and relevance." }
        ]
      }
    },
    {
      "id": "demo-roadmap",
      "component": "roadmap",
      "data": {
        "items": [
          { "phase": "Discovery & Planning", "date": "Weeks 1-2", "description": "Deep dive into your workflows, data sources, and success metrics. Define technical architecture and integration points.", "deliverables": ["Technical specification document", "Data pipeline architecture", "Integration plan"] },
          { "phase": "MVP Development", "date": "Weeks 3-6", "description": "Build core features with initial AI models. Set up infrastructure, data pipelines, and basic workflows.", "deliverables": ["Functional MVP with 2-3 core features", "Initial model training", "Basic dashboard"] },
          { "phase": "Testing & Refinement", "date": "Weeks 7-8", "description": "User testing, model fine-tuning, and performance optimization. Gather feedback and iterate.", "deliverables": ["QA report", "Refined models", "User documentation"] },
          { "phase": "Launch & Training", "date": "Week 9", "description": "Deploy to production, conduct team training, and establish monitoring systems.", "deliverables": ["Production deployment", "Team training sessions", "Monitoring dashboard"] },
          { "phase": "Ongoing Support", "date": "Week 10+", "description": "Continuous model improvement, feature additions, and technical support.", "deliverables": ["Monthly performance reports", "Model retraining", "Feature updates"] }
        ]
      }
    },
    {
      "id": "demo-why-us",
      "component": "why-us",
      "data": {
        "content": "## Why Tractis?\n\n**Deep AI + Logistics Expertise**\nWe''re not just AI developers - we''re logistics technology specialists who build intelligent systems for complex operational challenges. Our team combines expert AI engineering with deep domain knowledge in supply chain, last-mile delivery, and logistics operations.\n\n**World-Class Infrastructure**\nWe don''t just solve problems - we architect solutions that scale. Every system we build is designed with production-grade infrastructure that can handle whatever you throw at it. Reliability isn''t an afterthought; it''s foundational. Our DevOps practices ensure uptime, performance, and resilience from day one.\n\n**Security & Privacy First**\nYour data is your business. Our AI agents are built with strict data isolation - they only access information they''re authorized to see, never leaking data between customers or contexts. When you ask an agent a question, it retrieves answers exclusively from your designated knowledge base using RAG technology. We engineer privacy into every layer: secure data handling, encrypted storage, and compliance-ready architecture. Your sensitive information stays yours.\n\n**Proven Track Record Across Industries**\n\n🛒 **FMCG/CPG Sector**\n- **Route Optimizer**: Outperforms standard SaaS solutions by adapting to client-specific business rules and constraints. Delivers measurable cost savings through smarter routing.\n- **Transport Control Tower**: Proactive AI agents that monitor fleet operations in real-time, detect issues before they escalate, and provide intelligent recommendations to drivers and operations teams.\n\n📦 **E-commerce**\n- **WISMO Agents**: Keep customers informed automatically, handle rescheduling, and trigger reverse logistics - reducing support tickets and improving customer satisfaction without human intervention.\n\n🚚 **Last Mile Operations**\n- **Crossdock Operations SaaS**: Complete visibility and control over pickup, reception, distribution, and dispatch. Real-time business intelligence that enables data-driven decisions and operational excellence.\n\n**Our Three Pillars**\n\n1. **Problem Solving**: We focus on outcomes, not features. Every solution is designed to deliver measurable business value.\n\n2. **Rock-Solid Infrastructure**: Production-grade systems that scale, perform, and never let you down. Built to handle enterprise workloads from day one.\n\n3. **Security & Privacy**: Your data is isolated, encrypted, and protected. Our agents are designed to prevent information leakage and maintain strict data boundaries.\n\n**Why This Matters for You**\nThe same discipline that ensures delivery trucks stay on route, operations run 24/7, and sensitive logistics data stays secure now powers your proposal generation. We build systems that work, scale, protect your data, and deliver ROI."
      }
    },
    {
      "id": "demo-pricing",
      "component": "pricing-detailed",
      "data": {
        "sectionTitle": "Investment",
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
        ]
      }
    },
    {
      "id": "demo-contact",
      "component": "contact-section",
      "data": {
        "contact": {
          "name": "Gerhard Neumann",
          "role": "Founder & CEO",
          "email": "gerhard@tractis.ai",
          "phone": "+56 990210364",
          "website": "https://tractis.ai",
          "linkedin": "https://linkedin.com/in/gneumannv",
          "calendly": "https://calendly.com/gerhard-tractis/30min",
          "cta": "Schedule a call to discuss how we can transform your proposal process"
        }
      }
    }
  ]'::jsonb,
  '2025-01-15T00:00:00Z'
);
