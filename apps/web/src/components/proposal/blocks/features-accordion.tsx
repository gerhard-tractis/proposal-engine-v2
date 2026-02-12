import { Client } from "@repo/shared";
import { Check } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Feature {
  id: string;
  title: string;
  details: string[];
}

export function FeaturesAccordion({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const features = Array.isArray(data.features)
    ? (data.features as Feature[])
    : [];

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border-l-4"
            style={{ borderLeftColor: client.colors.accent }}
          >
            <div className="flex items-start gap-4">
              <div
                className="px-3 py-1 rounded-md text-sm font-semibold text-white flex-shrink-0"
                style={{ backgroundColor: client.colors.primary }}
              >
                {feature.id}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                {Array.isArray(feature.details) && feature.details.length > 0 && (
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: client.colors.primary }}
                        />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
