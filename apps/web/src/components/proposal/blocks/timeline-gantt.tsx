import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Milestone {
  week: number;
  label: string;
}

interface Phase {
  name: string;
  startWeek: number;
  endWeek: number;
  milestones?: Milestone[];
}

export function TimelineGantt({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const totalWeeks = (data.totalWeeks as number) || 12;
  const phases = Array.isArray(data.phases) ? (data.phases as Phase[]) : [];

  if (phases.length === 0 || totalWeeks <= 0) {
    return null;
  }

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Week Headers */}
          <div className="grid gap-0 mb-2" style={{ gridTemplateColumns: `200px repeat(${totalWeeks}, 60px)` }}>
            <div className="font-semibold p-2"></div>
            {weeks.map((week) => (
              <div
                key={week}
                className="text-center text-sm font-semibold p-2 border-l"
                style={{ color: client.colors.primary }}
              >
                W{week}
              </div>
            ))}
          </div>

          {/* Phase Rows */}
          <div className="space-y-1">
            {phases.map((phase, phaseIdx) => {
              const isEven = phaseIdx % 2 === 0;
              const barColor = isEven ? client.colors.primary : client.colors.accent;
              const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];

              return (
                <div
                  key={phaseIdx}
                  className="grid gap-0 items-center"
                  style={{ gridTemplateColumns: `200px repeat(${totalWeeks}, 60px)` }}
                >
                  {/* Phase Name */}
                  <div className="p-2 font-medium text-sm bg-gray-50 border">
                    {phase.name}
                  </div>

                  {/* Gantt Bar */}
                  {weeks.map((week) => {
                    const isInRange = week >= phase.startWeek && week <= phase.endWeek;
                    const milestone = milestones.find((m) => m.week === week);

                    return (
                      <div
                        key={week}
                        className="h-12 border-l border-b relative flex items-center justify-center"
                        style={{
                          backgroundColor: isInRange ? `${barColor}40` : 'transparent'
                        }}
                      >
                        {isInRange && (
                          <div
                            className="absolute inset-y-2 left-0 right-0"
                            style={{
                              backgroundColor: barColor,
                              opacity: 0.8
                            }}
                          />
                        )}
                        {milestone && (
                          <div
                            className="relative z-10 w-4 h-4 transform rotate-45"
                            style={{
                              backgroundColor: barColor,
                              border: '2px solid white'
                            }}
                            title={milestone.label}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Milestone Legend */}
          {phases.some((p) => Array.isArray(p.milestones) && p.milestones.length > 0) && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-sm" style={{ color: client.colors.primary }}>
                Milestones
              </h3>
              <div className="space-y-1">
                {phases.map((phase, phaseIdx) => {
                  const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];
                  if (milestones.length === 0) return null;

                  return (
                    <div key={phaseIdx}>
                      {milestones.map((milestone, mIdx) => (
                        <div key={mIdx} className="text-sm text-gray-700 flex items-center">
                          <div
                            className="w-3 h-3 transform rotate-45 mr-2"
                            style={{
                              backgroundColor: phaseIdx % 2 === 0 ? client.colors.primary : client.colors.accent,
                              border: '1px solid white'
                            }}
                          />
                          <span>
                            Week {milestone.week}: {milestone.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
