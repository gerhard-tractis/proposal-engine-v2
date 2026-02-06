import type { PricingSection } from '@repo/shared';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  pricing: PricingSection;
}

export function PricingSection({ pricing }: PricingSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Investment
      </h2>

      {pricing.tiers && pricing.tiers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {pricing.tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-lg border p-8 space-y-6 ${
                tier.recommended
                  ? 'border-primary bg-card shadow-lg'
                  : 'border-border bg-card'
              }`}
            >
              {tier.recommended && (
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="text-2xl font-bold text-card-foreground">
                  {tier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-card-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground">/ {tier.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {pricing.customNote && (
        <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
          {pricing.customNote}
        </p>
      )}
    </section>
  );
}
