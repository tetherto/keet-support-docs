'use client';

import { KeyedNextLink } from '@/components/keyed-next-link';
import SearchDialog from '@/components/search';
import type { Framework } from 'fumadocs-core/framework';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ SearchDialog }}
      theme={{ defaultTheme: 'dark', enableSystem: true }}
      components={{ Link: KeyedNextLink as NonNullable<Framework['Link']> }}
    >
      {children}
    </RootProvider>
  );
}
