import type { Feature, Client } from '@repo/shared';
import * as Icons from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

const SAFE_ICON_NAMES = new Set([
  'Zap', 'TrendingUp', 'Workflow', 'Plug', 'Shield', 'Brain',
  'CheckCircle', 'Star', 'Calendar', 'Mail', 'Phone', 'ArrowRight',
  'Check', 'CheckCircle2', 'Layers', 'ArrowDown',
]);

function isValidIconName(name: string): name is keyof typeof Icons {
  return SAFE_ICON_NAMES.has(name) && name in Icons;
}

export function FeaturesSection({ data }: BlockComponentProps) {
  const features = Array.isArray(data.features) ? (data.features as Feature[]) : [];
  if (features.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Key Features
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const IconComponent = feature.icon && isValidIconName(feature.icon)
            ? (Icons[feature.icon] as React.ComponentType<{ className?: string }>)
            : null;

          return (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-6 space-y-3 hover:border-primary transition-colors"
            >
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-primary" />
              )}
              <h3 className="text-xl font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
