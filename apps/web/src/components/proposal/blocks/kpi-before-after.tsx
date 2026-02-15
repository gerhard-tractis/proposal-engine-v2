'use client';

import { Client } from '@repo/shared';
import { TrendingUp } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Comparison {
  metric: string;
  before: string | number;
  after: string | number;
  improvement: string;
}

export function KpiBeforeAfter({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const comparisons = Array.isArray(data.comparisons) ? (data.comparisons as Comparison[]) : [];

  if (comparisons.length === 0) return null;

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={fadeInUp(0)}
    >
      {sectionTitle && (
        <motion.h3 className="text-2xl font-bold text-foreground" variants={fadeInUp(0.1)}>
          {sectionTitle}
        </motion.h3>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
      >
        {comparisons.map((comparison, index) => (
          <motion.div key={index} variants={staggerItem}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{comparison.metric}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Before</span>
                    <p className="text-lg font-semibold text-foreground mt-1">{String(comparison.before)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">After</span>
                    <p className="text-lg font-semibold mt-1" style={{ color: client.colors.primary }}>{String(comparison.after)}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Badge className="text-white" style={{ backgroundColor: client.colors.accent }}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {comparison.improvement}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
