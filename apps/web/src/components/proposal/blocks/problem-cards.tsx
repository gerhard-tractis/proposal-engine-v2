import { Zap } from 'lucide-react';
import type { Client } from '@repo/shared';
import * as Icons from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

const SAFE_ICON_NAMES = new Set(['Zap', 'Shield', 'Layers', 'TrendingUp', 'Check', 'ArrowRight', 'ArrowDown']);

function getIcon(name: string | undefined) {
  if (!name || !SAFE_ICON_NAMES.has(name) || !(name in Icons)) return Zap;
  return (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>)[name];
}

export function ProblemCards({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const sectionSubtitle = data.sectionSubtitle as string | undefined;
  const iconName = data.iconName as string | undefined;
  const items = Array.isArray(data.items) ? (data.items as string[]) : [];

  if (items.length === 0) return null;

  const IconComponent = getIcon(iconName);

  return (
    <section
      className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${client.colors.primary}08 0%, ${client.colors.accent}08 100%)`
      }}
    >
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        <div
          className="inline-block p-2 sm:p-3 rounded-full mb-3 sm:mb-4"
          style={{ backgroundColor: `${client.colors.primary}20` }}
        >
          <IconComponent size={28} className="sm:w-8 sm:h-8" style={{ color: client.colors.primary }} />
        </div>
        {sectionTitle && (
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-4" style={{ color: client.colors.primary }}>
            {sectionTitle}
          </h2>
        )}
        {sectionSubtitle && (
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: '#374151' }}>
            {sectionSubtitle}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-white"
              style={{ backgroundColor: client.colors.primary }}
            >
              {index + 1}
            </div>
            <p className="leading-relaxed" style={{ color: '#374151' }}>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
