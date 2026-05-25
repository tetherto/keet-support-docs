'use client';

import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { SidebarTrigger } from 'fumadocs-ui/components/sidebar/base';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { renderTitleNav } from 'fumadocs-ui/layouts/shared';
import { Search, Sidebar } from 'lucide-react';
import type { ReactNode } from 'react';

function DocsSearchBar({ className }: { className?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();

  if (!enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      className={cn(
        'inline-flex w-full items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={() => setOpenSearch(true)}
    >
      <Search className="size-4 shrink-0" />
      {text.search}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd
            key={i}
            className="rounded-md border bg-fd-background px-1.5"
          >
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  );
}

type DocsTopHeaderProps = {
  title: ReactNode;
};

export function DocsTopHeader({ title }: DocsTopHeaderProps) {
  return (
    <header
      id="nd-subnav"
      data-transparent={false}
      className={cn(
        '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center gap-3 border-b',
        'ps-4 pe-2.5 backdrop-blur-sm h-(--fd-header-height)',
        'layout:[--fd-header-height:3.5rem] max-md:layout:[--fd-header-height:3.5rem]',
        'bg-fd-background/80 dark:bg-black/90 dark:border-[hsla(187,20%,28%,0.35)]',
      )}
    >
      <div className="shrink-0 md:hidden">
        {renderTitleNav(
          { title },
          { className: 'inline-flex items-center gap-2.5 font-semibold' },
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center md:max-w-lg">
        <DocsSearchBar className="h-9 border-[hsla(187,20%,28%,0.35)] bg-[hsl(0,0%,8%)] dark:bg-[hsl(0,0%,8%)]" />
      </div>

      <SidebarTrigger
        className={cn(
          buttonVariants({
            color: 'ghost',
            size: 'icon-sm',
            className: 'p-2 md:hidden',
          }),
        )}
      >
        <Sidebar />
      </SidebarTrigger>
    </header>
  );
}
