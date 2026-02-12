-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  type TEXT NOT NULL DEFAULT 'standard',
  custom_component TEXT,
  client JSONB NOT NULL,
  proposal JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Composite unique index for slug+token lookups (primary access pattern)
-- Slug is NOT unique by itself — allows multiple tokens per slug in future
CREATE UNIQUE INDEX idx_proposals_slug_token ON proposals(slug, token);

-- Index for slug-only lookups (admin dashboard, listing)
CREATE INDEX idx_proposals_slug ON proposals(slug);

-- Enrichment sessions table (replaces in-memory Map)
CREATE TABLE enrichment_sessions (
  id TEXT PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  partial_proposal JSONB NOT NULL DEFAULT '{}',
  missing_or_weak JSONB NOT NULL DEFAULT '[]',
  conversation_history JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '30 minutes'
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_sessions ENABLE ROW LEVEL SECURITY;

-- Anon can ONLY read published proposals (for frontend + middleware)
CREATE POLICY "Anon can read published proposals"
  ON proposals FOR SELECT
  TO anon
  USING (status = 'published');

-- No anon policies on enrichment_sessions — only service role can access
-- Service role bypasses RLS by default in Supabase, so no explicit policy needed

-- Index for expired session cleanup queries
CREATE INDEX idx_enrichment_sessions_expires ON enrichment_sessions(status, expires_at);

-- NOTE: Expired sessions (status='active' past expires_at) are filtered out at query time.
-- For actual row cleanup, add a pg_cron job or Supabase scheduled function:
-- DELETE FROM enrichment_sessions WHERE status = 'active' AND expires_at < now() - INTERVAL '1 hour';
