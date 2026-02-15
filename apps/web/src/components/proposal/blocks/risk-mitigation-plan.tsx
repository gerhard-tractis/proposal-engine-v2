'use client';

import { Client } from '@repo/shared';
import { Check, Clock, User } from 'lucide-react';
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Action {
  action: string;
  owner: string;
  deadline: string;
  status: string;
}

interface RiskWithActions {
  risk: string;
  probability: string;
  impact: string;
  actions: Action[];
}

export function RiskMitigationPlan({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const risks = Array.isArray(data.risks) ? (data.risks as RiskWithActions[]) : [];

  if (risks.length === 0) return null;

  const getSeverityStyle = (severity: string): React.CSSProperties => {
    const normalized = severity.toLowerCase();
    switch (normalized) {
      case 'low':
        return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case 'medium':
        return { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fef08a' };
      case 'high':
        return { backgroundColor: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' };
      case 'critical':
        return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case 'complete':
      case 'completed':
        return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case 'in-progress':
      case 'in progress':
        return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
      case 'pending':
        return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
    }
  };

  const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <motion.h2
          className="text-2xl font-bold"
          style={{ color: client.colors.primary }}
          initial="initial"
          whileInView="animate"
          viewport={defaultViewport}
          variants={fadeInUp(0)}
        >
          {sectionTitle}
        </motion.h2>
      )}

      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={defaultViewport}
      >
        {risks.map((risk, riskIndex) => (
          <motion.div key={riskIndex} variants={staggerItem}>
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="border-b border-border bg-muted pb-4">
                <CardTitle className="text-lg mb-2" style={{ color: client.colors.primary }}>
                  {risk.risk}
                </CardTitle>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Probability:</span>
                    <Badge variant="outline" style={getSeverityStyle(risk.probability)}>
                      {formatText(risk.probability)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Impact:</span>
                    <Badge variant="outline" style={getSeverityStyle(risk.impact)}>
                      {formatText(risk.impact)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {Array.isArray(risk.actions) && risk.actions.length > 0 && (
                <CardContent className="p-4 space-y-3">
                  {risk.actions.map((action, actionIndex) => (
                    <div key={actionIndex}>
                      {actionIndex > 0 && <Separator className="my-3" />}
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: client.colors.accent }} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground font-medium">{action.action}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="w-3 h-3" /> {action.owner}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {action.deadline}
                            </span>
                            <Badge variant="outline" className="text-xs h-5" style={getStatusStyle(action.status)}>
                              {formatText(action.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
