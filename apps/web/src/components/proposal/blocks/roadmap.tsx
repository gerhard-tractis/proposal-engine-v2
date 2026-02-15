'use client';

import type { RoadmapItem, Client } from '@repo/shared';
import { Calendar } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function Roadmap({ data }: BlockComponentProps) {
  const items = Array.isArray(data.items) ? (data.items as RoadmapItem[]) : [];
  if (items.length === 0) return null;

  return (
    <motion.section
      className="space-y-6"
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={fadeInUp(0)}
    >
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Project Roadmap
      </h2>
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
          >
            <motion.div
              variants={scaleIn()}
              className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background"
            />
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <motion.div variants={scaleIn()}>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.date}
                  </span>
                </div>
                <CardTitle className="text-xl">{item.phase}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
                {item.deliverables && item.deliverables.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Deliverables:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {item.deliverables.map((deliverable, i) => (
                        <li key={i}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
