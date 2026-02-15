'use client';

import { Client } from "@repo/shared";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface KpiTarget {
  metric: string;
  target: string | number;
  current?: string | number;
  timeline?: string;
  description?: string;
}

export function KpiTargets({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const targets = Array.isArray(data.targets)
    ? (data.targets as KpiTarget[])
    : [];

  if (targets.length === 0) {
    return null;
  }

  const calculateProgress = (current: string | number, target: string | number): number => {
    const currentNum = typeof current === "string" ? parseFloat(current) : current;
    const targetNum = typeof target === "string" ? parseFloat(target) : target;

    if (isNaN(currentNum) || isNaN(targetNum) || targetNum === 0) {
      return 0;
    }

    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
      className="py-12"
    >
      {sectionTitle && (
        <motion.h2
          variants={fadeInUp(0)}
          className="text-3xl font-bold mb-8"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </motion.h2>
      )}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {targets.map((target, index) => {
          const hasProgress =
            target.current !== undefined &&
            target.current !== null &&
            target.current !== "";
          const progress = hasProgress
            ? calculateProgress(target.current!, target.target)
            : 0;

          return (
            <motion.div
              key={index}
              variants={staggerItem}
              {...hoverLift}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <motion.div
                      variants={scaleIn(0)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${client.colors.primary}20` }}
                    >
                      <Target
                        className="w-6 h-6"
                        style={{ color: client.colors.primary }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {target.metric}
                      </h3>
                      {target.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {target.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className="text-3xl font-bold"
                        style={{ color: client.colors.primary }}
                      >
                        {target.target}
                      </span>
                      {hasProgress && (
                        <span className="text-sm text-muted-foreground">
                          (current: {target.current})
                        </span>
                      )}
                    </div>

                    {hasProgress && (
                      <Progress
                        value={progress}
                        className="h-2"
                        style={{ '--progress-color': client.colors.accent } as React.CSSProperties}
                      />
                    )}
                  </div>

                  {target.timeline && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Timeline:</span>
                      <span>{target.timeline}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
