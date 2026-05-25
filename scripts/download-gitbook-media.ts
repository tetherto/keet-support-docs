/**
 * Resolve GitBook /files/{id} assets by pairing markdown refs with rendered images.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, type BrowserContext } from 'playwright';

const BASE = 'https://support.keet.io';
const CONTENT_DIR = 'content';
const PUBLIC_FILES = 'public/files';
const MANIFEST_PATH = 'scripts/media-manifest.json';

const FILE_ID_RE = /\/files\/([A-Za-z0-9]+)/g;

function isLogoSrc(src: string): boolean {
  const lower = src.toLowerCase();
  return (
    lower.includes('logo') ||
    lower.includes('favico') ||
    lower.includes('keet%20logo') ||
    lower.includes('keet_favico')
  );
}

async function getMdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await getMdxFiles(p)));
    else if (e.name.endsWith('.mdx')) files.push(p);
  }
  return files;
}

function slugFromContentPath(filePath: string): string {
  const rel = filePath.replace(/^content\//, '').replace(/\.mdx$/, '');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) return `/${rel.slice(0, -6)}`;
  return `/${rel}`;
}

function extractFileIdsInOrder(text: string): string[] {
  const ids: string[] = [];
  const re = new RegExp(FILE_ID_RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) ids.push(m[1]);
  return ids;
}

function extFromContentType(ct: string | null): string {
  if (!ct) return '.png';
  if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('gif')) return '.gif';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('mp4')) return '.mp4';
  if (ct.includes('webm')) return '.webm';
  if (ct.includes('svg')) return '.svg';
  return '.png';
}

async function getContentImageUrls(
  context: BrowserContext,
  pageUrl: string,
): Promise<string[]> {
  const page = await context.newPage();
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 90_000 });
    await page.waitForTimeout(2500);

    const urls = await page.evaluate(() => {
      const article =
        document.querySelector('main') ??
        document.querySelector('article') ??
        document.body;
      return Array.from(article.querySelectorAll('img'))
        .map((img) => (img as HTMLImageElement).src)
        .filter(Boolean);
    });

    return urls.filter((src) => !isLogoSrc(src));
  } finally {
    await page.close();
  }
}

async function downloadAsset(url: string, destBase: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type');
  const ext = extFromContentType(ct);
  const outPath = `${destBase}${ext}`;
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buf);
  return ext;
}

async function rewriteMdxExtensions(idToExt: Map<string, string>): Promise<void> {
  const files = await getMdxFiles(CONTENT_DIR);
  for (const f of files) {
    let text = await readFile(f, 'utf-8');
    let changed = false;
    for (const [id, ext] of idToExt) {
      const re = new RegExp(`/files/${id}(?!\\.)`, 'g');
      if (re.test(text)) {
        text = text.replace(re, `/files/${id}${ext}`);
        changed = true;
      }
    }
    if (changed) await writeFile(f, text, 'utf-8');
  }
}

async function main() {
  const mdxFiles = await getMdxFiles(CONTENT_DIR);
  const pageToIds = new Map<string, string[]>();

  for (const f of mdxFiles) {
    const text = await readFile(f, 'utf-8');
    const ids = extractFileIdsInOrder(text);
    if (ids.length === 0) continue;
    const slug = slugFromContentPath(f);
    pageToIds.set(slug, ids);
  }

  const allIds = new Set<string>();
  for (const ids of pageToIds.values()) ids.forEach((id) => allIds.add(id));

  console.log(
    `${allIds.size} unique file IDs across ${pageToIds.size} pages with media\n`,
  );

  await mkdir(PUBLIC_FILES, { recursive: true });

  const idToUrl = new Map<string, string>();
  const manifest: Record<string, { url?: string; path?: string; error?: string; page?: string }> =
    {};

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
  for (const [slug, ids] of pageToIds) {
    const pageUrl = slug === '/' ? BASE : `${BASE}${slug}`;
    console.log(`  ${slug} (${ids.length} refs)`);
    const imageUrls = await getContentImageUrls(context, pageUrl);

    if (imageUrls.length < ids.length) {
      console.warn(
        `    warning: ${imageUrls.length} images vs ${ids.length} refs`,
      );
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (idToUrl.has(id)) continue;
      const url = imageUrls[i];
      if (!url) {
        manifest[id] = { error: 'no image at index', page: slug };
        continue;
      }
      idToUrl.set(id, url);
      manifest[id] = { url, page: slug };
    }
  }
  } finally {
    await context.close();
    await browser.close();
  }

  const idToExt = new Map<string, string>();

  for (const id of allIds) {
    const url = idToUrl.get(id);
    if (!url) {
      if (!manifest[id]) manifest[id] = { error: 'not mapped' };
      console.warn(`  ✗ ${id}`);
      continue;
    }
    try {
      const destBase = join(PUBLIC_FILES, id);
      const ext = await downloadAsset(url, destBase);
      idToExt.set(id, ext);
      manifest[id].path = `/files/${id}${ext}`;
      console.log(`  ✓ ${id}${ext}`);
    } catch (err) {
      manifest[id].error = String(err);
      console.warn(`  ✗ ${id}: ${err}`);
    }
  }

  await rewriteMdxExtensions(idToExt);
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  const failed = [...allIds].filter((id) => !idToExt.has(id)).length;
  console.log(`\nManifest: ${MANIFEST_PATH}`);
  console.log(`Downloaded ${idToExt.size}/${allIds.size}`);
  if (failed > 0) {
    console.error(`${failed} asset(s) failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
