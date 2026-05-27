import type { Node } from 'fumadocs-core/page-tree';
import { customTree } from '@/lib/custom-tree';
import { source } from '@/lib/source';

export type SectionIndexItem = {
  title: string;
  href: string;
  description?: string;
};

function normalizeUrl(url: string): string {
  if (url === '/') return url;
  return url.replace(/\/$/, '');
}

function urlToSlugs(url: string): string[] {
  return url.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
}

function cleanDescription(description: string): string {
  return description
    .replace(/^\*+\s*/, '')
    .replace(/^-\s+/, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPageNode(node: Node): node is Node & { type: 'page'; url: string; name: string } {
  return node.type === 'page';
}

/** Child pages for a folder index URL (e.g. `/keet-groups`), or null if not a section index. */
export function getSectionIndexChildren(pageUrl: string): SectionIndexItem[] | null {
  const url = normalizeUrl(pageUrl);

  for (const node of customTree) {
    if (node.type !== 'folder' || !node.index || normalizeUrl(node.index.url) !== url) {
      continue;
    }
    if (!node.children?.length) return null;

    return node.children.filter(isPageNode).map((child) => {
      const docPage = source.getPage(urlToSlugs(child.url));
      const raw = docPage?.data.description;
      return {
        title: child.name,
        href: child.url,
        description: raw ? cleanDescription(raw) : undefined,
      };
    });
  }

  return null;
}
