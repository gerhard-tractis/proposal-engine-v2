import type { ContactInfo } from '@repo/shared';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="space-y-8 border-t border-border pt-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Next Steps
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready to get started? Here's how we'll move forward together.
        </p>
      </div>

      <div className="space-y-4">
        {contact.nextSteps.map((step, index) => (
          <div
            key={index}
            className="flex gap-3 items-start rounded-lg border border-border bg-card p-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-card-foreground pt-1">{step}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-8 space-y-6">
        <h3 className="text-xl font-semibold text-card-foreground">
          Get in Touch
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <a
              href={`mailto:${contact.email}`}
              className="text-card-foreground hover:text-primary transition-colors"
            >
              {contact.email}
            </a>
          </div>

          {contact.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a
                href={`tel:${contact.phone}`}
                className="text-card-foreground hover:text-primary transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          )}

          {contact.calendlyUrl && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-card-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                Schedule a call
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Contact: {contact.name}
        </p>
      </div>
    </section>
  );
}
