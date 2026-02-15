import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../apps/agent/.env') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const pattern = process.argv[2];
if (!pattern) {
  console.error('Usage: npx tsx scripts/delete-proposals.ts <slug-pattern>');
  console.error('Example: npx tsx scripts/delete-proposals.ts easy');
  process.exit(1);
}

async function main() {
  // Find matching proposals
  const { data, error } = await supabase
    .from('proposals')
    .select('slug, client')
    .ilike('slug', `%${pattern}%`);

  if (error) { console.error('Error:', error.message); process.exit(1); }
  if (!data || data.length === 0) { console.log('No proposals found matching:', pattern); return; }

  console.log(`Found ${data.length} proposal(s) matching "${pattern}":`);
  for (const p of data) {
    const name = (p.client as Record<string, unknown>)?.name || 'Unknown';
    console.log(`  - ${p.slug} (${name})`);
  }

  // Delete them
  const slugs = data.map(p => p.slug);
  const { error: delError } = await supabase
    .from('proposals')
    .delete()
    .in('slug', slugs);

  if (delError) { console.error('Delete error:', delError.message); process.exit(1); }
  console.log(`✅ Deleted ${slugs.length} proposal(s)`);
}

main();
