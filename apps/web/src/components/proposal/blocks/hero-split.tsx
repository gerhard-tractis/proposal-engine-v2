import { Client } from "@repo/shared";
import Image from "next/image";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Stat {
  value: string;
  label: string;
}

export function HeroSplit({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const tagline = (data.tagline as string) || "";
  const imageSrc = (data.imageSrc as string) || "";
  const stats = Array.isArray(data.stats) ? (data.stats as Stat[]) : [];

  if (!title) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1
            className="text-5xl font-bold leading-tight"
            style={{ color: client.colors.primary }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-700 leading-relaxed">{subtitle}</p>
          )}
          {tagline && (
            <p className="text-lg text-gray-600 italic">{tagline}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          {imageSrc ? (
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className="w-full h-96 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${client.colors.primary}20 0%, ${client.colors.accent}20 100%)`,
              }}
            />
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: client.colors.primary }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
