import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { ImageGrid } from '@/components/ImageGrid';
import { Image } from '@/components/Image';
import { DocsImage } from '@/components/docs-image';

function normalizeHeading(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function getHeadingText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const props = children.props as { children?: ReactNode };
    return getHeadingText(props.children ?? '');
  }
  return '';
}

export function getMDXComponents(
  components?: MDXComponents & { pageTitle?: string },
): MDXComponents {
  const { pageTitle, ...rest } = components ?? {};
  const DefaultH1 = defaultMdxComponents.h1;

  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: DocsImage,
    ImageGrid,
    Image,
    h1: (props) => {
      if (
        pageTitle &&
        normalizeHeading(getHeadingText(props.children)) === normalizeHeading(pageTitle)
      ) {
        return null;
      }
      if (typeof DefaultH1 === 'function') {
        return <DefaultH1 {...props} />;
      }
      return <h1 {...props} />;
    },
    ...rest,
  };
}
