/** Redirect rules for static export postbuild stubs. */

export interface Redirect {
  from: string;
  to: string;
}

function withSlash(p: string): string {
  return p.endsWith('/') ? p : `${p}/`;
}

export function buildRedirects(): Redirect[] {
  return [
    {
      from: withSlash('/general-overview'),
      to: withSlash('/'),
    },
  ];
}

export function stubHtml(absoluteTo: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <meta http-equiv="refresh" content="0; url=${absoluteTo}">
  <link rel="canonical" href="${absoluteTo}">
  <meta name="robots" content="noindex">
</head>
<body>
  <p>This page has moved to <a href="${absoluteTo}">${absoluteTo}</a>.</p>
</body>
</html>
`;
}
