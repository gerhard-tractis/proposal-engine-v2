import { CheckCircle2 } from 'lucide-react';
import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function UnderstandingNeeds({ data }: BlockComponentProps) {
  const needs = Array.isArray(data.needs) ? (data.needs as string[]) : [];
  if (needs.length === 0) return null;
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Understanding Your Needs
      </h2>
      <ul className="space-y-4">
        {needs.map((need, index) => (
          <li key={index} className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
            <span className="text-lg text-muted-foreground">{need}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
