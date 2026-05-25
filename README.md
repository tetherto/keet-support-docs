# Keet Support Docs

Static documentation site for [Keet](https://keet.io), built with [Fumadocs](https://fumadocs.dev) and migrated from [support.keet.io](https://support.keet.io/).

## Setup

`@tetherto/docs-seo-*` packages are published to GitHub Packages. Authenticate with a GitHub token that has `read:packages`, or copy `node_modules` from a working [pear-docs](https://github.com/tetherto/pear-apps-docs-migration) checkout:

```bash
# Option A: install (requires GitHub Packages auth in ~/.npmrc)
npm install

# Option B: reuse pear-docs dependencies locally
cp -R ../pear-docs/node_modules .

npm run postinstall
npx playwright install chromium
```

## Import content from GitBook

```bash
npm run import:gitbook
npm run import:media
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run serve
```

Static export is written to `out/`.

## Scripts

| Script | Description |
|--------|-------------|
| `import:gitbook` | Download pages from support.keet.io sitemap and write `content/*.mdx` |
| `import:media` | Resolve and download GitBook images/videos into `public/files/` |
