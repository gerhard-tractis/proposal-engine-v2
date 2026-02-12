import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { ProposalSchema } from '../packages/shared/src/types/proposal.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from apps/agent/.env
config({ path: resolve(__dirname, '../apps/agent/.env') });

const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Usage: npx tsx scripts/save-proposal.ts <path-to-json-file>');
  process.exit(1);
}

// Read and parse JSON
let rawData: unknown;
try {
  const content = readFileSync(resolve(filePath), 'utf-8');
  rawData = JSON.parse(content);
} catch (err) {
  console.error(`❌ Failed to read/parse JSON file: ${(err as Error).message}`);
  process.exit(1);
}

// Validate against ProposalSchema
const result = ProposalSchema.safeParse(rawData);
if (!result.success) {
  console.error('❌ Zod validation failed:');
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

const proposal = result.data;

// Create Supabase admin client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/agent/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Insert into proposals table
async function save() {
  const { error } = await supabase.from('proposals').insert({
    slug: proposal.slug,
    token: proposal.token,
    status: 'published',
    client: proposal.client,
    metadata: proposal.metadata,
    blocks: proposal.blocks,
    published_at: new Date().toISOString(),
  });

  if (error) {
    console.error(`❌ Supabase insert failed: ${error.message}`);
    process.exit(1);
  }

  console.log(`✅ Proposal saved! URL: http://localhost:3000/proposals/${proposal.slug}/${proposal.token}`);
}

save();
