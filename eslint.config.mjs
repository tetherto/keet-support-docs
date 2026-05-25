import next from 'eslint-config-next';

const config = [
  ...next,
  {
    ignores: ['.source/**', 'public/og/**', 'out/**'],
  },
  {
    files: ['scripts/**/*.{ts,tsx,mts,cts,js,mjs,cjs}'],
    rules: {
      'react/jsx-key': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/alt-text': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
