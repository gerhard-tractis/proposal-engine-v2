import { Client } from '@repo/shared';
import { AlertCircle } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface KPI {
  metric: string;
  target: string;
  measurement: string;
}

interface Category {
  name: string;
  kpis: KPI[];
}

export function KpiDashboard({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const categories = Array.isArray(data.categories) ? (data.categories as Category[]) : [];
  const assumptions = Array.isArray(data.assumptions) ? (data.assumptions as string[]) : [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900">{sectionTitle}</h3>
      )}

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => {
          const kpis = Array.isArray(category.kpis) ? category.kpis : [];

          if (kpis.length === 0) {
            return null;
          }

          return (
            <div key={categoryIndex} className="space-y-3">
              <h4
                className="text-lg font-semibold text-white px-4 py-2 rounded-t-lg"
                style={{ backgroundColor: client.colors.primary }}
              >
                {category.name}
              </h4>

              <div className="overflow-x-auto rounded-b-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Measurement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kpis.map((kpi, kpiIndex) => (
                      <tr key={kpiIndex} className={kpiIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {kpi.metric}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {kpi.target}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {kpi.measurement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assumptions */}
      {assumptions.length > 0 && (
        <div
          className="rounded-lg border-l-4 p-6 bg-blue-50"
          style={{ borderLeftColor: client.colors.accent || client.colors.primary }}
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-900">Assumptions</h5>
              <ul className="list-disc list-inside space-y-1">
                {assumptions.map((assumption, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
