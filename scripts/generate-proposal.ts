import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import Anthropic from '@anthropic-ai/sdk';
import { DesignSystemSchema, SectionBlueprintSchema } from '../packages/shared/src/types/proposal.js';
import { scrapeBrand } from './lib/brand.js';
import { uploadClientAssets } from './lib/assets.js';
import { compileTailwind } from './lib/tailwind.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from apps/agent/.env
config({ path: resolve(__dirname, '../apps/agent/.env') });

// ─── CLI Args ───

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const val = args[i + 1];
    if (key && val) parsed[key] = val;
  }
  return parsed;
}

const args = parseArgs();
const docPath = args.doc;
const clientName = args.client;
const clientUrl = args.url;
const logoOverride = args.logo;
const faviconOverride = args.favicon;

if (!docPath || !clientName || !clientUrl) {
  console.error('Usage: npx tsx scripts/generate-proposal.ts --doc <path> --client <name> --url <website> [--logo <url>] [--favicon <url>]');
  process.exit(1);
}

// ─── Setup ───

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/agent/.env');
  process.exit(1);
}
if (!anthropicKey) {
  console.error('Missing ANTHROPIC_API_KEY in apps/agent/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

const slugBase = clientName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const slug = `${slugBase}-${nanoid(6)}`;
const token = nanoid(10);
const proposalDoc = readFileSync(resolve(docPath), 'utf-8');

function loadPrompt(filename: string): string {
  return readFileSync(resolve(__dirname, '../apps/agent/prompts', filename), 'utf-8');
}

async function callAgent(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 8192,
  retries: number = 1
): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      if (response.stop_reason !== 'end_turn') {
        console.warn(`  ⚠ Agent response may be truncated (stop_reason: ${response.stop_reason})`);
      }

      return text;
    } catch (err) {
      if (attempt < retries) {
        console.warn(`  ⚠ Agent call failed, retrying... (${(err as Error).message})`);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

function extractJson(text: string): string {
  // Extract JSON from markdown code blocks — prefer json-tagged blocks, use last match
  const jsonBlocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (jsonBlocks.length > 0) {
    return jsonBlocks[jsonBlocks.length - 1][1].trim();
  }
  const anyBlocks = [...text.matchAll(/```\s*([\s\S]*?)```/g)];
  if (anyBlocks.length > 0) {
    // Find first block that looks like JSON
    for (const block of anyBlocks) {
      const content = block[1].trim();
      if (content.startsWith('{') || content.startsWith('[')) return content;
    }
  }
  return text.trim();
}

// ─── Pipeline ───

async function run() {
  console.log(`\n🚀 Generating proposal for ${clientName}`);
  console.log(`   Slug: ${slug} | Token: ${token}\n`);

  // Step 1: Scrape brand
  console.log('Step 1: Scraping brand from', clientUrl);
  let brandData = { colors: [] as string[], favicon: null as string | null, raw: '' };
  try {
    brandData = await scrapeBrand(clientUrl);
    console.log(`  ✓ Found ${brandData.colors.length} colors, favicon: ${brandData.favicon ? 'yes' : 'no'}`);
  } catch (err) {
    console.warn('  ⚠ Brand scraping failed, continuing with defaults:', (err as Error).message);
  }

  // Step 2: Upload assets
  console.log('Step 2: Uploading client assets');
  const logoUrl = logoOverride || brandData.favicon || `${clientUrl}/favicon.ico`;
  const faviconUrl = faviconOverride || brandData.favicon;
  const assetManifest = await uploadClientAssets(slug, logoUrl, faviconUrl);
  console.log('  ✓ Assets uploaded');

  // Step 3: Agent 1 — Brand Designer
  console.log('Step 3: Agent 1 — Brand Designer');
  const brandPrompt = loadPrompt('agent-1-brand-designer.md');
  const designSystemRaw = await callAgent(brandPrompt, JSON.stringify({
    url: clientUrl,
    colors: brandData.colors,
    favicon: brandData.favicon,
    raw: brandData.raw,
  }));
  const designSystem = DesignSystemSchema.parse(JSON.parse(extractJson(designSystemRaw)));
  console.log(`  ✓ Design system: ${designSystem.mood} / ${designSystem.theme}`);

  // Step 4: Agent 2 — Architect
  console.log('Step 4: Agent 2 — Proposal Architect');
  const architectPrompt = loadPrompt('agent-2-architect.md');
  const architectureRaw = await callAgent(architectPrompt, JSON.stringify({
    designSystem,
    proposalMarkdown: proposalDoc,
  }));
  const sections = SectionBlueprintSchema.array().parse(JSON.parse(extractJson(architectureRaw)));
  console.log(`  ✓ Architecture: ${sections.length} sections`);

  // Step 5: Agent 3 — HTML Builder
  console.log('Step 5: Agent 3 — HTML Builder');
  const builderPrompt = loadPrompt('agent-3-html-builder.md');
  let html = await callAgent(builderPrompt, JSON.stringify({
    architecture: sections,
    designSystem,
    proposalMarkdown: proposalDoc,
  }), 16384);

  // Extract HTML from possible markdown code block
  const htmlMatch = html.match(/```html\s*([\s\S]*?)```/);
  if (htmlMatch) html = htmlMatch[1].trim();
  console.log(`  ✓ HTML generated: ${html.length} chars`);

  // Step 6: Agent 4 — Polish
  console.log('Step 6: Agent 4 — Polish & QA');
  try {
    const polishPrompt = loadPrompt('agent-4-polish.md');
    let polished = await callAgent(polishPrompt, html, 16384);
    const polishMatch = polished.match(/```html\s*([\s\S]*?)```/);
    if (polishMatch) polished = polishMatch[1].trim();
    html = polished;
    console.log(`  ✓ Polished: ${html.length} chars`);
  } catch (err) {
    console.warn('  ⚠ Polish agent failed, using raw HTML:', (err as Error).message);
  }

  // Step 7: Compile Tailwind
  console.log('Step 7: Compiling Tailwind CSS');
  html = await compileTailwind(html);
  console.log(`  ✓ Tailwind compiled, final HTML: ${html.length} chars`);

  // Step 8: Upload HTML to Storage
  console.log('Step 8: Uploading HTML to Storage');
  const htmlPath = `${slug}.html`;
  const { error: uploadError } = await supabase.storage
    .from('proposals')
    .upload(htmlPath, Buffer.from(html, 'utf-8'), {
      contentType: 'text/html',
      upsert: true,
    });
  if (uploadError) throw new Error(`HTML upload failed: ${uploadError.message}`);
  console.log(`  ✓ Uploaded: ${htmlPath}`);

  // Step 9: Insert DB record
  console.log('Step 9: Creating database record');
  const { error: dbError } = await supabase.from('proposals').insert({
    slug,
    token,
    client_name: clientName,
    client_url: clientUrl,
    status: 'draft',
    html_path: htmlPath,
    asset_manifest: assetManifest,
  });
  if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);

  // Step 10: Done
  const url = `https://proposal.tractis.ai/proposals/${slug}/${token}`;
  console.log(`\n✅ Proposal generated!`);
  console.log(`   URL: ${url}`);
  console.log(`   Local: http://localhost:3001/proposals/${slug}/${token}\n`);
}

run().catch((err) => {
  console.error('\n❌ Pipeline failed:', err.message || err);
  process.exit(1);
});
