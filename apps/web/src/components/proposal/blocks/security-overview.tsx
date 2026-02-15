'use client';

import { Client } from '@repo/shared';
import { ShieldCheck } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Layer {
  layer: string;
  technology: string;
  description: string;
}

export function SecurityOverview({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const content = (data.content as string) || '';
  const badges = Array.isArray(data.badges) ? (data.badges as string[]) : [];
  const layers = Array.isArray(data.layers) ? (data.layers as Layer[]) : [];
  const certifications = Array.isArray(data.certifications) ? (data.certifications as string[]) : [];

  if (!content && badges.length === 0 && layers.length === 0 && certifications.length === 0) return null;

  return (
    <motion.div
      className="space-y-6"
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

      {content && (
        <motion.div className="prose prose-sm max-w-none text-muted-foreground" variants={fadeInUp(0.2)}>
          <p>{content}</p>
        </motion.div>
      )}

      {badges.length > 0 && (
        <motion.div className="space-y-2" variants={fadeInUp(0.3)}>
          <h4 className="text-lg font-semibold text-foreground">Compliance</h4>
          <motion.div
            className="flex flex-wrap gap-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {badges.map((badge, index) => (
              <motion.div key={index} variants={scaleIn(0)}>
                <Badge
                  className="px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  {badge}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {layers.length > 0 && (
        <motion.div className="space-y-2" variants={fadeInUp(0.4)}>
          <h4 className="text-lg font-semibold text-foreground">Security Layers</h4>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {layers.map((layer, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full border-t-2" style={{ borderTopColor: client.colors.primary }}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-foreground">{layer.layer}</p>
                    <Badge variant="secondary" className="text-xs">{layer.technology}</Badge>
                    <p className="text-sm text-muted-foreground">{layer.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {certifications.length > 0 && (
        <motion.div className="space-y-2" variants={fadeInUp(0.5)}>
          <h4 className="text-lg font-semibold text-foreground">Certifications</h4>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
          >
            {certifications.map((cert, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card
                  className="border-2 hover:shadow-md transition-shadow"
                  style={{ borderColor: client.colors.accent || client.colors.primary }}
                >
                  <CardContent className="p-4 text-center">
                    <motion.div variants={scaleIn(0)}>
                      <ShieldCheck className="w-8 h-8 mx-auto mb-2" style={{ color: client.colors.primary }} />
                    </motion.div>
                    <p className="text-sm font-medium text-foreground">{cert}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
