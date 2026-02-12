import { Client } from '@repo/shared';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Metric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  description?: string;
  color?: string;
}

export function MetricsGrid({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const metrics = Array.isArray(data.metrics) ? (data.metrics as Metric[]) : [];

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900">{sectionTitle}</h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const borderColor = metric.color || client.colors.primary;

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              style={{
                borderTopWidth: '4px',
                borderTopColor: borderColor,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </p>
                  {metric.trend && (
                    <div className="ml-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <p className="text-3xl font-bold text-gray-900">
                  {String(metric.value)}
                </p>

                {metric.description && (
                  <p className="text-xs text-gray-500 mt-2">
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
