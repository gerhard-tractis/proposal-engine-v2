'use client';

import { Client } from "@repo/shared";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Capability {
  number: number;
  title: string;
  description: string;
}

interface ArchitectureComponent {
  component: string;
  technology: string;
  purpose: string;
}

export function SolutionCapabilities({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const content = (data.content as string) || "";
  const capabilities = Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [];
  const architecture = Array.isArray(data.architecture) ? (data.architecture as ArchitectureComponent[]) : [];

  if (!content && capabilities.length === 0) return null;

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

      {capabilities.length > 0 && (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
        >
          {capabilities.map((capability, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="border-l-4" style={{ borderLeftColor: client.colors.primary }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div variants={scaleIn()}>
                      <Badge
                        className="text-2xl font-bold px-3 py-1 text-white"
                        style={{ backgroundColor: client.colors.primary }}
                      >
                        {capability.number}
                      </Badge>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{capability.title}</h3>
                      <p className="text-foreground">{capability.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {architecture.length > 0 && (
        <motion.div
          className="mt-8"
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0.2)}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Technical Architecture</h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {architecture.map((item, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full border-t-2" style={{ borderTopColor: client.colors.primary }}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-foreground">{item.component}</p>
                    <Badge variant="secondary" className="text-xs">{item.technology}</Badge>
                    <p className="text-sm text-muted-foreground">{item.purpose}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
