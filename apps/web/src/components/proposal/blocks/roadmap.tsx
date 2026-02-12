import type { RoadmapItem, Client } from '@repo/shared';
import { Calendar } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function Roadmap({ data }: BlockComponentProps) {
  const items = Array.isArray(data.items) ? (data.items as RoadmapItem[]) : [];
  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Project Roadmap
      </h2>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
          >
            <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {item.date}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.phase}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
              {item.deliverables && item.deliverables.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Deliverables:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {item.deliverables.map((deliverable, i) => (
                      <li key={i}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
