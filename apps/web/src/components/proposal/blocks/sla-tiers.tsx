'use client';

import { Client } from '@repo/shared';
import { AlertCircle, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface PlatformSla {
  uptime: string;
  description: string;
}

interface Tier {
  severity: string;
  responseTime: string;
  resolutionTarget: string;
  channels: string;
}

export function SlaTiers({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const platformSla = (data.platformSla as PlatformSla) || { uptime: '', description: '' };
  const tiers = Array.isArray(data.tiers) ? (data.tiers as Tier[]) : [];
  const escalation = Array.isArray(data.escalation) ? (data.escalation as string[]) : [];

  if (!platformSla.uptime && tiers.length === 0) return null;

  const getSeverityVariant = (severity: string): "default" | "destructive" | "outline" | "secondary" => {
    const sev = severity.toLowerCase();
    if (sev.includes('p1') || sev.includes('critical')) return 'destructive';
    if (sev.includes('p2') || sev.includes('high')) return 'default';
    if (sev.includes('p3') || sev.includes('medium')) return 'outline';
    return 'secondary';
  };

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={fadeInUp(0)}
    >
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-foreground">{sectionTitle}</h2>
      )}

      {platformSla.uptime && (
        <motion.div variants={fadeInUp(0.2)}>
          <Card className="border-2" style={{ borderColor: client.colors.primary }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  variants={scaleIn()}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${client.colors.primary}15` }}
                >
                  <ShieldCheck className="w-6 h-6" style={{ color: client.colors.primary }} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Platform Uptime Guarantee</h3>
                  <div className="text-3xl font-bold mb-2" style={{ color: client.colors.primary }}>{platformSla.uptime}</div>
                  <p className="text-muted-foreground">{platformSla.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tiers.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
        >
          {tiers.map((tier, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityVariant(tier.severity)} className="gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {tier.severity}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Response:</span>
                      <span className="font-medium text-foreground">{tier.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="font-medium text-foreground">{tier.resolutionTarget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Channels:</span>
                      <span className="font-medium text-foreground">{tier.channels}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {escalation.length > 0 && (
        <motion.div variants={fadeInUp(0.4)}>
          <Card className="bg-muted">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Escalation Path</h3>
              <motion.ol
                className="space-y-2"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={defaultViewport}
              >
                {escalation.map((step, index) => (
                  <motion.li key={index} variants={staggerItem} className="flex gap-3">
                    <motion.span
                      variants={scaleIn()}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                      style={{ backgroundColor: client.colors.primary }}
                    >
                      {index + 1}
                    </motion.span>
                    <span className="text-foreground pt-0.5">{step}</span>
                  </motion.li>
                ))}
              </motion.ol>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
