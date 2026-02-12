import { Client } from '@repo/shared';
import { AlertCircle, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface PlatformSla {
  uptime: string;
  description: string;
}

interface Tier {
  severity: string;
  responseTime: string;
  resolutionTarget: string;
  channels: string;
}

export function SlaTiers({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const platformSla = (data.platformSla as PlatformSla) || { uptime: '', description: '' };
  const tiers = Array.isArray(data.tiers) ? (data.tiers as Tier[]) : [];
  const escalation = Array.isArray(data.escalation) ? (data.escalation as string[]) : [];

  if (!platformSla.uptime && tiers.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string): string => {
    const sev = severity.toLowerCase();
    if (sev.includes('p1') || sev.includes('critical')) return 'bg-red-50 text-red-700 border-red-200';
    if (sev.includes('p2') || sev.includes('high')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (sev.includes('p3') || sev.includes('medium')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (sev.includes('p4') || sev.includes('low')) return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {/* Platform SLA Card */}
      {platformSla.uptime && (
        <div
          className="p-6 rounded-lg border-2 bg-white"
          style={{ borderColor: client.colors.primary }}
        >
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${client.colors.primary}15` }}
            >
              <ShieldCheck
                className="w-6 h-6"
                style={{ color: client.colors.primary }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Platform Uptime Guarantee
              </h3>
              <div className="text-3xl font-bold mb-2" style={{ color: client.colors.primary }}>
                {platformSla.uptime}
              </div>
              <p className="text-gray-600">{platformSla.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Support Tiers Table */}
      {tiers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr style={{ backgroundColor: `${client.colors.primary}10` }}>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b-2" style={{ borderColor: client.colors.primary }}>
                  Severity Level
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b-2" style={{ borderColor: client.colors.primary }}>
                  Response Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b-2" style={{ borderColor: client.colors.primary }}>
                  Resolution Target
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b-2" style={{ borderColor: client.colors.primary }}>
                  Support Channels
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, index) => (
                <tr key={index} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(tier.severity)}`}>
                      <AlertCircle className="w-4 h-4" />
                      {tier.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {tier.responseTime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{tier.resolutionTarget}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      {tier.channels}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Escalation Path */}
      {escalation.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Path</h3>
          <ol className="space-y-2">
            {escalation.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  {index + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
