'use client';

import type { ContactInfo, Client } from '@repo/shared';
import { Mail, Phone, Calendar, Globe, Linkedin } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, defaultViewport } from "@/lib/animations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function ContactSection({ data }: BlockComponentProps) {
  const contact = data.contact as ContactInfo | undefined;
  if (!contact) return null;

  return (
    <motion.section
      className="space-y-8 border-t border-border pt-12"
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={fadeInUp(0)}
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Let&apos;s Get Started
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {contact.cta}
        </p>
      </div>

      <motion.div variants={fadeInUp(0.2)} className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{contact.name}</CardTitle>
            <p className="text-muted-foreground">{contact.role}</p>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={defaultViewport}
            >
              <motion.div variants={staggerItem} className="flex items-center gap-3">
                <motion.div variants={scaleIn()}>
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <a href={`mailto:${contact.email}`} className="text-card-foreground hover:text-primary transition-colors">
                  {contact.email}
                </a>
              </motion.div>
              <motion.div variants={staggerItem} className="flex items-center gap-3">
                <motion.div variants={scaleIn()}>
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <a href={`tel:${contact.phone}`} className="text-card-foreground hover:text-primary transition-colors">
                  {contact.phone}
                </a>
              </motion.div>
              <motion.div variants={staggerItem} className="flex items-center gap-3">
                <motion.div variants={scaleIn()}>
                  <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-card-foreground hover:text-primary transition-colors">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              </motion.div>
              <motion.div variants={staggerItem} className="flex items-center gap-3">
                <motion.div variants={scaleIn()}>
                  <Linkedin className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-card-foreground hover:text-primary transition-colors">
                  LinkedIn Profile
                </a>
              </motion.div>
              {contact.calendly && (
                <motion.div variants={staggerItem} className="flex items-center gap-3">
                  <motion.div variants={scaleIn()}>
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  </motion.div>
                  <a href={contact.calendly} target="_blank" rel="noopener noreferrer" className="text-card-foreground hover:text-primary transition-colors">
                    Schedule a Meeting
                  </a>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
