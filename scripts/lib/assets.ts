import { createClient } from '@supabase/supabase-js';
import type { AssetManifest } from '../../packages/shared/src/types/proposal.js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  'image/svg+xml': 'svg',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Download an image from URL and upload to Supabase Storage.
 * Returns the storage path.
 */
async function downloadAndUpload(
  imageUrl: string,
  storagePath: string
): Promise<string> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to download ${imageUrl}: ${res.status}`);

  const contentType = res.headers.get('content-type')?.split(';')[0] || 'image/png';
  const ext = CONTENT_TYPE_MAP[contentType] || 'png';
  const finalPath = `${storagePath}.${ext}`;

  const buffer = Buffer.from(await res.arrayBuffer());
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from('proposal-assets')
    .upload(finalPath, buffer, { contentType, upsert: true });

  if (error) throw new Error(`Storage upload failed for ${finalPath}: ${error.message}`);

  return finalPath;
}

/**
 * Upload client assets (logo, favicon) and ensure Tractis logo exists.
 * Returns an AssetManifest with exact Storage paths.
 */
export async function uploadClientAssets(
  slug: string,
  logoUrl: string,
  faviconUrl: string | null
): Promise<AssetManifest> {
  // Upload client logo
  const clientLogo = await downloadAndUpload(logoUrl, `${slug}/logo`);
  console.log(`  ✓ Uploaded client logo: ${clientLogo}`);

  // Upload client favicon if available
  let clientFavicon: string | undefined;
  if (faviconUrl) {
    try {
      clientFavicon = await downloadAndUpload(faviconUrl, `${slug}/favicon`);
      console.log(`  ✓ Uploaded client favicon: ${clientFavicon}`);
    } catch (err) {
      console.warn(`  ⚠ Favicon upload failed, skipping:`, (err as Error).message);
    }
  }

  // Ensure Tractis logo exists
  const supabase = getSupabase();
  const tractisPath = 'tractis/logo.svg';
  const { data: existing } = await supabase.storage
    .from('proposal-assets')
    .list('tractis', { limit: 1, search: 'logo.svg' });

  if (!existing || existing.length === 0) {
    // Upload Tractis logo from local public assets
    const { readFileSync } = await import('fs');
    const { resolve, dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const tractisLogoPath = resolve(__dirname, '../../apps/web/public/logos/tractis-white.svg');

    try {
      const logoBuffer = readFileSync(tractisLogoPath);
      await supabase.storage
        .from('proposal-assets')
        .upload(tractisPath, logoBuffer, { contentType: 'image/svg+xml', upsert: true });
      console.log(`  ✓ Uploaded Tractis logo: ${tractisPath}`);
    } catch (err) {
      console.warn(`  ⚠ Tractis logo upload failed:`, (err as Error).message);
    }
  }

  return {
    clientLogo,
    clientFavicon,
    tractisLogo: tractisPath,
  };
}
