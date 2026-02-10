/**
 * Fixed sections that are consistent across all proposals
 * These don't need to be processed by AI agents
 */

import type { WhyUsVariant, ContactVariant } from '@repo/shared/types/proposal';

/**
 * Tractis Contact Information
 * Used in all proposals - never changes
 */
export const TRACTIS_CONTACT = {
  name: "Gerhard Neumann",
  role: "Founder & CEO",
  email: "gerhard@tractis.ai",
  phone: "+56 990210364",
  website: "https://tractis.ai",
  linkedin: "https://linkedin.com/in/gneumannv",
  calendly: null, // Add Calendly link when available
  cta: "Schedule a call to discuss how we can transform your proposal process"
} as const;

/**
 * Tractis Why Us Content
 * Highlights company expertise, infrastructure, and security
 */
export const TRACTIS_WHY_US = `## Why Tractis?

**Deep AI + Logistics Expertise**
We're not just AI developers - we're logistics technology specialists who build intelligent systems for complex operational challenges. Our team combines expert AI engineering with deep domain knowledge in supply chain, last-mile delivery, and logistics operations.

**World-Class Infrastructure**
We don't just solve problems - we architect solutions that scale. Every system we build is designed with production-grade infrastructure that can handle whatever you throw at it. Reliability isn't an afterthought; it's foundational. Our DevOps practices ensure uptime, performance, and resilience from day one.

**Security & Privacy First**
Your data is your business. Our AI agents are built with strict data isolation - they only access information they're authorized to see, never leaking data between customers or contexts. When you ask an agent a question, it retrieves answers exclusively from your designated knowledge base using RAG technology. We engineer privacy into every layer: secure data handling, encrypted storage, and compliance-ready architecture. Your sensitive information stays yours.

**Proven Track Record Across Industries**

🛒 **FMCG/CPG Sector**
- **Route Optimizer**: Outperforms standard SaaS solutions by adapting to client-specific business rules and constraints. Delivers measurable cost savings through smarter routing.
- **Transport Control Tower**: Proactive AI agents that monitor fleet operations in real-time, detect issues before they escalate, and provide intelligent recommendations to drivers and operations teams.

📦 **E-commerce**
- **WISMO Agents**: Keep customers informed automatically, handle rescheduling, and trigger reverse logistics - reducing support tickets and improving customer satisfaction without human intervention.

🚚 **Last Mile Operations**
- **Crossdock Operations SaaS**: Complete visibility and control over pickup, reception, distribution, and dispatch. Real-time business intelligence that enables data-driven decisions and operational excellence.

**Our Three Pillars**

1. **Problem Solving**: We focus on outcomes, not features. Every solution is designed to deliver measurable business value.

2. **Rock-Solid Infrastructure**: Production-grade systems that scale, perform, and never let you down. Built to handle enterprise workloads from day one.

3. **Security & Privacy**: Your data is isolated, encrypted, and protected. Our agents are designed to prevent information leakage and maintain strict data boundaries.

**Why This Matters for You**
The same discipline that ensures delivery trucks stay on route, operations run 24/7, and sensitive logistics data stays secure now powers your proposal generation. We build systems that work, scale, protect your data, and deliver ROI.` as const;

/**
 * Default variants for fixed sections
 */
export const FIXED_SECTION_VARIANTS = {
  whyUs: 'list' as WhyUsVariant,
  contact: 'standard' as ContactVariant,
} as const;

/**
 * Helper to format contact section for proposal
 */
export function getContactSection() {
  const { name, role, email, phone, website, linkedin, calendly, cta } = TRACTIS_CONTACT;

  return `## Let's Get Started

**${name}**
${role}

📧 ${email}
📞 ${phone}
🌐 [${website}](${website})
💼 [LinkedIn](${linkedin})
${calendly ? `📅 [Schedule a Meeting](${calendly})` : ''}

${cta}`;
}
