import type { ContactInfo } from '@repo/shared';
import { Mail, Phone, Calendar, Globe, Linkedin } from 'lucide-react';

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="space-y-8 border-t border-border pt-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Let's Get Started
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {contact.cta}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold text-card-foreground">
            {contact.name}
          </h3>
          <p className="text-muted-foreground">{contact.role}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={`mailto:${contact.email}`}
              className="text-card-foreground hover:text-primary transition-colors"
            >
              {contact.email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={`tel:${contact.phone}`}
              className="text-card-foreground hover:text-primary transition-colors"
            >
              {contact.phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-card-foreground hover:text-primary transition-colors"
            >
              {contact.website.replace(/^https?:\/\//, '')}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Linkedin className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-card-foreground hover:text-primary transition-colors"
            >
              LinkedIn Profile
            </a>
          </div>

          {contact.calendly && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <a
                href={contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="text-card-foreground hover:text-primary transition-colors"
              >
                Schedule a Meeting
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
