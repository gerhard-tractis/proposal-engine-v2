import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Subsection {
  number: string;
  title: string;
  content: string;
}

interface Section {
  number: string;
  title: string;
  content: string;
  subsections?: Subsection[];
}

export function LegalSections({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const sections = Array.isArray(data.sections) ? (data.sections as Section[]) : [];

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b-2" style={{ borderColor: client.colors.primary }}>
          {sectionTitle}
        </h2>
      )}

      {sections.map((section, index) => {
        const subsections = Array.isArray(section.subsections) ? section.subsections : [];

        return (
          <div key={index} className="space-y-4">
            {/* Section Header */}
            <div className="flex gap-3">
              <div
                className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: client.colors.primary }}
              >
                {section.number}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            </div>

            {/* Subsections */}
            {subsections.length > 0 && (
              <div className="ml-11 space-y-4 border-l-2 border-gray-200 pl-6">
                {subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="flex-shrink-0 font-semibold text-sm"
                        style={{ color: client.colors.accent }}
                      >
                        {subsection.number}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {subsection.title}
                      </h4>
                    </div>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-8">
                      {subsection.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="text-xs text-gray-500 italic pt-6 border-t border-gray-200 text-center">
        This document constitutes a legally binding agreement. Please review carefully.
      </div>
    </div>
  );
}
