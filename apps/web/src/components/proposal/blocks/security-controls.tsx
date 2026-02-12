import { Client } from '@repo/shared';
import { Database } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface SecurityControl {
  category: string;
  items: string[];
}

interface AuditLog {
  description: string;
  retentionPeriod: string;
}

export function SecurityControls({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const controls = Array.isArray(data.controls)
    ? (data.controls as SecurityControl[])
    : [];
  const auditLog = data.auditLog as AuditLog | undefined;

  if (controls.length === 0 && !auditLog) {
    return null;
  }

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

      {controls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {controls.map((control, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3
                className="font-semibold text-lg mb-3"
                style={{ color: client.colors.primary }}
              >
                {control.category}
              </h3>
              {Array.isArray(control.items) && control.items.length > 0 && (
                <ul className="space-y-2">
                  {control.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span
                        className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: client.colors.accent }}
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {auditLog && (
        <div className="border rounded-lg p-6 bg-gray-50 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Database
              className="h-5 w-5"
              style={{ color: client.colors.primary }}
            />
            <h3
              className="font-semibold text-lg"
              style={{ color: client.colors.primary }}
            >
              Audit Log
            </h3>
          </div>
          {auditLog.description && (
            <p className="text-gray-700 mb-2">{auditLog.description}</p>
          )}
          {auditLog.retentionPeriod && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Retention Period:</span>{' '}
              {auditLog.retentionPeriod}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
