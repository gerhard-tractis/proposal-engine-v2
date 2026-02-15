'use client';

import type { Client } from '@repo/shared';
import { motion } from "framer-motion";
import { fadeInUp, defaultViewport } from "@/lib/animations";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function TitleHeader({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || '';
  const subtitle = data.subtitle as string | undefined;
  if (!title) return null;
  return (
    <motion.div
      className="text-center space-y-4 py-8 border-b-2"
      style={{ borderColor: client.colors.primary }}
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={fadeInUp(0)}
    >
      <motion.h1
        className="text-4xl font-bold tracking-tight"
        style={{ color: client.colors.primary }}
        variants={fadeInUp(0.1)}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-xl text-muted-foreground"
          variants={fadeInUp(0.2)}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
