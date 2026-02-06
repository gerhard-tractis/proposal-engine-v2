interface SolutionProps {
  content: string;
}

export function Solution({ content }: SolutionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Our Solution
      </h2>
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-lg leading-relaxed text-card-foreground">{content}</p>
      </div>
    </section>
  );
}
