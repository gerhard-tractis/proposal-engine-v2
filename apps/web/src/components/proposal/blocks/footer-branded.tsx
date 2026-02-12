import Image from 'next/image';
import type { Client } from '@repo/shared';

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
  if (!poweredBy) return null;

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Powered by</span>
          <a
            href={poweredBy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <Image
              src={poweredBy.logo}
              alt={poweredBy.name}
              width={90}
              height={28}
              className="h-6 w-auto"
            />
          </a>
          <span className="text-xs text-gray-400">• {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
