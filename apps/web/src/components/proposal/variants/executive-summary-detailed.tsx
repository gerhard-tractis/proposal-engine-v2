'use client';

import { motion } from 'framer-motion';
import { FileText, Target, Lightbulb } from 'lucide-react';

interface ExecutiveSummaryDetailedProps {
  content: string;
}

/**
 * Executive Summary - Detailed Variant
 *
 * This variant provides a more structured, visual presentation of the executive summary.
 * Best used when:
 * - The summary content is longer (200+ words)
 * - Multiple key points need emphasis
 * - Visual hierarchy improves comprehension
 */
export function ExecutiveSummaryDetailed({ content }: ExecutiveSummaryDetailedProps) {
  // Split content by paragraphs for structured display
  const paragraphs = content.split('\n').filter(p => p.trim());

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with icon */}
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}
        >
          <FileText
            className="w-6 h-6"
            style={{ color: 'var(--brand-primary)' }}
          />
        </div>
        <h2
          className="text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--brand-primary)' }}
        >
          Executive Summary
        </h2>
      </div>

      {/* Structured content with visual cards */}
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 rounded-lg border bg-card"
            style={{
              borderColor: 'var(--brand-primary)',
              borderLeftWidth: '4px'
            }}
          >
            <div className="flex gap-4">
              {/* Icon based on section position */}
              <div className="flex-shrink-0 mt-1">
                {index === 0 ? (
                  <Target className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <p className="text-lg leading-relaxed text-foreground">
                {paragraph}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optional: Add a call-to-action or key takeaway box */}
      <div
        className="p-4 rounded-lg text-sm"
        style={{
          backgroundColor: 'var(--brand-accent)',
          opacity: 0.1,
          borderLeft: '3px solid var(--brand-accent)'
        }}
      >
        <p className="font-medium" style={{ color: 'var(--brand-accent)' }}>
          💡 Key Insight: Our solution addresses your unique challenges with tailored AI capabilities
        </p>
      </div>
    </motion.section>
  );
}
