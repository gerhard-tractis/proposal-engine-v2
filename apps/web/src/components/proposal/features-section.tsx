'use client';

import { motion } from 'framer-motion';
import type { Feature } from '@repo/shared';
import * as Icons from 'lucide-react';

interface FeaturesSectionProps {
  features: Feature[];
}

// Safe icon names whitelist (prevent prototype pollution)
const SAFE_ICON_NAMES = new Set([
  'Zap', 'TrendingUp', 'Workflow', 'Plug', 'Shield', 'Brain',
  'CheckCircle', 'Star', 'Calendar', 'Mail', 'Phone', 'ArrowRight',
  'Check', 'CheckCircle2'
]);

function isValidIconName(name: string): name is keyof typeof Icons {
  return SAFE_ICON_NAMES.has(name) && name in Icons;
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Key Features
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          // Safely get icon from lucide-react with validation
          const IconComponent = feature.icon && isValidIconName(feature.icon)
            ? (Icons[feature.icon] as React.ComponentType<{ className?: string }>)
            : null;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-6 space-y-3 hover:border-primary transition-colors"
            >
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-primary" />
              )}
              <h3 className="text-xl font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
