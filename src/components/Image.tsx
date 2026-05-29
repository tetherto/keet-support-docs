import { cn } from '@/lib/cn';
import { DocsImage } from '@/components/docs-image';

interface ImageProps {
  src: string;
  alt: string;
  size?: 'mobile' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  width?: number;
  height?: number;
}

const sizes = {
  mobile: 'max-w-[300px]',
  sm: 'max-w-[192px]',
  md: 'max-w-[256px]',
  lg: 'max-w-[320px]',
  full: 'w-full',
};

export function Image({
  src,
  alt,
  size = 'full',
  className = '',
  width,
  height,
}: ImageProps) {
  return (
    <DocsImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(sizes[size], className)}
    />
  );
}
