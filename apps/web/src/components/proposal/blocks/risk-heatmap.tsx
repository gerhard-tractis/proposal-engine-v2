import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface RiskItem {
  id: string;
  probability: number;
  impact: number;
  label: string;
}

export function RiskHeatmap({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const risks = Array.isArray(data.risks) ? (data.risks as RiskItem[]) : [];

  if (risks.length === 0) {
    return null;
  }

  const getRiskColor = (score: number): string => {
    if (score >= 1 && score <= 5) return 'bg-green-200 border-green-400';
    if (score >= 6 && score <= 12) return 'bg-yellow-200 border-yellow-400';
    if (score >= 13 && score <= 19) return 'bg-orange-200 border-orange-400';
    if (score >= 20 && score <= 25) return 'bg-red-200 border-red-400';
    return 'bg-gray-100 border-gray-300';
  };

  const getLegendColor = (label: string): string => {
    switch (label) {
      case 'Low (1-5)':
        return 'bg-green-200 border-green-400';
      case 'Medium (6-12)':
        return 'bg-yellow-200 border-yellow-400';
      case 'High (13-19)':
        return 'bg-orange-200 border-orange-400';
      case 'Critical (20-25)':
        return 'bg-red-200 border-red-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Create a 5x5 grid structure
  const grid: RiskItem[][][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null).map(() => []));

  // Populate grid with risks
  risks.forEach((risk) => {
    const prob = Math.max(1, Math.min(5, risk.probability));
    const imp = Math.max(1, Math.min(5, risk.impact));
    const rowIndex = 5 - prob; // Invert for display (5 at top, 1 at bottom)
    const colIndex = imp - 1;
    grid[rowIndex][colIndex].push(risk);
  });

  const probabilityLabels = ['5 - Very High', '4 - High', '3 - Medium', '2 - Low', '1 - Very Low'];
  const impactLabels = ['1 - Very Low', '2 - Low', '3 - Medium', '4 - High', '5 - Very High'];

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

      <div className="border rounded-lg p-6 bg-white shadow-sm overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Y-axis label */}
          <div className="flex items-start mb-2">
            <div className="w-32 flex items-center justify-center">
              <span
                className="font-semibold text-sm -rotate-90 whitespace-nowrap"
                style={{ color: client.colors.primary }}
              >
                Probability
              </span>
            </div>
            <div className="flex-1" />
          </div>

          {/* Grid */}
          <div className="flex">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-3">
              {probabilityLabels.map((label, index) => (
                <div
                  key={index}
                  className="h-20 flex items-center text-xs text-gray-600"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid cells */}
            <div className="flex-1">
              <div className="grid grid-rows-5 gap-1">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-5 gap-1">
                    {row.map((cell, colIndex) => {
                      const probability = 5 - rowIndex;
                      const impact = colIndex + 1;
                      const score = probability * impact;
                      const cellRisks = cell || [];

                      return (
                        <div
                          key={colIndex}
                          className={`h-20 border-2 rounded flex items-center justify-center p-1 ${getRiskColor(
                            score
                          )}`}
                        >
                          {cellRisks.length > 0 && (
                            <div className="text-xs font-semibold text-gray-800 text-center">
                              {cellRisks.map((r) => r.id).join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="grid grid-cols-5 gap-1 mt-2">
                {impactLabels.map((label, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-600 text-center"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis label */}
          <div className="flex justify-center mt-3">
            <span
              className="font-semibold text-sm"
              style={{ color: client.colors.primary }}
            >
              Impact
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {['Low (1-5)', 'Medium (6-12)', 'High (13-19)', 'Critical (20-25)'].map(
          (label) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 border-2 rounded ${getLegendColor(label)}`}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          )
        )}
      </div>

      {/* Risk List */}
      {risks.length > 0 && (
        <div className="mt-6">
          <h3
            className="font-semibold text-lg mb-3"
            style={{ color: client.colors.primary }}
          >
            Risk Details
          </h3>
          <div className="space-y-2">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="font-semibold">{risk.id}:</span>
                <span>{risk.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
