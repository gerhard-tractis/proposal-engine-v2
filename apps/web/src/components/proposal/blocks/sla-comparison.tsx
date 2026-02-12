import { Client } from '@repo/shared';
import { Check, X, Star } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Plan {
  name: string;
  features: Record<string, string | boolean>;
  recommended?: boolean;
}

export function SlaComparison({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const plans = Array.isArray(data.plans) ? (data.plans as Plan[]) : [];
  const featureLabels = Array.isArray(data.featureLabels) ? (data.featureLabels as string[]) : [];

  if (plans.length === 0 || featureLabels.length === 0) {
    return null;
  }

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-b-2 border-gray-300 sticky left-0 z-10">
                Feature
              </th>
              {plans.map((plan, index) => (
                <th
                  key={index}
                  className={`px-4 py-4 text-center text-sm font-semibold border-b-2 ${
                    plan.recommended ? 'relative' : ''
                  }`}
                  style={{
                    backgroundColor: plan.recommended ? `${client.colors.primary}15` : '#f9fafb',
                    borderColor: plan.recommended ? client.colors.primary : '#d1d5db',
                  }}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: client.colors.accent }}
                      >
                        <Star className="w-3 h-3" />
                        Recommended
                      </span>
                    </div>
                  )}
                  <div className="text-gray-900">{plan.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureLabels.map((label, labelIndex) => (
              <tr
                key={labelIndex}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-white sticky left-0 z-10">
                  {label}
                </td>
                {plans.map((plan, planIndex) => (
                  <td
                    key={planIndex}
                    className={`px-4 py-3 text-sm text-center ${
                      plan.recommended ? 'bg-white' : ''
                    }`}
                    style={{
                      backgroundColor: plan.recommended ? `${client.colors.primary}05` : 'white',
                    }}
                  >
                    {renderFeatureValue(plan.features[label] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Compare service levels to find the right fit for your organization
      </div>
    </div>
  );
}
