import { DocsTopHeader } from '@/components/docs-top-header';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const gitConfig = {
  user: 'tetherto',
  repo: 'keet-support-docs',
  branch: 'main',
};

const navTitle = (
  <span className="inline-flex items-center gap-2.5">
    <Image src="/keet.svg" alt="Keet" width={24} height={24} />
    Keet Support
  </span>
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: navTitle,
      component: <DocsTopHeader title={navTitle} />,
    },
    searchToggle: {
      components: {
        // `null` does not work — Fumadocs uses `??` and falls back to LargeSearchToggle
        lg: false,
      },
    },
  };
}
