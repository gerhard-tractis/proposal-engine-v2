import { Check } from 'lucide-react';
import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Tier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  recommended?: boolean;
}

export function PricingTiers({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const sectionSubtitle = data.sectionSubtitle as string | undefined;
  const tiers = Array.isArray(data.tiers) ? (data.tiers as Tier[]) : [];
  const customNote = data.customNote as string | undefined;

  if (tiers.length === 0) return null;

  return (
    <section
      className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${client.colors.primary}05 0%, ${client.colors.accent}05 100%)`
      }}
    >
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        {sectionTitle && (
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-4" style={{ color: client.colors.primary }}>
            {sectionTitle}
          </h2>
        )}
        {sectionSubtitle && (
          <p className="text-base sm:text-lg md:text-xl px-4" style={{ color: '#374151' }}>
            {sectionSubtitle}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 ${
              tier.recommended ? 'shadow-2xl' : 'shadow-lg'
            }`}
            style={{
              borderColor: tier.recommended ? client.colors.primary : '#e5e7eb',
              backgroundColor: tier.recommended ? `${client.colors.primary}05` : 'white'
            }}
          >
            {tier.recommended && (
              <div
                className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold text-white"
                style={{ backgroundColor: client.colors.primary }}
              >
                RECOMENDADO
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: client.colors.accent }}>
              {tier.name}
            </h3>

            <div className="mb-4 sm:mb-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: client.colors.primary }}>
                {tier.price}
              </div>
              {tier.period && (
                <div className="text-sm mt-1" style={{ color: '#4B5563' }}>{tier.period}</div>
              )}
            </div>

            <ul className="space-y-3">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3" style={{ color: '#374151' }}>
                  <Check size={20} style={{ color: client.colors.primary }} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {customNote && (
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-base sm:text-lg" style={{ color: '#374151' }}>{customNote}</p>
        </div>
      )}
    </section>
  );
}
