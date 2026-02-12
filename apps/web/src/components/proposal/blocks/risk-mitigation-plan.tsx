import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Action {
  action: string;
  owner: string;
  deadline: string;
  status: string;
}

interface RiskWithActions {
  risk: string;
  probability: string;
  impact: string;
  actions: Action[];
}

export function RiskMitigationPlan({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const risks = Array.isArray(data.risks)
    ? (data.risks as RiskWithActions[])
    : [];

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

  const getStatusColor = (status: string): string => {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case 'complete':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2
          className="text-2xl font-bold"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </h2>
      )}

      <div className="space-y-6">
        {risks.map((risk, riskIndex) => (
          <div key={riskIndex} className="border rounded-lg bg-white shadow-sm">
            {/* Risk Header */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: client.colors.primary }}
              >
                {risk.risk}
              </h3>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Probability:</span>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                      risk.probability
                    )}`}
                  >
                    {formatText(risk.probability)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Impact:</span>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                      risk.impact
                    )}`}
                  >
                    {formatText(risk.impact)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Table */}
            {Array.isArray(risk.actions) && risk.actions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-40">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {risk.actions.map((action, actionIndex) => (
                      <tr key={actionIndex} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {action.action}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {action.owner}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {action.deadline}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              action.status
                            )}`}
                          >
                            {formatText(action.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
