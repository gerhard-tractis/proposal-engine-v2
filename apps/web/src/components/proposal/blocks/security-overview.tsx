import { Client } from '@repo/shared';
import { ShieldCheck } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Layer {
  layer: string;
  technology: string;
  description: string;
}

export function SecurityOverview({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const content = (data.content as string) || '';
  const badges = Array.isArray(data.badges) ? (data.badges as string[]) : [];
  const layers = Array.isArray(data.layers) ? (data.layers as Layer[]) : [];
  const certifications = Array.isArray(data.certifications) ? (data.certifications as string[]) : [];

  if (!content && badges.length === 0 && layers.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900">{sectionTitle}</h3>
      )}

      {/* Content */}
      {content && (
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{content}</p>
        </div>
      )}

      {/* Compliance Badges */}
      {badges.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">Compliance</h4>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm"
                style={{ backgroundColor: client.colors.primary }}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Layers Table */}
      {layers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">Security Layers</h4>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: client.colors.primary }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Layer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Technology
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {layers.map((layer, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {layer.layer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {layer.technology}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {layer.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">Certifications</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border-2 p-4 text-center shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: client.colors.accent || client.colors.primary }}
              >
                <ShieldCheck
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: client.colors.primary }}
                />
                <p className="text-sm font-medium text-gray-900">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
