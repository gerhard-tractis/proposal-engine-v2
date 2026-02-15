'use client';

import { Client } from "@repo/shared";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface ProblemMetric {
  metric: string;
  currentValue: string;
  impact: string;
}

export function ProblemMetricsTable({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const metrics = Array.isArray(data.metrics) ? (data.metrics as ProblemMetric[]) : [];
  const problems = Array.isArray(data.problems) ? (data.problems as string[]) : [];

  if (metrics.length === 0 && problems.length === 0) return null;

  const getImpactVariant = (impact: string): "default" | "destructive" | "outline" | "secondary" => {
    const lowercaseImpact = impact.toLowerCase();
    if (lowercaseImpact.includes("high")) return "destructive";
    if (lowercaseImpact.includes("medium")) return "outline";
    return "secondary";
  };

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

      {metrics.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
        >
          {metrics.map((metric, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full border-l-4" style={{ borderLeftColor: client.colors.primary }}>
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.currentValue}</p>
                  <Badge variant={getImpactVariant(metric.impact)}>{metric.impact}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {problems.length > 0 && (
        <motion.div
          className="mt-6"
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0.2)}
        >
          <h3 className="text-lg font-semibold text-foreground mb-3">Key Problems</h3>
          <motion.ul
            className="space-y-2"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {problems.map((problem, index) => (
              <motion.li key={index} className="flex items-start gap-2" variants={staggerItem}>
                <motion.div variants={scaleIn()}>
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                </motion.div>
                <span className="text-foreground">{problem}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </div>
  );
}
