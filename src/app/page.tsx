import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-6 text-center px-8">
        <Image
          src="/logos/tractis-white.svg"
          alt="Tractis"
          width={200}
          height={60}
          className="h-16 w-auto mb-4"
          priority
        />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Tractis Proposal Engine
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          AI-powered proposal platform. Proposals are accessed via private, token-based URLs.
        </p>
      </main>
    </div>
  );
}
