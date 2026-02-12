import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @supabase/supabase-js before any imports
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
}));
const mockSupabaseClient = { from: mockFrom };

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

// Mock @supabase/ssr to prevent import errors
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

import {
  getProposalBySlugAndToken,
  getAllProposals,
  validateToken,
} from '../proposal-helpers';

// Valid proposal row from DB (block-based schema)
const validRow = {
  id: '123',
  slug: 'tractis-demo',
  token: 'xK8pQ2mN7v',
  status: 'published',
  client: {
    name: 'Tractis AI',
    logo: '/logos/tractis-color.svg',
    colors: { primary: '#dfad30', accent: '#7b8b9d' },
  },
  metadata: {
    headerStyle: 'standard',
    maxWidth: '5xl',
  },
  blocks: [
    {
      id: 'demo-exec-summary',
      component: 'executive-summary',
      data: { content: 'Test summary' },
    },
  ],
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
  published_at: '2025-01-15T00:00:00Z',
};

function setupChain(finalResult: { data: unknown; error: unknown }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
    then: undefined as any,
  };
  const promise = Promise.resolve(finalResult);
  chain.order = vi.fn().mockReturnValue({
    ...chain,
    then: promise.then.bind(promise),
    catch: (promise as any).catch.bind(promise),
  });
  mockFrom.mockReturnValue(chain);
  return chain;
}

describe('proposal-helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  describe('getProposalBySlugAndToken', () => {
    it('returns validated proposal on happy path', async () => {
      setupChain({ data: validRow, error: null });

      const result = await getProposalBySlugAndToken('tractis-demo', 'xK8pQ2mN7v');

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('tractis-demo');
      expect(result?.token).toBe('xK8pQ2mN7v');
      expect(result?.blocks).toHaveLength(1);
      expect(result?.metadata?.headerStyle).toBe('standard');
    });

    it('returns null when not found', async () => {
      setupChain({ data: null, error: { message: 'No rows found', code: 'PGRST116' } });

      const result = await getProposalBySlugAndToken('nonexistent', 'bad-token');

      expect(result).toBeNull();
    });

    it('returns null when Zod validation fails', async () => {
      const invalidRow = { ...validRow, blocks: 'not-an-array' };
      setupChain({ data: invalidRow, error: null });

      const result = await getProposalBySlugAndToken('tractis-demo', 'xK8pQ2mN7v');

      expect(result).toBeNull();
    });

    it('returns null when Supabase fails', async () => {
      setupChain({ data: null, error: { message: 'connection refused' } });

      const result = await getProposalBySlugAndToken('tractis-demo', 'xK8pQ2mN7v');

      expect(result).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('returns true for valid token', async () => {
      setupChain({ data: { slug: 'tractis-demo' }, error: null });

      const result = await validateToken('tractis-demo', 'xK8pQ2mN7v');

      expect(result).toBe(true);
    });

    it('returns false for invalid token', async () => {
      setupChain({ data: null, error: { message: 'No rows found', code: 'PGRST116' } });

      const result = await validateToken('tractis-demo', 'wrong');

      expect(result).toBe(false);
    });

    it('returns false when Supabase fails', async () => {
      setupChain({ data: null, error: { message: 'connection refused' } });

      const result = await validateToken('tractis-demo', 'xK8pQ2mN7v');

      expect(result).toBe(false);
    });
  });

  describe('getAllProposals', () => {
    it('returns mapped proposals', async () => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [validRow], error: null }),
        single: vi.fn(),
      };
      mockFrom.mockReturnValue(chain);

      const result = await getAllProposals();

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('tractis-demo');
      expect(result[0].blocks).toHaveLength(1);
    });

    it('returns empty array on error', async () => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
        single: vi.fn(),
      };
      mockFrom.mockReturnValue(chain);

      const result = await getAllProposals();

      expect(result).toEqual([]);
    });
  });
});
