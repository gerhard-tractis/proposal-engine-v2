import { CheckCircle2 } from 'lucide-react';

interface UnderstandingNeedsProps {
  needs: string[];
}

export function UnderstandingNeeds({ needs }: UnderstandingNeedsProps) {
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
