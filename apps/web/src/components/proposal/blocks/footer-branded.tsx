import { Client } from "@repo/shared";
import Image from "next/image";

interface BlockComponentProps {
  data: Record<string, unknown>;
  client: Client;
}

interface PoweredBy {
  name: string;
  logo: string;
  url: string;
}

export function FooterBranded({ data }: BlockComponentProps) {
  const poweredBy = data.poweredBy as PoweredBy | undefined;

  if (!poweredBy) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <span>Powered by</span>
            <a
              href={poweredBy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src={poweredBy.logo}
                alt={poweredBy.name}
                width={100}
                height={28}
                className="h-7 w-auto"
              />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {currentYear} {poweredBy.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
