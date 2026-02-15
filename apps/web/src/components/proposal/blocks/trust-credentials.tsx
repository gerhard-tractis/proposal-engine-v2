'use client';

import { Client } from "@repo/shared";
import { Award } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, hoverLift, defaultViewport } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  credentials?: string[];
  image?: string;
}

export function TrustCredentials({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const team = Array.isArray(data.team) ? (data.team as TeamMember[]) : [];

  if (team.length === 0) {
    return null;
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
          className="text-3xl font-bold mb-8"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </motion.h2>
      )}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {team.map((member, index) => {
          const credentials = Array.isArray(member.credentials)
            ? (member.credentials as string[])
            : [];

          return (
            <motion.div
              key={index}
              variants={staggerItem}
              {...hoverLift}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="w-24 h-24 mb-3">
                      {member.image ? (
                        <AvatarImage src={member.image} alt={member.name} />
                      ) : null}
                      <AvatarFallback
                        className="text-2xl font-bold text-white"
                        style={{ backgroundColor: client.colors.primary }}
                      >
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p
                      className="text-sm font-medium"
                      style={{ color: client.colors.accent }}
                    >
                      {member.role}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    {member.bio}
                  </p>

                  {credentials.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {credentials.map((credential, credIndex) => (
                        <motion.div key={credIndex} variants={scaleIn(credIndex * 0.05)}>
                          <Badge
                            className="text-white"
                            style={{ backgroundColor: client.colors.accent }}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {credential}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
