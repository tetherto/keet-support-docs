'use client';

import { cn } from '@/lib/cn';
import type * as PageTree from 'fumadocs-core/page-tree';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from '@fumadocs/docs-sidebar';
import { useFolderDepth } from '@fumadocs/sidebar-base';
import type { ReactNode } from 'react';

function normalizePath(url: string): string {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

function isActive(href: string, pathname: string): boolean {
  const h = normalizePath(href);
  const p = normalizePath(pathname);
  return h === p || p.startsWith(`${h}/`);
}

function getItemOffset(depth: number): string {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

const itemLinkClass = cn(
  'relative flex w-full min-w-0 flex-row items-start gap-2 rounded-md px-2 py-1.5 text-start',
  'text-[13px] font-normal leading-snug text-fd-muted-foreground/80',
  '[&_svg]:size-3.5 [&_svg]:shrink-0',
  'transition-colors hover:bg-white/5 hover:text-fd-foreground',
  'data-[active=true]:bg-transparent data-[active=true]:text-fd-primary',
);

const folderRowClass = cn(
  'w-full min-w-0 items-start gap-2',
  '[&_[data-icon]]:mt-0.5 [&_[data-icon]]:shrink-0 [&_[data-icon]]:text-neutral-500',
);

/** GitBook-style cyan bar on active nested items */
const itemLinkHighlightClass =
  "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-0.5 data-[active=true]:before:inset-y-1 data-[active=true]:before:start-0";

/** Same icon + title as Fumadocs default; keyed children for React. */
function SidebarLabel({ icon, name }: { icon?: ReactNode; name: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-1 items-start gap-2.5">
      {icon != null ? (
        <span key="sidebar-icon" className="mt-0.5 shrink-0 [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      <span key="sidebar-name" className="min-w-0 flex-1 break-words leading-snug">
        {name}
      </span>
    </span>
  );
}

export function SidebarTreeFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const path = useTreePath();
  const label = <SidebarLabel icon={item.icon} name={item.name} />;

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={path.includes(item)}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          external={item.index.external}
          className={folderRowClass}
        >
          {label}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={folderRowClass}>{label}</SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

/** Single child inside Link — avoids Fumadocs SidebarItem `[icon, children]` array. */
export function SidebarTreeItem({ item }: { item: PageTree.Item }) {
  const depth = useFolderDepth();
  const pathname = usePathname();
  const active = isActive(item.url, pathname);

  return (
    <Link
      href={item.url}
      external={item.external}
      data-active={active}
      className={cn(itemLinkClass, depth >= 1 && itemLinkHighlightClass)}
      style={{ paddingInlineStart: getItemOffset(depth) }}
    >
      <SidebarLabel icon={item.icon} name={item.name} />
    </Link>
  );
}
