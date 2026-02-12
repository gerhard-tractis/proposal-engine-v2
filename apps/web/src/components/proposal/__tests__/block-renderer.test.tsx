import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '../block-renderer';
import type { Block, Client } from '@repo/shared';

// Mock the error boundary to just render children (avoids react-error-boundary issues in test)
vi.mock('../proposal-error-boundary', () => ({
  ProposalErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockClient: Client = {
  name: 'Test Client',
  logo: '/logos/test.svg',
  colors: { primary: '#ff0000', accent: '#00ff00' },
};

describe('BlockRenderer', () => {
  it('renders known block components', () => {
    const blocks: Block[] = [
      { id: 'test-title', component: 'title-header', data: { title: 'Hello World' } },
    ];

    render(<BlockRenderer blocks={blocks} client={mockClient} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('silently skips unknown block components', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const blocks: Block[] = [
      { id: 'unknown-1', component: 'nonexistent-block', data: {} },
      { id: 'test-title', component: 'title-header', data: { title: 'Still Here' } },
    ];

    render(<BlockRenderer blocks={blocks} client={mockClient} />);

    // Known block still renders
    expect(screen.getByText('Still Here')).toBeInTheDocument();

    warnSpy.mockRestore();
  });

  it('renders nothing for empty blocks array', () => {
    const { container } = render(<BlockRenderer blocks={[]} client={mockClient} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders multiple blocks in order', () => {
    const blocks: Block[] = [
      { id: 'title-1', component: 'title-header', data: { title: 'First' } },
      { id: 'exec-1', component: 'executive-summary', data: { content: 'Second block content' } },
    ];

    render(<BlockRenderer blocks={blocks} client={mockClient} />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second block content')).toBeInTheDocument();
  });
});
