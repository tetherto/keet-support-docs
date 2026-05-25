import Link from 'fumadocs-core/link';
import { cn } from '@/lib/cn';

type SectionCardProps = {
  href: string;
  title: string;
  description?: string;
};

/** Same title/description as Fumadocs Card; single child inside Link for valid keys. */
export function SectionCard({ href, title, description }: SectionCardProps) {
  return (
    <Link
      href={href}
      data-card
      className={cn(
        'block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full',
        'hover:bg-fd-accent/80',
      )}
    >
      <span className="flex flex-col gap-0">
        <span className="not-prose mb-1 text-sm font-medium">{title}</span>
        {description ? (
          <span className="my-0! text-sm text-fd-muted-foreground">{description}</span>
        ) : null}
      </span>
    </Link>
  );
}
