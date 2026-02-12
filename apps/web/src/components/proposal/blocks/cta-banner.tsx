import type { Client } from '@repo/shared';

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface CtaContact {
  email: string;
  phone: string;
  name: string;
}

export function CtaBanner({ data, client }: BlockComponentProps) {
  const title = (data.title as string) || '';
  const description = data.description as string | undefined;
  const ctaText = data.ctaText as string | undefined;
  const contact = data.contact as CtaContact | undefined;

  if (!title) return null;

  return (
    <section
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center text-white"
      style={{
        background: `linear-gradient(135deg, ${client.colors.primary} 0%, ${client.colors.accent} 100%)`
      }}
    >
      <div className="relative z-10">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 px-4" style={{ color: '#ffffff' }}>
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 text-white/90 px-4 max-w-3xl mx-auto leading-snug sm:leading-relaxed">
            {description}
          </p>
        )}
        {ctaText && (
          <p className="text-base sm:text-xl md:text-2xl font-bold mb-4 sm:mb-8 text-white px-4">
            {ctaText}
          </p>
        )}
        {contact && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
            <a
              href={`mailto:${contact.email}?subject=Consulta sobre Aureon Connect&body=Hola ${contact.name},%0D%0A%0D%0AMe interesa conocer más sobre Aureon Connect.%0D%0A%0D%0ASaludos,`}
              className="transition-colors"
              style={{ color: '#ffffff' }}
            >
              📧 {contact.email}
            </a>
            <a
              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=Hola, me interesa conocer más sobre Aureon Connect`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: '#ffffff' }}
            >
              📱 {contact.phone}
            </a>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
    </section>
  );
}
