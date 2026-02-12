import { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export function DataTableComparison({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || '';
  const columns = Array.isArray(data.columns) ? (data.columns as Column[]) : [];
  const rows = Array.isArray(data.rows) ? (data.rows as Record<string, string | number | boolean>[]) : [];
  const recommendedColumn = (data.recommendedColumn as string) || '';

  if (columns.length === 0 || rows.length === 0) {
    return null;
  }

  const isRecommended = (columnKey: string) => columnKey === recommendedColumn;

  return (
    <div className="space-y-4">
      {sectionTitle && (
        <h3 className="text-2xl font-bold text-gray-900">{sectionTitle}</h3>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    backgroundColor: isRecommended(column.key)
                      ? client.colors.primary
                      : '#f9fafb',
                    color: isRecommended(column.key) ? '#ffffff' : '#111827',
                  }}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {column.label}
                  {isRecommended(column.key) && (
                    <span className="ml-2 text-xs font-normal">(Recommended)</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      backgroundColor: isRecommended(column.key)
                        ? `${client.colors.primary}08`
                        : 'transparent',
                    }}
                    className={`px-6 py-4 text-sm text-gray-900 ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className={`flex justify-between items-start p-2 rounded ${
                  isRecommended(column.key) ? 'border-l-4' : ''
                }`}
                style={
                  isRecommended(column.key)
                    ? { backgroundColor: `${client.colors.primary}08`, borderLeftColor: client.colors.primary }
                    : {}
                }
              >
                <span className="font-medium text-gray-700 text-sm">
                  {column.label}
                  {isRecommended(column.key) && (
                    <span className="ml-1 text-xs">(Recommended)</span>
                  )}:
                </span>
                <span className="text-gray-900 text-sm text-right ml-4">
                  {String(row[column.key] ?? '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
