import { DocsImage } from '@/components/docs-image';

interface ImageGridProps {
  images: { src: string; alt: string; width?: number; height?: number }[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 not-prose">
      {images.map((img, i) => (
        <DocsImage
          key={i}
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          className="w-full"
        />
      ))}
    </div>
  );
}
