import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function TitleHeader({ data }: BlockComponentProps) {
  const title = (data.title as string) || '';
  const subtitle = data.subtitle as string | undefined;
  if (!title) return null;
  return (
    <div className="text-center space-y-4 py-8 border-b-2" style={{ borderColor: 'var(--brand-primary)' }}>
      <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--brand-primary)' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
