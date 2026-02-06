'use client'; // Error boundaries must be client components

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

function ErrorFallback({ error }: { error: unknown }) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
        This section is temporarily unavailable
      </h3>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-2 text-xs text-red-700 dark:text-red-300">
          {errorMessage}
        </pre>
      )}
    </div>
  );
}

export function ProposalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Proposal section error:', error, errorInfo);
        // In production, Vercel captures console.error in logs
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
