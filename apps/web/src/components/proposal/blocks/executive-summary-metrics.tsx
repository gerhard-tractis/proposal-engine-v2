import { Client } from "@repo/shared";
import { Check } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Metric {
  label: string;
  value: string;
  icon?: string;
}

export function ExecutiveSummaryMetrics({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const content = (data.content as string) || "";
  const metrics = Array.isArray(data.metrics)
    ? (data.metrics as Metric[])
    : [];
  const differentiators = Array.isArray(data.differentiators)
    ? (data.differentiators as string[])
    : [];

  if (!content && metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {content && <p className="text-gray-700 leading-relaxed">{content}</p>}

      {metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm"
              style={{
                borderLeft: `4px solid ${client.colors.primary}`,
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: client.colors.primary }}
              >
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {differentiators.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Key Differentiators
          </h3>
          <ul className="space-y-2">
            {differentiators.map((diff, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  style={{ color: client.colors.primary }}
                />
                <span className="text-gray-700">{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
