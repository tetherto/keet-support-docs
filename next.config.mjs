import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    '@tetherto/docs-seo-schema',
    '@tetherto/docs-seo-core',
    '@tetherto/docs-seo-next',
    '@tetherto/docs-seo-og',
  ],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  turbopack: {
    root: import.meta.dirname,
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/general-overview',
        destination: '/',
        permanent: true,
      },
      {
        source: '/technical-support-and-troubleshooting/profile-recovery',
        destination: '/technical-support-and-troubleshooting/recover-a-profile',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
