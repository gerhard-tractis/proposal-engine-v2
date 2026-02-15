'use client';

import { Client } from "@repo/shared";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  role?: string;
}

interface Stat {
  value: string;
  label: string;
}

export function TrustSocialProof({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const testimonials = Array.isArray(data.testimonials)
    ? (data.testimonials as Testimonial[])
    : [];
  const clients = Array.isArray(data.clients)
    ? (data.clients as string[])
    : [];
  const stats = Array.isArray(data.stats) ? (data.stats as Stat[]) : [];

  if (testimonials.length === 0 && clients.length === 0 && stats.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
      className="py-12"
    >
      {sectionTitle && (
        <motion.h2
          variants={fadeInUp(0)}
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </motion.h2>
      )}

      {testimonials.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              {...hoverLift}
            >
              <Card className="h-full relative overflow-hidden">
                <CardContent className="pt-6">
                  {/* Large decorative quote mark */}
                  <div
                    className="absolute top-4 right-4 text-6xl font-serif leading-none opacity-10 select-none"
                    style={{ color: client.colors.primary }}
                  >
                    &ldquo;
                  </div>
                  <motion.div variants={scaleIn(0)}>
                    <MessageSquare
                      className="w-8 h-8 mb-4 opacity-20"
                      style={{ color: client.colors.primary }}
                    />
                  </motion.div>
                  <p className="text-foreground mb-4 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback
                        className="text-white text-sm font-bold"
                        style={{ backgroundColor: client.colors.accent }}
                      >
                        {testimonial.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {testimonial.author}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {testimonial.role ? `${testimonial.role}, ` : ""}
                        {testimonial.company}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {clients.length > 0 && (
        <motion.div
          variants={fadeInUp(0.2)}
          className="mb-12"
        >
          <h3 className="text-lg font-semibold text-foreground text-center mb-6">
            Trusted by Leading Organizations
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={defaultViewport}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            {clients.map((clientName, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {clientName}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {stats.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <motion.div
                    variants={scaleIn(0)}
                    className="text-3xl font-bold mb-2"
                    style={{ color: client.colors.primary }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
