import { Client } from "@repo/shared";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Milestone {
  label: string;
  date: string;
}

export function ExecutiveSummaryTimeline({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const content = (data.content as string) || "";
  const milestones = Array.isArray(data.milestones)
    ? (data.milestones as Milestone[])
    : [];

  if (!content && milestones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {content && <p className="text-gray-700 leading-relaxed">{content}</p>}

      {milestones.length > 0 && (
        <div className="relative pt-8">
          <div className="flex justify-between items-start">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className="w-4 h-4 rounded-full border-4 bg-white"
                    style={{ borderColor: client.colors.primary }}
                  />
                  {index < milestones.length - 1 && (
                    <div
                      className="absolute top-2 left-4 h-0.5"
                      style={{
                        width: `calc(${100 / (milestones.length - 1)}vw - 2rem)`,
                        backgroundColor: client.colors.primary,
                        opacity: 0.3,
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <div className="font-semibold text-gray-900 text-sm">
                    {milestone.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {milestone.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
