import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import type { ImgHTMLAttributes } from 'react';
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

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: MdxImg,
    ImageGrid,
    Image,
    ...components,
  };
}
