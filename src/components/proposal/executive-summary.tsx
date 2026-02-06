'use client';

import { motion } from 'framer-motion';

interface ExecutiveSummaryProps {
  content: string;
}

export function ExecutiveSummary({ content }: ExecutiveSummaryProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Executive Summary
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">{content}</p>
    </motion.section>
  );
}
