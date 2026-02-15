'use client';

import { Client } from "@repo/shared";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Metric {
  label: string;
  value: string;
  icon?: string;
}

export function ExecutiveSummaryMetrics({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const content = (data.content as string) || "";
  const metrics = Array.isArray(data.metrics)
    ? (data.metrics as Metric[])
    : [];
  const differentiators = Array.isArray(data.differentiators)
    ? (data.differentiators as string[])
    : [];

  if (!content && metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <motion.h2
          className="text-2xl font-bold text-foreground"
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0)}
        >
          {sectionTitle}
        </motion.h2>
      )}

      {content && (
        <motion.p
          className="text-foreground leading-relaxed"
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0.1)}
        >
          {content}
        </motion.p>
      )}

      {metrics.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
        >
          {metrics.map((metric, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card
                className="border-l-4"
                style={{ borderLeftColor: client.colors.primary }}
              >
                <CardContent className="p-4">
                  <Badge
                    variant="secondary"
                    className="text-2xl font-bold mb-1 px-0 bg-transparent hover:bg-transparent"
                    style={{ color: client.colors.primary }}
                  >
                    {metric.value}
                  </Badge>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {differentiators.length > 0 && (
        <motion.div
          className="mt-6"
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0.2)}
        >
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Key Differentiators
          </h3>
          <motion.ul
            className="space-y-2"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {differentiators.map((diff, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2"
                variants={staggerItem}
              >
                <motion.div variants={scaleIn()}>
                  <Check
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: client.colors.primary }}
                  />
                </motion.div>
                <span className="text-foreground">{diff}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </div>
  );
}
