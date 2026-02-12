import { Client } from "@repo/shared";
import { Check } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Tab {
  label: string;
  content: string;
  features?: string[];
}

export function FeaturesTabs({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const tabs = Array.isArray(data.tabs) ? (data.tabs as Tab[]) : [];

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      <div className="space-y-8">
        {tabs.map((tab, index) => (
          <div key={index} className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4" style={{ borderLeftColor: client.colors.primary }}>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: client.colors.primary }}
              >
                {tab.label}
              </h3>
              <p className="text-gray-700 leading-relaxed">{tab.content}</p>

              {Array.isArray(tab.features) && tab.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {tab.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        style={{ color: client.colors.primary }}
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
