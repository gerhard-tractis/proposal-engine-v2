import { Star } from 'lucide-react';

interface WhyUsProps {
  points: string[];
}

export function WhyUs({ points }: WhyUsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Why Choose Us
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex gap-3 rounded-lg border border-border bg-card p-4"
          >
            <Star className="h-6 w-6 flex-shrink-0 text-primary" />
            <p className="text-card-foreground">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
