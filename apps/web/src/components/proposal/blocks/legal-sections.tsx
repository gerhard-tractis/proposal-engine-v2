'use client';

import { Client } from '@repo/shared';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Subsection {
  number: string;
  title: string;
  content: string;
}

interface Section {
  number: string;
  title: string;
  content: string;
  subsections?: Subsection[];
}

export function LegalSections({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const sections = Array.isArray(data.sections) ? (data.sections as Section[]) : [];

  if (sections.length === 0) {
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

      {sections.map((section, index) => {
        const subsections = Array.isArray(section.subsections) ? section.subsections : [];

        return (
          <motion.div key={index} variants={staggerItem}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <motion.div
                    variants={scaleIn(0)}
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: client.colors.primary }}
                  >
                    {section.number}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {section.title}
                    </h3>
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                </div>

                {subsections.length > 0 && (
                  <>
                    <Separator />
                    <div className="ml-11 space-y-4 border-l-2 border-border pl-6">
                      {subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="space-y-2">
                          <div className="flex items-baseline gap-3">
                            <span
                              className="flex-shrink-0 font-semibold text-sm"
                              style={{ color: client.colors.accent }}
                            >
                              {subsection.number}
                            </span>
                            <h4 className="font-semibold text-foreground">
                              {subsection.title}
                            </h4>
                          </div>
                          <div className="text-foreground leading-relaxed whitespace-pre-wrap pl-8">
                            {subsection.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      <motion.div variants={fadeInUp(0.2)}>
        <Separator />
        <p className="text-xs text-muted-foreground italic pt-6 text-center">
          This document constitutes a legally binding agreement. Please review carefully.
        </p>
      </motion.div>
    </motion.div>
  );
}
