import { SectionCard } from '@/components/section-card';
import { Cards } from 'fumadocs-ui/components/card';
import type { SectionIndexItem } from '@/lib/section-index';

export function SectionIndexCards({ items }: { items: SectionIndexItem[] }) {
  return (
    <Cards className="mb-8">
      {items.map((item) => (
        <SectionCard
          key={item.href}
          href={item.href}
          title={item.title}
          description={item.description}
        />
      ))}
    </Cards>
  );
}
