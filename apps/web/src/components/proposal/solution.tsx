'use client';

import { motion } from 'framer-motion';
import type { BusinessCase, TechStack } from '@repo/shared';
import { TrendingUp, DollarSign, Zap, Code2 } from 'lucide-react';

interface SolutionProps {
  content: string;
  businessCase?: BusinessCase;
  techStack?: TechStack;
}

export function Solution({ content, businessCase, techStack }: SolutionProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Our Solution
      </h2>

      {/* Solution Description */}
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-lg leading-relaxed text-card-foreground">{content}</p>
      </div>

      {/* Business Case Metrics */}
      {businessCase && (businessCase.costSaving || businessCase.additionalIncome || businessCase.roi || businessCase.metrics) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Business Impact</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessCase.costSaving && (
              <div className="rounded-lg border-2 border-emerald-200 dark:border-emerald-900 bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Cost Savings</span>
                </div>
                <p className="text-3xl font-bold text-card-foreground">{businessCase.costSaving.value}</p>
                {businessCase.costSaving.breakdown && businessCase.costSaving.breakdown.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Calculation:</p>
                    {businessCase.costSaving.breakdown.map((step, index) => (
                      <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                        <span>{step}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {businessCase.additionalIncome && (
              <div className="rounded-lg border-2 border-blue-200 dark:border-blue-900 bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Additional Income</span>
                </div>
                <p className="text-3xl font-bold text-card-foreground">{businessCase.additionalIncome.value}</p>
                {businessCase.additionalIncome.breakdown && businessCase.additionalIncome.breakdown.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Calculation:</p>
                    {businessCase.additionalIncome.breakdown.map((step, index) => (
                      <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>{step}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {businessCase.roi && (
              <div className="rounded-lg border-2 border-purple-200 dark:border-purple-900 bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">ROI Timeline</span>
                </div>
                <p className="text-3xl font-bold text-card-foreground">{businessCase.roi.value}</p>
                {businessCase.roi.breakdown && businessCase.roi.breakdown.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Calculation:</p>
                    {businessCase.roi.breakdown.map((step, index) => (
                      <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                        <span>{step}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {businessCase.metrics && businessCase.metrics.map((metric, index) => (
              <div key={index} className="rounded-lg border-2 border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">{metric.label}</span>
                </div>
                <p className="text-3xl font-bold text-card-foreground">{metric.value}</p>
                {metric.breakdown && metric.breakdown.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Calculation:</p>
                    {metric.breakdown.map((step, stepIndex) => (
                      <p key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{step}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tech Stack */}
      {techStack && techStack.categories && techStack.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">Technology Stack</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techStack.categories.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
