'use client';

import { Client } from '@repo/shared';
import { Check, DollarSign } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface SetupFee {
  item: string;
  cost: string | number;
  description?: string;
}

interface Tier {
  name: string;
  price: string | number;
  period: string;
  features: string[];
  recommended?: boolean;
}

interface AddOn {
  name: string;
  price: string | number;
  description: string;
}

interface RoiProjection {
  label: string;
  value: string | number;
  description?: string;
}

export function PricingDetailed({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const setupFees = Array.isArray(data.setupFees) ? (data.setupFees as SetupFee[]) : [];
  const tiers = Array.isArray(data.tiers) ? (data.tiers as Tier[]) : [];
  const addOns = Array.isArray(data.addOns) ? (data.addOns as AddOn[]) : [];
  const roiProjections = Array.isArray(data.roiProjections) ? (data.roiProjections as RoiProjection[]) : [];

  if (setupFees.length === 0 && tiers.length === 0 && addOns.length === 0 && roiProjections.length === 0) {
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
        <motion.h2 variants={fadeInUp(0)} className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </motion.h2>
      )}

      {setupFees.length > 0 && (
        <motion.div variants={fadeInUp(0.1)} className="space-y-4">
          <h3 className="text-2xl font-semibold pb-2 border-b-2" style={{ borderColor: client.colors.accent }}>Setup Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setupFees.map((fee, idx) => (
              <Card key={idx} className="border-l-4" style={{ borderLeftColor: client.colors.primary }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{fee.item}</p>
                      {fee.description && <p className="text-sm text-muted-foreground mt-1">{fee.description}</p>}
                    </div>
                    <Badge className="text-white shrink-0" style={{ backgroundColor: client.colors.primary }}>
                      {fee.cost}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {tiers.length > 0 && (
        <motion.div variants={fadeInUp(0.2)} className="space-y-4">
          <h3 className="text-2xl font-semibold pb-2 border-b-2" style={{ borderColor: client.colors.accent }}>Pricing Tiers</h3>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tiers.map((tier, idx) => (
              <motion.div key={idx} variants={staggerItem} {...hoverLift}>
                <Card
                  className="h-full relative"
                  style={{
                    borderColor: tier.recommended ? client.colors.primary : undefined,
                    borderWidth: tier.recommended ? '2px' : '1px',
                  }}
                >
                  {tier.recommended && (
                    <motion.div variants={scaleIn(0)} className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="text-white" style={{ backgroundColor: client.colors.accent }}>Recommended</Badge>
                    </motion.div>
                  )}
                  <CardHeader>
                    <CardTitle style={{ color: client.colors.primary }}>{tier.name}</CardTitle>
                    <div>
                      <span className="text-3xl font-bold" style={{ color: client.colors.primary }}>{tier.price}</span>
                      <span className="text-muted-foreground ml-2">/ {tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Array.isArray(tier.features) && tier.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: client.colors.accent }} />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {addOns.length > 0 && (
        <motion.div variants={fadeInUp(0.3)} className="space-y-4">
          <h3 className="text-2xl font-semibold pb-2 border-b-2" style={{ borderColor: client.colors.accent }}>Add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addOns.map((addOn, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{addOn.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 font-semibold" style={{ color: client.colors.primary, borderColor: client.colors.primary }}>
                      {addOn.price}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {roiProjections.length > 0 && (
        <motion.div variants={fadeInUp(0.4)} className="space-y-4">
          <h3 className="text-2xl font-semibold pb-2 border-b-2" style={{ borderColor: client.colors.accent }}>ROI Projections</h3>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {roiProjections.map((projection, idx) => (
              <motion.div key={idx} variants={staggerItem} {...hoverLift}>
                <Card style={{ borderColor: client.colors.primary }}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">{projection.label}</div>
                    <motion.div variants={scaleIn(0)} className="text-3xl font-bold mb-2" style={{ color: client.colors.accent }}>
                      {projection.value}
                    </motion.div>
                    {projection.description && <p className="text-sm text-muted-foreground">{projection.description}</p>}
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
