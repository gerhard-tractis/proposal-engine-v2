'use client';

import { Client } from '@repo/shared';
import { Mail, Phone } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface ActionItem {
  step: string | number;
  action: string;
  responsible: string;
  timeline: string;
}

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export function CtaActionItems({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const actionItems = Array.isArray(data.actionItems) ? (data.actionItems as ActionItem[]) : [];
  const contactData = data.contact as Contact | undefined;

  if (actionItems.length === 0 && !contactData) return null;

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
      className="space-y-8"
    >
      {sectionTitle && (
        <motion.h2 variants={fadeInUp(0)} className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </motion.h2>
      )}

      {actionItems.length > 0 && (
        <motion.div className="space-y-4" variants={staggerContainer} initial="initial" whileInView="animate" viewport={defaultViewport}>
          {actionItems.map((item, idx) => (
            <motion.div key={idx} variants={staggerItem}>
              <Card className="border-l-4" style={{ borderLeftColor: client.colors.primary }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <motion.div variants={scaleIn(0)}>
                      <Badge
                        className="text-lg font-bold px-3 py-1 text-white"
                        style={{ backgroundColor: client.colors.accent }}
                      >
                        {item.step}
                      </Badge>
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.action}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span>{item.responsible}</span>
                        <span>{item.timeline}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {contactData && (
        <motion.div variants={fadeInUp(0.2)} {...hoverLift}>
          <Card className="border-2" style={{ borderColor: client.colors.primary }}>
            <CardHeader>
              <CardTitle style={{ color: client.colors.primary }}>Your Point of Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-semibold text-lg">{contactData.name}</div>
                <div className="text-muted-foreground">{contactData.role}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <motion.div variants={scaleIn(0)}>
                    <Mail className="w-5 h-5 mr-3" style={{ color: client.colors.accent }} />
                  </motion.div>
                  <a href={`mailto:${contactData.email}`} className="hover:underline" style={{ color: client.colors.primary }}>
                    {contactData.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <motion.div variants={scaleIn(0.05)}>
                    <Phone className="w-5 h-5 mr-3" style={{ color: client.colors.accent }} />
                  </motion.div>
                  <a href={`tel:${contactData.phone}`} className="hover:underline" style={{ color: client.colors.primary }}>
                    {contactData.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
