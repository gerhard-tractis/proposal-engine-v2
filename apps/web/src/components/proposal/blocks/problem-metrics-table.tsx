import { Client } from "@repo/shared";
import { AlertCircle } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface ProblemMetric {
  metric: string;
  currentValue: string;
  impact: string;
}

export function ProblemMetricsTable({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const metrics = Array.isArray(data.metrics)
    ? (data.metrics as ProblemMetric[])
    : [];
  const problems = Array.isArray(data.problems)
    ? (data.problems as string[])
    : [];

  if (metrics.length === 0 && problems.length === 0) {
    return null;
  }

  const getImpactColor = (impact: string) => {
    const lowercaseImpact = impact.toLowerCase();
    if (lowercaseImpact.includes("high")) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (lowercaseImpact.includes("medium")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (lowercaseImpact.includes("low")) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {metrics.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr
                className="border-b-2"
                style={{ borderColor: client.colors.primary }}
              >
                <th className="text-left p-4 font-semibold text-gray-900">
                  Metric
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Current Value
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4 text-gray-700">{metric.metric}</td>
                  <td className="p-4 text-gray-700">{metric.currentValue}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(
                        metric.impact
                      )}`}
                    >
                      {metric.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {problems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Key Problems
          </h3>
          <ul className="space-y-2">
            {problems.map((problem, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                <span className="text-gray-700">{problem}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
