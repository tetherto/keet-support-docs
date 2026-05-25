import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const MANIFEST = 'scripts/media-manifest.json';

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

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf-8')) as Record<
    string,
    { path?: string }
  >;
  const idToExt = new Map<string, string>();
  for (const [id, meta] of Object.entries(manifest)) {
    if (meta.path) {
      const ext = meta.path.replace(`/files/${id}`, '');
      idToExt.set(id, ext);
    }
  }

  for (const f of await getMdxFiles('content')) {
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
  console.log('Reapplied extensions from manifest.');
}

main();
