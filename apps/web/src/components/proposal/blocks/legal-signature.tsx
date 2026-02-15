'use client';

import { Client } from '@repo/shared';
import { Calendar, Building2, User } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Party {
  role: string;
  company: string;
  name: string;
  title: string;
}

export function LegalSignature({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const parties = Array.isArray(data.parties) ? (data.parties as Party[]) : [];
  const date = (data.date as string) || '';
  const effectiveDate = (data.effectiveDate as string) || '';

  if (parties.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
      className="space-y-8"
    >
      {sectionTitle && (
        <motion.div variants={fadeInUp(0)}>
          <h2
            className="text-2xl font-bold text-foreground pb-4"
          >
            {sectionTitle}
          </h2>
          <Separator style={{ backgroundColor: client.colors.primary }} className="h-0.5" />
        </motion.div>
      )}

      <motion.div variants={fadeInUp(0.1)}>
        <Card className="bg-muted">
          <CardContent className="p-6">
            <p className="text-sm text-foreground leading-relaxed">
              IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date(s) set forth below.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {parties.map((party, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            {...hoverLift}
          >
            <Card
              className="border-2"
              style={{ borderColor: client.colors.primary }}
            >
              <CardHeader className="pb-4">
                <motion.div
                  variants={scaleIn(0)}
                  className="px-4 py-2 rounded-lg text-center font-semibold text-white"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  {party.role}
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    <Building2 className="w-4 h-4" />
                    Company
                  </div>
                  <div className="text-lg font-bold text-foreground">{party.company}</div>
                </div>

                {/* Signature Line */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Signature
                  </div>
                  <div className="border-b-2 border-foreground/30 h-12 mb-2 relative">
                    <div className="absolute bottom-0 left-0 right-0 text-xs text-muted-foreground italic">
                      Sign here
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Printed Name */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    <User className="w-4 h-4" />
                    Printed Name
                  </div>
                  <div className="text-base font-medium text-foreground">{party.name}</div>
                </div>

                {/* Title */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Title
                  </div>
                  <div className="text-base text-foreground">{party.title}</div>
                </div>

                {/* Date Line */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                  <div className="border-b-2 border-foreground/30 h-10 mb-2"></div>
                  {date && (
                    <div className="text-sm text-muted-foreground italic">{date}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {effectiveDate && (
        <motion.div variants={fadeInUp(0.2)}>
          <Card
            className="border-2 text-center"
            style={{ borderColor: client.colors.accent }}
          >
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Effective Date
              </div>
              <div className="text-xl font-bold" style={{ color: client.colors.primary }}>
                {effectiveDate}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This Agreement shall become effective as of the date above
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeInUp(0.3)}>
        <Separator />
        <p className="text-xs text-muted-foreground italic pt-4 text-center">
          Each party acknowledges that they have read and understood this Agreement and agree to be bound by its terms.
        </p>
      </motion.div>
    </motion.div>
  );
}
