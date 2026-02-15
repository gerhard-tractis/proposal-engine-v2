'use client';

import { Client } from "@repo/shared";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Feature {
  id: string;
  title: string;
  details: string[];
}

export function FeaturesAccordion({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const features = Array.isArray(data.features)
    ? (data.features as Feature[])
    : [];

  if (features.length === 0) {
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

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
      >
        <Accordion type="single" collapsible defaultValue="item-0">
          {features.map((feature, index) => (
            <motion.div key={index} variants={staggerItem}>
              <AccordionItem
                value={`item-${index}`}
                className="border-l-4 rounded-lg bg-card shadow-sm mb-3 border-b-0"
                style={{ borderLeftColor: client.colors.accent }}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4">
                    <motion.span
                      className="px-3 py-1 rounded-md text-sm font-semibold text-white flex-shrink-0"
                      style={{ backgroundColor: client.colors.primary }}
                      variants={scaleIn()}
                    >
                      {feature.id}
                    </motion.span>
                    <span className="text-lg font-bold text-foreground text-left">
                      {feature.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {Array.isArray(feature.details) && feature.details.length > 0 && (
                    <ul className="space-y-2 ml-16">
                      {feature.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-2"
                        >
                          <Check
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: client.colors.primary }}
                          />
                          <span className="text-foreground text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
