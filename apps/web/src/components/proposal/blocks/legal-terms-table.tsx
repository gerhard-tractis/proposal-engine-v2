import { Client } from '@repo/shared';
import { FileText } from 'lucide-react';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Term {
  term: string;
  description: string;
}

interface Category {
  name: string;
  terms: Term[];
}

export function LegalTermsTable({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const categories = Array.isArray(data.categories) ? (data.categories as Category[]) : [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
      )}

      {categories.map((category, categoryIndex) => {
        const terms = Array.isArray(category.terms) ? category.terms : [];

        if (terms.length === 0) {
          return null;
        }

        return (
          <div key={categoryIndex} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3 pb-2 border-b-2" style={{ borderColor: client.colors.accent }}>
              <FileText className="w-5 h-5" style={{ color: client.colors.accent }} />
              <h3 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>

            {/* Terms Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: `${client.colors.primary}08` }}>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300 w-1/3">
                      Term
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((term, termIndex) => (
                    <tr
                      key={termIndex}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 align-top">
                        {term.term}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 align-top">
                        {term.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="text-xs text-gray-500 italic pt-4 border-t border-gray-200">
        These definitions apply throughout this agreement and all related documents.
      </div>
    </div>
  );
}
