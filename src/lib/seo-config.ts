import type { DocsSeoConfig } from '@tetherto/docs-seo-next';

export function getDocsSeoConfig(): DocsSeoConfig {
  const origin =
    process.env.NEXT_PUBLIC_DOCS_ORIGIN ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://support.keet.io';

  return {
    metadataBase: new URL(origin),
    siteName: 'Keet Support',
    imageSiteLabel: 'Keet',
    publisherName: 'Holepunch',
    publisherLogoUrl: process.env.NEXT_PUBLIC_DOCS_PUBLISHER_LOGO_URL,
    trailingSlash: true,
  };
}
