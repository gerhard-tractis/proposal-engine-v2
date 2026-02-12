import { Client } from '@repo/shared';
import { AlertCircle } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Phase {
  week: string | number;
  phase: string;
  milestone: string;
  deliverables: string[];
  responsible: string;
}

export function TimelineTable({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const prerequisites = Array.isArray(data.prerequisites) ? (data.prerequisites as string[]) : [];
  const phases = Array.isArray(data.phases) ? (data.phases as Phase[]) : [];

  if (phases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      {/* Prerequisites Callout */}
      {prerequisites.length > 0 && (
        <div
          className="border-l-4 p-4 rounded-r-lg"
          style={{
            borderLeftColor: client.colors.accent,
            backgroundColor: `${client.colors.accent}10`
          }}
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: client.colors.accent }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: client.colors.primary }}>
                Prerequisites
              </h3>
              <ul className="space-y-1">
                {prerequisites.map((prereq, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {prereq}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr style={{ backgroundColor: client.colors.primary, color: 'white' }}>
              <th className="p-3 text-left border border-gray-300">Week</th>
              <th className="p-3 text-left border border-gray-300">Phase</th>
              <th className="p-3 text-left border border-gray-300">Milestone</th>
              <th className="p-3 text-left border border-gray-300">Deliverables</th>
              <th className="p-3 text-left border border-gray-300">Responsible</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase, idx) => {
              const deliverables = Array.isArray(phase.deliverables) ? phase.deliverables : [];
              const deliverablesText = deliverables.join(', ');

              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-3 border border-gray-300 font-semibold" style={{ color: client.colors.accent }}>
                    {phase.week}
                  </td>
                  <td className="p-3 border border-gray-300 font-medium">
                    {phase.phase}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {phase.milestone}
                  </td>
                  <td className="p-3 border border-gray-300 text-gray-700">
                    {deliverablesText}
                  </td>
                  <td className="p-3 border border-gray-300 text-gray-700">
                    {phase.responsible}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
