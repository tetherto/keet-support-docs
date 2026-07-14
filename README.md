# Keet Support Docs

[This repository](https://github.com/tetherto/keet-support-docs) holds the static documentation site for [Keet](https://keet.io), built with [Fumadocs](https://fumadocs.dev).

## Setup

`@tetherto/docs-seo-*` packages are published to GitHub Packages. The repo includes `.npmrc` scoped to `@tetherto`; set a token before installing:

```bash
cp .env.example .env
# Add a GitHub classic PAT with read:packages to GITHUB_TOKEN in .env, then:
export $(grep -v '^#' .env | xargs)   # or: source .env if your shell supports it
npm install
npm run postinstall
```

If you cannot use GitHub Packages locally, copy `node_modules` from a working [pear-docs](https://github.com/tetherto/pear-apps-docs-migration) checkout instead of running `npm install`.

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
| `check:internal-links` | Validate internal links in `content/*.mdx` |
| `build:og` | Generate Open Graph images |
