import Image from 'next/image';
import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Stat {
  value: string;
  label: string;
}

export function HeroGradient({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || '';
  const subtitle = (data.subtitle as string) || '';
  const tagline = data.tagline as string | undefined;
  const stats = (data.stats as Stat[]) || [];

  if (!title) return null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        {/* Tractis Badge */}
        <div className="absolute bottom-3 left-2 sm:bottom-6 sm:left-6 bg-white/20 backdrop-blur-md px-2 py-1 sm:px-5 sm:py-3 rounded-md sm:rounded-xl border border-white/30 sm:border-2 shadow-lg">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[8px] sm:text-xs text-white font-semibold">Powered by</span>
            <Image
              src="/logos/tractis-white.svg"
              alt="Tractis"
              width={100}
              height={32}
              className="h-3 sm:h-6 w-auto"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center pt-6 sm:pt-8 px-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium max-w-4xl mx-auto" style={{ color: '#ffffff' }}>
            {subtitle}
          </p>
          {tagline && (
            <p className="text-sm sm:text-base md:text-lg mt-3 sm:mt-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {tagline}
            </p>
          )}
        </div>

        {/* Stats Bar */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto px-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
