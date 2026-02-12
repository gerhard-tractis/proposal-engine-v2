import { Client } from "@repo/shared";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Capability {
  number: number;
  title: string;
  description: string;
}

interface ArchitectureComponent {
  component: string;
  technology: string;
  purpose: string;
}

export function SolutionCapabilities({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const content = (data.content as string) || "";
  const capabilities = Array.isArray(data.capabilities)
    ? (data.capabilities as Capability[])
    : [];
  const architecture = Array.isArray(data.architecture)
    ? (data.architecture as ArchitectureComponent[])
    : [];

  if (!content && capabilities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {content && <p className="text-gray-700 leading-relaxed">{content}</p>}

      {capabilities.length > 0 && (
        <div className="space-y-4">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border-l-4"
              style={{ borderLeftColor: client.colors.primary }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="text-4xl font-bold flex-shrink-0"
                  style={{ color: client.colors.primary }}
                >
                  {capability.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {capability.title}
                  </h3>
                  <p className="text-gray-700">{capability.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {architecture.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technical Architecture
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr
                  className="border-b-2"
                  style={{ borderColor: client.colors.primary }}
                >
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Component
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Technology
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {architecture.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-900">
                      {item.component}
                    </td>
                    <td className="p-4 text-gray-700">{item.technology}</td>
                    <td className="p-4 text-gray-700">{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
