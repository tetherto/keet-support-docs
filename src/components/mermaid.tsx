import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { MermaidZoom } from './mermaid-zoom';

/**
 * Drop the SVG's fixed pixel `width`/`height` attributes so it scales with
 * its container (the `viewBox` keeps the aspect ratio). CSS in
 * `MermaidZoom` then constrains it to `max-width: 100%`.
 */
function makeResponsive(svg: string): string {
  return svg.replace(
    /<svg\b([^>]*)>/,
    (_match, attrs: string) =>
      `<svg${attrs.replace(/\s(?:width|height)="[^"]*"/g, '')}>`,
  );
}

/**
 * Render the chart to a responsive SVG string, or `null` if the Mermaid
 * source cannot be parsed. Kept apart from the component so no JSX is
 * built inside the try/catch.
 */
function renderChart(chart: string): string | null {
  try {
    const svg = renderMermaidSVG(chart, {
      bg: 'var(--color-fd-background)',
      fg: 'var(--color-fd-foreground)',
      interactive: true,
      transparent: true,
    });

    return makeResponsive(svg);
  } catch {
    return null;
  }
}

export async function Mermaid({ chart }: { chart: string }) {
  const svg = renderChart(chart);

  if (svg === null) {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }

  return <MermaidZoom svg={svg} />;
}
