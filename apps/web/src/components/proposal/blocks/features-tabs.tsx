'use client';

import { Client } from "@repo/shared";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Tab {
  label: string;
  content: string;
  features?: string[];
}

export function FeaturesTabs({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const tabs = Array.isArray(data.tabs) ? (data.tabs as Tab[]) : [];

  if (tabs.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
      className="space-y-6"
    >
      {sectionTitle && (
        <motion.h2
          variants={fadeInUp(0)}
          className="text-2xl font-bold text-foreground"
        >
          {sectionTitle}
        </motion.h2>
      )}

      <motion.div variants={fadeInUp(0.1)}>
        <Tabs defaultValue="tab-0">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={`tab-${index}`}
                className="relative rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                style={{
                  // @ts-expect-error CSS custom property for active state
                  '--trigger-active-color': client.colors.primary,
                }}
              >
                <span className="data-[state=active]:text-inherit">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab, index) => (
            <TabsContent
              key={index}
              value={`tab-${index}`}
              className="bg-card rounded-lg p-6 shadow-sm border-l-4 mt-4"
              style={{ borderLeftColor: client.colors.primary }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: client.colors.primary }}
              >
                {tab.label}
              </h3>
              <p className="text-foreground leading-relaxed">{tab.content}</p>

              {Array.isArray(tab.features) && tab.features.length > 0 && (
                <motion.ul
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="mt-4 space-y-2"
                >
                  {tab.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      variants={staggerItem}
                      className="flex items-start gap-2"
                    >
                      <motion.div variants={scaleIn(0)}>
                        <Check
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: client.colors.primary }}
                        />
                      </motion.div>
                      <span className="text-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
