import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Requirement {
  requirement: string;
  status: 'compliant' | 'partial' | 'planned';
}

interface Standard {
  name: string;
  requirements: Requirement[];
}

export function ComplianceMatrix({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const standards = Array.isArray(data.standards)
    ? (data.standards as Standard[])
    : [];

  if (standards.length === 0) {
    return null;
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
        {standards.map((standard, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 font-semibold text-white"
              style={{ backgroundColor: client.colors.primary }}
            >
              {standard.name}
            </div>
            {Array.isArray(standard.requirements) &&
              standard.requirements.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Requirement
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {standard.requirements.map((req, reqIndex) => (
                        <tr key={reqIndex} className="bg-white">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {req.requirement}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                req.status
                              )}`}
                            >
                              {formatStatus(req.status)}
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
