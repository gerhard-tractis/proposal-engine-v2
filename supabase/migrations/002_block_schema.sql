-- V2 Block Schema Migration
-- Replaces fixed 8-section proposal structure with flexible block-based architecture

-- Remove old columns
ALTER TABLE proposals DROP COLUMN IF EXISTS type;
ALTER TABLE proposals DROP COLUMN IF EXISTS custom_component;
ALTER TABLE proposals DROP COLUMN IF EXISTS proposal;

-- Add new block-based columns (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'metadata') THEN
    ALTER TABLE proposals ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'blocks') THEN
    ALTER TABLE proposals ADD COLUMN blocks JSONB NOT NULL DEFAULT '[]';
  END IF;
END $$;

-- Ensure every proposal has at least one block
ALTER TABLE proposals DROP CONSTRAINT IF EXISTS blocks_not_empty;
ALTER TABLE proposals ADD CONSTRAINT blocks_not_empty CHECK (jsonb_array_length(blocks) > 0);
