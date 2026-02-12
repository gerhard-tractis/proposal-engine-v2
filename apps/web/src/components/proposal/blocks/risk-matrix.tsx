import { Client } from '@repo/shared';
import { AlertTriangle } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Risk {
  risk: string;
  probability: string;
  impact: string;
  mitigation: string;
}

export function RiskMatrix({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const risks = Array.isArray(data.risks) ? (data.risks as Risk[]) : [];

  if (risks.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string): string => {
    const normalized = severity.toLowerCase();
    switch (normalized) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSeverity = (severity: string): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="h-6 w-6"
            style={{ color: client.colors.primary }}
          />
          <h2
            className="text-2xl font-bold"
            style={{ color: client.colors.primary }}
          >
            {sectionTitle}
          </h2>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Risk
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                  Probability
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                  Impact
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mitigation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {risks.map((risk, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {risk.risk}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                        risk.probability
                      )}`}
                    >
                      {formatSeverity(risk.probability)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                        risk.impact
                      )}`}
                    >
                      {formatSeverity(risk.impact)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {risk.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
