import { Client } from "@repo/shared";
import { MessageSquare } from "lucide-react";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  role?: string;
}

interface Stat {
  value: string;
  label: string;
}

export function TrustSocialProof({ data, client }: BlockComponentProps) {
  const sectionTitle = (data.sectionTitle as string) || "";
  const testimonials = Array.isArray(data.testimonials)
    ? (data.testimonials as Testimonial[])
    : [];
  const clients = Array.isArray(data.clients)
    ? (data.clients as string[])
    : [];
  const stats = Array.isArray(data.stats) ? (data.stats as Stat[]) : [];

  if (testimonials.length === 0 && clients.length === 0 && stats.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {sectionTitle && (
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: client.colors.primary }}
        >
          {sectionTitle}
        </h2>
      )}

      {testimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm relative"
            >
              <MessageSquare
                className="w-8 h-8 mb-4 opacity-20"
                style={{ color: client.colors.primary }}
              />
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">
                  {testimonial.author}
                </span>
                <span className="text-sm text-gray-600">
                  {testimonial.role ? `${testimonial.role}, ` : ""}
                  {testimonial.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {clients.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">
            Trusted by Leading Organizations
          </h3>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {clients.map((clientName, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium text-sm"
              >
                {clientName}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: client.colors.primary }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
