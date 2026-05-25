/**
 * Import Keet Support docs from support.keet.io (GitBook markdown export).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const SITEMAP_URL = 'https://support.keet.io/sitemap.md';
const BASE = 'https://support.keet.io';
const CONTENT_DIR = 'content';

const AGENT_BLOCK =
  /---\s*\n# Agent Instructions: Querying This Documentation[\s\S]*$/;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function transformHints(body: string): string {
  const hintMap: Record<string, string> = {
    warning: 'warn',
    info: 'info',
    success: 'info',
    danger: 'error',
  };

  return body.replace(
    /\{%\s*hint\s+style="([^"]+)"\s*%\}([\s\S]*?)\{%\s*endhint\s*%\}/g,
    (_, style: string, inner: string) => {
      const type = hintMap[style] ?? 'info';
      const trimmed = inner.trim();
      return `<Callout type="${type}">\n${trimmed}\n</Callout>`;
    },
  );
}

function transformTabs(body: string): string {
  return body.replace(/\{%\s*tabs\s*%\}([\s\S]*?)\{%\s*endtabs\s*%\}/g, (_, block: string) => {
    const tabs: { title: string; content: string }[] = [];
    const tabRe = /\{%\s*tab\s+title="([^"]+)"\s*%\}([\s\S]*?)(?=\{%\s*tab\s+title=|\{%\s*endtab|\{%\s*endtabs|$)/g;
    let m: RegExpExecArray | null;
    while ((m = tabRe.exec(block)) !== null) {
      let content = m[2].replace(/\{%\s*endtab\s*%\}/g, '').trim();
      tabs.push({ title: m[1], content });
    }
    if (tabs.length === 0) return block;

    const items = tabs.map((t) => JSON.stringify(t.title)).join(', ');
    const tabNodes = tabs
      .map(
        (t) =>
          `<Tab value=${JSON.stringify(t.title)}>\n\n${t.content}\n\n</Tab>`,
      )
      .join('\n');
    return `<Tabs items={[${items}]}>\n${tabNodes}\n</Tabs>`;
  });
}

function transformStepper(body: string): string {
  return body.replace(
    /\{%\s*stepper\s*%\}([\s\S]*?)\{%\s*endstepper\s*%\}/g,
    (_, block: string) => {
      const steps = block.match(
        /\{%\s*step\s*%\}([\s\S]*?)\{%\s*endstep\s*%\}/g,
      );
      if (!steps) return block;
      return steps
        .map((step) =>
          step
            .replace(/\{%\s*step\s*%\}/, '')
            .replace(/\{%\s*endstep\s*%\}/, '')
            .trim(),
        )
        .join('\n\n---\n\n');
    },
  );
}

function sanitizeMdx(body: string): string {
  return (
    body
      .replace(/\{%\s*stepper\s*%\}/g, '')
      .replace(/\{%\s*endstepper\s*%\}/g, '')
      .replace(/\{%\s*step\s*%\}/g, '')
      .replace(/\{%\s*endstep\s*%\}/g, '')
      // Remove any leftover GitBook tags
      .replace(/\{%\s*endtab\s*%\}/g, '')
      .replace(/\{%\s*tab[^%]*%\}/g, '')
      .replace(/\{%\s*endtabs\s*%\}/g, '')
      .replace(/\{%\s*tabs\s*%\}/g, '')
      // Autolink-style angle brackets break MDX
      .replace(/<https?:\/\/[^>]+>/g, (m) => {
        const url = m.slice(1, -1);
        return `[${url}](${url})`;
      })
      // pear:// deep links on their own line
      .replace(/^<pear:\/\/([^>]+)>$/gm, '[Join in Keet](pear://$1)')
      .replace(/<pear:\/\/([^>]+)>/g, '[pear://$1](pear://$1)')
      // Line-break continuations from GitBook
      .replace(/\\\n/g, '\n')
      .replace(/\\$/gm, '')
      // HTML line breaks
      .replace(/<br>/gi, '<br />')
      // GitBook colored highlights — style strings break MDX
      .replace(/<mark[^>]*>([\s\S]*?)<\/mark>/gi, '$1')
  );
}

function transformFigures(body: string): string {
  return body
    .replace(
      /<figure><img\s+src="([^"]+)"(?:\s+alt="([^"]*)")?(?:\s+width="[^"]*")?\s*><figcaption><\/figcaption><\/figure>/gi,
      (_, src: string, alt?: string) => `![${alt ?? ''}](${src})`,
    )
    .replace(
      /<figure><img\s+src="([^"]+)"(?:\s+alt="([^"]*)")?[^>]*><\/figure>/gi,
      (_, src: string, alt?: string) => `![${alt ?? ''}](${src})`,
    );
}

function normalizeDividers(body: string): string {
  return body.replace(/^\*\*\*$/gm, '---');
}

function fixInternalLinks(body: string): string {
  return body
    .replace(/\]\((\/[^)\s]+)\)/g, (match, path: string) => {
      const normalized = path.replace(/\.md(?=#|$)/, '');
      if (normalized !== path) {
        return `](${normalized})`;
      }
      return match;
    })
    .replace(/\[([^\]]+)\]\((\/[^)#]+)#[^)]+\)/g, '[$1]($2)')
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, '$1');
}

function extractTitle(body: string): string | null {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function extractDescription(body: string, title: string): string {
  const lines = body.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('<') || t.startsWith('{%') || t.startsWith('---')) continue;
    if (t.startsWith('|') || t.startsWith('* ') || t.startsWith('- ')) continue;
    const plain = t
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length < 20) continue;
    const desc = plain.slice(0, 160).trim();
    return desc.length < plain.length ? `${desc}…` : desc;
  }
  return `Keet Support: ${title}`;
}

function urlToContentPath(url: string): string {
  const u = new URL(url);
  let slug = u.pathname.replace(/^\//, '').replace(/\/$/, '').replace(/\.md$/, '');
  if (!slug || slug === 'general-overview') {
    return join(CONTENT_DIR, 'index.mdx');
  }
  if (!slug.includes('/')) {
    return join(CONTENT_DIR, slug, 'index.mdx');
  }
  return join(CONTENT_DIR, `${slug}.mdx`);
}

function isSectionIndex(url: string): boolean {
  const u = new URL(url);
  const parts = u.pathname.replace(/^\//, '').replace(/\/$/, '').split('/');
  return parts.length === 1 && parts[0] !== 'general-overview';
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.text();
}

async function parseSitemap(): Promise<string[]> {
  const md = await fetchText(SITEMAP_URL);
  const urls: string[] = [];
  for (const m of md.matchAll(/\((https:\/\/support\.keet\.io\/[^)]+\.md)\)/g)) {
    const url = m[1];
    if (!url.includes('?ask')) urls.push(url);
  }
  return [...new Set(urls)];
}

function buildFrontmatter(
  title: string,
  description: string,
  isIndex: boolean,
): string {
  const docType = isIndex ? 'page' : 'faq';
  const schemaType = isIndex ? 'WebPage' : 'TechArticle';
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `---
title: "${esc(title)}"
description: "${esc(description)}"
docType: ${docType}
schemaType: ${schemaType}
---

`;
}

async function main() {
  const urls = await parseSitemap();
  console.log(`Importing ${urls.length} pages from GitBook…\n`);

  for (const url of urls) {
    const raw = await fetchText(url);
    let body = raw.replace(AGENT_BLOCK, '').trim();
    body = decodeHtmlEntities(body);
    body = transformHints(body);
    body = transformTabs(body);
    body = transformStepper(body);
    body = transformFigures(body);
    body = normalizeDividers(body);
    body = fixInternalLinks(body);
    body = sanitizeMdx(body);

    const title = extractTitle(body) ?? 'Untitled';
    const description = extractDescription(body, title);
    const outPath = urlToContentPath(url);
    const isIndex =
      outPath.endsWith('index.mdx') && !url.includes('general-overview');

    const frontmatter = buildFrontmatter(title, description, isIndex);
    const full = frontmatter + body + '\n';

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, full, 'utf-8');
    console.log(`  ✓ ${url} → ${outPath}`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
