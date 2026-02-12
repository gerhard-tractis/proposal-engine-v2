import { Client } from "@repo/shared";
import { Target } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface KpiTarget {
  metric: string;
  target: string | number;
  current?: string | number;
  timeline?: string;
  description?: string;
}

export function KpiTargets({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const targets = Array.isArray(data.targets)
    ? (data.targets as KpiTarget[])
    : [];

  if (targets.length === 0) {
    return null;
  }

  const calculateProgress = (current: string | number, target: string | number): number => {
    const currentNum = typeof current === "string" ? parseFloat(current) : current;
    const targetNum = typeof target === "string" ? parseFloat(target) : target;

    if (isNaN(currentNum) || isNaN(targetNum) || targetNum === 0) {
      return 0;
    }

    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <section className="py-12">
      {sectionTitle && (
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((target, index) => {
          const hasProgress =
            target.current !== undefined &&
            target.current !== null &&
            target.current !== "";
          const progress = hasProgress
            ? calculateProgress(target.current!, target.target)
            : 0;

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${client.colors.primary}20` }}
                >
                  <Target
                    className="w-6 h-6"
                    style={{ color: client.colors.primary }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {target.metric}
                  </h3>
                  {target.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {target.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: client.colors.primary }}
                  >
                    {target.target}
                  </span>
                  {hasProgress && (
                    <span className="text-sm text-gray-500">
                      (current: {target.current})
                    </span>
                  )}
                </div>

                {hasProgress && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: client.colors.accent,
                      }}
                    />
                  </div>
                )}
              </div>

              {target.timeline && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Timeline:</span>
                  <span>{target.timeline}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
