import Image from 'next/image';
import { Zap, Shield, Layers, TrendingUp, Check, ArrowRight, ArrowDown } from 'lucide-react';
import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface DiagramSystem {
  name: string;
  color: string;
  emoji: string;
}

interface DiagramCenter {
  name: string;
  subtitle: string;
}

interface DiagramRight {
  title: string;
  subtitle: string;
}

interface Benefit {
  iconName: string;
  title: string;
  points: string[];
}

interface TechStackCategory {
  name: string;
  technologies: string[];
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Zap, Shield, Layers, TrendingUp,
};

export function SolutionDiagram({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const sectionSubtitle = data.sectionSubtitle as string | undefined;
  const iconName = (data.iconName as string) || 'Layers';
  const diagram = data.diagram as { left: DiagramSystem[]; center: DiagramCenter; right: DiagramRight } | undefined;
  const benefits = Array.isArray(data.benefits) ? (data.benefits as Benefit[]) : [];
  const techStack = data.techStack as { categories: TechStackCategory[] } | undefined;

  const SectionIcon = ICON_MAP[iconName] || Layers;

  return (
    <section
      className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${client.colors.accent}08 0%, ${client.colors.primary}08 100%)`
      }}
    >
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        <div
          className="inline-block p-2 sm:p-3 rounded-full mb-3 sm:mb-4"
          style={{ backgroundColor: `${client.colors.accent}20` }}
        >
          <SectionIcon size={28} className="sm:w-8 sm:h-8" style={{ color: client.colors.accent }} />
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

      {/* Visual Diagram */}
      {diagram && (
        <div className="mb-10 sm:mb-12 md:mb-16 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 max-w-5xl mx-auto">

            {/* Left: Multiple TMS Systems */}
            <div className="flex-1 text-center">
              <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                Sistemas de Transportes
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {diagram.left.map((system, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 rounded-lg bg-white border-2 flex items-center justify-center gap-2 h-14 hover:shadow-md transition-shadow"
                    style={{ borderColor: system.color }}
                  >
                    <span className="text-xl">{system.emoji}</span>
                    <span className="text-sm font-bold" style={{ color: system.color }}>
                      {system.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <ArrowDown size={40} className="md:hidden" style={{ color: client.colors.primary }} />
              <ArrowRight size={40} className="hidden md:block" style={{ color: client.colors.primary }} />
            </div>

            {/* Center: Aureon Connect */}
            <div className="flex-1 text-center">
              <div
                className="px-6 py-8 rounded-xl border-2 shadow-lg relative"
                style={{
                  borderColor: client.colors.primary,
                  background: `linear-gradient(135deg, ${client.colors.primary}10 0%, ${client.colors.accent}10 100%)`
                }}
              >
                <Layers size={40} className="mx-auto mb-2" style={{ color: client.colors.primary }} />
                <div className="text-xl font-bold" style={{ color: client.colors.primary }}>
                  {diagram.center.name}
                </div>
                <div className="text-xs mt-1 mb-3" style={{ color: '#6B7280' }}>
                  {diagram.center.subtitle}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-[9px]" style={{ color: '#9CA3AF' }}>by</span>
                  <Image
                    src="/logos/tractis-color.svg"
                    alt="Tractis"
                    width={50}
                    height={16}
                    className="h-3 w-auto opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <ArrowDown size={40} className="md:hidden" style={{ color: client.colors.primary }} />
              <ArrowRight size={40} className="hidden md:block" style={{ color: client.colors.primary }} />
            </div>

            {/* Right: Client TMS */}
            <div className="flex-1 text-center">
              <div className="text-sm font-semibold mb-3" style={{ color: client.colors.accent }}>
                Tu TMS
              </div>
              <div
                className="px-6 py-6 rounded-xl shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
                }}
              >
                <div className="text-white font-bold text-lg">{diagram.right.title}</div>
                <div className="text-white/80 text-xs mt-2">{diagram.right.subtitle}</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="space-y-6 mb-12">
          {benefits.map((benefit, i) => {
            const BenefitIcon = ICON_MAP[benefit.iconName] || Zap;
            return (
              <div
                key={i}
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white border-l-4 hover:shadow-lg transition-shadow"
                style={{ borderLeftColor: client.colors.primary }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 p-2 sm:p-3 rounded-lg"
                    style={{ backgroundColor: `${client.colors.primary}15`, color: client.colors.primary }}
                  >
                    <BenefitIcon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: client.colors.primary }}>
                      {benefit.title}
                    </h3>
                    <ul className="space-y-2">
                      {benefit.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={18} className="flex-shrink-0 mt-0.5" style={{ color: client.colors.primary }} />
                          <span className="text-sm" style={{ color: '#374151' }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tech Badge */}
      {techStack && (
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src="/logos/tractis-color.svg"
              alt="Tractis"
              width={80}
              height={24}
              className="h-5 w-auto opacity-70"
            />
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Tecnología empresarial probada y escalable
          </p>
        </div>
      )}
    </section>
  );
}
