import { Client } from '@repo/shared';
import { Mail, Phone } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface ActionItem {
  step: string | number;
  action: string;
  responsible: string;
  timeline: string;
}

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export function CtaActionItems({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const actionItems = Array.isArray(data.actionItems) ? (data.actionItems as ActionItem[]) : [];
  const contactData = data.contact as Contact | undefined;

  if (actionItems.length === 0 && !contactData) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <h2 className="text-3xl font-bold" style={{ color: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      {/* Action Items Table */}
      {actionItems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: client.colors.primary, color: 'white' }}>
                <th className="p-3 text-left">Step</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Responsible</th>
                <th className="p-3 text-left">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-semibold" style={{ color: client.colors.accent }}>
                    {item.step}
                  </td>
                  <td className="p-3 font-medium">
                    {item.action}
                  </td>
                  <td className="p-3 text-gray-700">
                    {item.responsible}
                  </td>
                  <td className="p-3 text-gray-700">
                    {item.timeline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Card */}
      {contactData && (
        <div className="border rounded-lg p-6" style={{ borderColor: client.colors.primary }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: client.colors.primary }}>
            Your Point of Contact
          </h3>
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-lg">{contactData.name}</div>
              <div className="text-gray-600">{contactData.role}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" style={{ color: client.colors.accent }} />
                <a
                  href={`mailto:${contactData.email}`}
                  className="hover:underline"
                  style={{ color: client.colors.primary }}
                >
                  {contactData.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" style={{ color: client.colors.accent }} />
                <a
                  href={`tel:${contactData.phone}`}
                  className="hover:underline"
                  style={{ color: client.colors.primary }}
                >
                  {contactData.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
