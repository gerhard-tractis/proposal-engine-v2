import { Client } from '@repo/shared';
import { Calendar, Building2, User } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Party {
  role: string;
  company: string;
  name: string;
  title: string;
}

export function LegalSignature({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const parties = Array.isArray(data.parties) ? (data.parties as Party[]) : [];
  const date = (data.date as string) || '';
  const effectiveDate = (data.effectiveDate as string) || '';

  if (parties.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b-2" style={{ borderColor: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date(s) set forth below.
        </p>
      </div>

      {/* Signature Blocks - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {parties.map((party, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border-2"
            style={{ borderColor: client.colors.primary }}
          >
            {/* Role Header */}
            <div
              className="px-4 py-2 rounded-lg mb-6 text-center font-semibold text-white"
              style={{ backgroundColor: client.colors.primary }}
            >
              {party.role}
            </div>

            {/* Company Name */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <Building2 className="w-4 h-4" />
                Company
              </div>
              <div className="text-lg font-bold text-gray-900">{party.company}</div>
            </div>

            {/* Signature Line */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Signature
              </div>
              <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
            </div>

            {/* Printed Name */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <User className="w-4 h-4" />
                Printed Name
              </div>
              <div className="text-base font-medium text-gray-900">{party.name}</div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Title
              </div>
              <div className="text-base text-gray-900">{party.title}</div>
            </div>

            {/* Date Line */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <Calendar className="w-4 h-4" />
                Date
              </div>
              <div className="border-b-2 border-gray-400 h-10 mb-2"></div>
              {date && (
                <div className="text-sm text-gray-600 italic">{date}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Effective Date Notice */}
      {effectiveDate && (
        <div
          className="bg-white rounded-lg p-6 border-2 text-center"
          style={{ borderColor: client.colors.accent }}
        >
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Effective Date
          </div>
          <div className="text-xl font-bold" style={{ color: client.colors.primary }}>
            {effectiveDate}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This Agreement shall become effective as of the date above
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 italic pt-4 border-t border-gray-200 text-center">
        Each party acknowledges that they have read and understood this Agreement and agree to be bound by its terms.
      </div>
    </div>
  );
}
