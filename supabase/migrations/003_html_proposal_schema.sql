-- V3 HTML Proposal Schema Migration
-- Adds columns for HTML-first proposal architecture alongside existing block-based columns

-- Add new columns (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'client_name') THEN
    ALTER TABLE proposals ADD COLUMN client_name TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'client_url') THEN
    ALTER TABLE proposals ADD COLUMN client_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'view_count') THEN
    ALTER TABLE proposals ADD COLUMN view_count INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'expires_at') THEN
    ALTER TABLE proposals ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'html_path') THEN
    ALTER TABLE proposals ADD COLUMN html_path TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'asset_manifest') THEN
    ALTER TABLE proposals ADD COLUMN asset_manifest JSONB DEFAULT '{}';
  END IF;
END $$;

-- Add CHECK constraint for status values
ALTER TABLE proposals DROP CONSTRAINT IF EXISTS proposals_status_check;
ALTER TABLE proposals ADD CONSTRAINT proposals_status_check
  CHECK (status IN ('draft', 'published', 'sent', 'viewed', 'accepted', 'rejected'));

-- Relax blocks_not_empty constraint: HTML proposals don't have blocks
ALTER TABLE proposals DROP CONSTRAINT IF EXISTS blocks_not_empty;
ALTER TABLE proposals ADD CONSTRAINT blocks_not_empty
  CHECK (html_path IS NOT NULL OR jsonb_array_length(COALESCE(blocks, '[]'::jsonb)) > 0);

-- Index on html_path for Storage lookups
CREATE INDEX IF NOT EXISTS idx_proposals_html_path ON proposals(html_path) WHERE html_path IS NOT NULL;

-- increment_view function: bumps view_count and transitions sent → viewed
CREATE OR REPLACE FUNCTION increment_view(proposal_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE proposals
  SET view_count = view_count + 1,
      status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
  WHERE slug = proposal_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restrict increment_view to service role only (prevent anon abuse)
REVOKE EXECUTE ON FUNCTION increment_view(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION increment_view(TEXT) FROM authenticated;

-- Update RLS policy: allow anon reads for published, sent, and viewed proposals
DROP POLICY IF EXISTS "Anon can read published proposals" ON proposals;
CREATE POLICY "Anon can read active proposals"
  ON proposals FOR SELECT
  TO anon
  USING (status IN ('published', 'sent', 'viewed', 'draft'));

-- NOTE: Storage buckets (proposals, proposal-assets) must be created via
-- Supabase Dashboard or supabase CLI, NOT via raw SQL.
-- Local dev: add to supabase/config.toml under [storage]
-- Production: supabase storage create proposals --private
--             supabase storage create proposal-assets --private
