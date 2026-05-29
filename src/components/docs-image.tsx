'use client';

import { cn } from '@/lib/cn';
import { figureDisplayWidth } from '@/lib/figure-display-width';
import { lookupImageDimensions } from '@/lib/image-dimensions.generated';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from 'react';

function resolveDisplayWidth(
  src: string | undefined,
  naturalWidth?: number,
  naturalHeight?: number,
): number | undefined {
  if (naturalWidth && naturalHeight) {
    return figureDisplayWidth(naturalWidth, naturalHeight);
  }

  if (!src) return undefined;

  const dimensions = lookupImageDimensions(src);
  if (!dimensions) return undefined;

  return figureDisplayWidth(dimensions.width, dimensions.height);
}

export function DocsImage({
  className,
  srcSet,
  srcset,
  src,
  alt,
  width,
  height,
  style,
  onLoad,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { srcset?: string }) {
  const srcStr = typeof src === 'string' ? src : undefined;
  const imgRef = useRef<HTMLImageElement>(null);

  const [displayWidth, setDisplayWidth] = useState<number | undefined>(() => {
    if (typeof width === 'number') return width;
    return resolveDisplayWidth(srcStr);
  });

  const applyDisplayWidth = useCallback(
    (naturalWidth: number, naturalHeight: number) => {
      const next = figureDisplayWidth(naturalWidth, naturalHeight);
      setDisplayWidth((current) => (current === next ? current : next));
    },
    [],
  );

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      applyDisplayWidth(img.naturalWidth, img.naturalHeight);
    }
  }, [srcStr, applyDisplayWidth]);

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      onLoad?.(event);
      const img = event.currentTarget;
      if (img.naturalWidth > 0) {
        applyDisplayWidth(img.naturalWidth, img.naturalHeight);
      }
    },
    [onLoad, applyDisplayWidth],
  );

  const imgStyle = displayWidth
    ? { ...style, width: displayWidth, height: 'auto', maxWidth: '100%' }
    : style;

  return (
    <ImageZoom src={srcStr} alt={alt ?? ''}>
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img
        {...rest}
        ref={imgRef}
        src={src}
        alt={alt}
        width={displayWidth ?? width}
        height={displayWidth && height ? undefined : height}
        srcSet={srcSet ?? srcset}
        onLoad={handleLoad}
        style={imgStyle}
        className={cn(
          'block h-auto max-w-full rounded-lg',
          displayWidth ? undefined : 'w-auto',
          className,
        )}
      />
    </ImageZoom>
  );
}
