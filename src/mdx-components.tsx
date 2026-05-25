import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { ImageGrid } from '@/components/ImageGrid';
import { Image } from '@/components/Image';
import { cn } from '@/lib/cn';

function MdxImg({
  className,
  srcSet,
  srcset,
  src,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { srcset?: string }) {
  const mergedClassName = cn('rounded-lg', className);
  const srcStr = typeof src === 'string' ? src : undefined;
  return (
    <ImageZoom src={srcStr} alt={alt ?? ''}>
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img
        {...rest}
        src={src}
        alt={alt}
        srcSet={srcSet ?? srcset}
        className={mergedClassName}
      />
    </ImageZoom>
  );
}

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
    img: MdxImg,
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
