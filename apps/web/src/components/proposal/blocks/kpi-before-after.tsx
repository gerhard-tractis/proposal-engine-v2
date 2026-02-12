import { Client } from '@repo/shared';
import { TrendingUp } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Comparison {
  metric: string;
  before: string | number;
  after: string | number;
  improvement: string;
}

export function KpiBeforeAfter({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const comparisons = Array.isArray(data.comparisons) ? (data.comparisons as Comparison[]) : [];

  if (comparisons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900">{sectionTitle}</h3>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: client.colors.primary }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                Metric
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                Before
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                After
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                Improvement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {comparisons.map((comparison, index) => (
              <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {comparison.metric}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {String(comparison.before)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {String(comparison.after)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex items-center justify-center text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {comparison.improvement}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-4">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
          >
            <div className="font-semibold text-gray-900 text-base border-b pb-2">
              {comparison.metric}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase">Before</span>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {String(comparison.before)}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">After</span>
                <p className="text-sm text-gray-900 font-medium mt-1">
                  {String(comparison.after)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm">{comparison.improvement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
