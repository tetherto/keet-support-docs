/**
 * Sanitizer for already-imported MDX (preserves /files/id.ext paths).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const CONTENT_DIR = 'content';

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

function splitFrontmatter(raw: string): { fm: string; body: string } | null {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { fm: match[1], body: match[2] };
}

function sanitizeBody(body: string): string {
  return body
    .replace(/\{%\s*stepper\s*%\}([\s\S]*?)\{%\s*endstepper\s*%\}/g, (_, block: string) => {
      const steps = block.match(/\{%\s*step\s*%\}([\s\S]*?)\{%\s*endstep\s*%\}/g);
      if (!steps) return block;
      return steps
        .map((step) =>
          step.replace(/\{%\s*step\s*%\}/, '').replace(/\{%\s*endstep\s*%\}/, '').trim(),
        )
        .join('\n\n---\n\n');
    })
    .replace(/\{%\s*stepper\s*%\}/g, '')
    .replace(/\{%\s*endstepper\s*%\}/g, '')
    .replace(/\{%\s*step\s*%\}/g, '')
    .replace(/\{%\s*endstep\s*%\}/g, '')
    .replace(/\{%\s*endtab\s*%\}/g, '')
    .replace(/\{%\s*tab[^%]*%\}/g, '')
    .replace(/\{%\s*endtabs\s*%\}/g, '')
    .replace(/\{%\s*tabs\s*%\}/g, '')
    .replace(/<https?:\/\/[^>]+>/g, (m) => {
      const url = m.slice(1, -1);
      return `[${url}](${url})`;
    })
    .replace(/^<pear:\/\/([^>]+)>$/gm, '[Join in Keet](pear://$1)')
    .replace(/<pear:\/\/([^>]+)>/g, '[pear://$1](pear://$1)')
    .replace(/\\\n/g, '\n')
    .replace(/\\$/gm, '')
    .replace(/<br>/gi, '<br />')
    .replace(/<mark[^>]*>([\s\S]*?)<\/mark>/gi, '$1')
    .replace(/\]\((\/[^)\s]+)\)/g, (match, path: string) => {
      const normalized = path.replace(/\.md(?=#|$)/, '');
      return normalized !== path ? `](${normalized})` : match;
    })
    .replace(/\[([^\]]+)\]\((\/[^)#]+)#[^)]+\)/g, '[$1]($2)')
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, '$1');
}

async function main() {
  const files = await getMdxFiles(CONTENT_DIR);
  for (const f of files) {
    const raw = await readFile(f, 'utf-8');
    const parts = splitFrontmatter(raw);
    if (!parts) continue;
    const sanitizedBody = sanitizeBody(parts.body);
    if (sanitizedBody === parts.body) continue;
    await writeFile(f, `---\n${parts.fm}\n---\n${sanitizedBody}`, 'utf-8');
    console.log(`  fixed ${f}`);
  }
}

main();
