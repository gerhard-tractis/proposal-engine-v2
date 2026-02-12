import { Client } from "@repo/shared";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

export function HeroCentered({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const tagline = (data.tagline as string) || "";
  const badges = Array.isArray(data.badges) ? (data.badges as string[]) : [];

  if (!title) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1
          className="text-6xl font-bold leading-tight"
          style={{ color: client.colors.primary }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}

        {tagline && (
          <p className="text-lg text-gray-600 italic max-w-2xl mx-auto">
            {tagline}
          </p>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center pt-6">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: client.colors.accent }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
