import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function ExecutiveSummary({ data }: BlockComponentProps) {
  const content = (data.content as string) || '';
  if (!content) return null;
  return (
    <section className="space-y-4">
      <h2
        className="text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--brand-primary)' }}
      >
        Executive Summary
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">{content}</p>
    </section>
  );
}
