import { Client } from "@repo/shared";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface ChecklistItem {
  item: string;
  status: "compliant" | "partial" | "n-a";
}

export function ChecklistTable({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const items = Array.isArray(data.items)
    ? (data.items as ChecklistItem[])
    : [];

  if (items.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Compliant",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          iconColor: "text-green-600",
        };
      case "partial":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          label: "Partial",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600",
        };
      case "n-a":
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "N/A",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          iconColor: "text-gray-600",
        };
      default:
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          iconColor: "text-gray-600",
        };
    }
  };

  return (
    <section className="py-12">
      {sectionTitle && (
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </h2>
      )}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-2/3"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const statusBadge = getStatusBadge(item.status);

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.item}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}
                    >
                      <span className={statusBadge.iconColor}>
                        {statusBadge.icon}
                      </span>
                      {statusBadge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
