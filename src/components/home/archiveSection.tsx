import { List } from '@/components/common';
import type { ArchiveItem } from '@/types';

type ArchiveSectionProps = {
  items: ArchiveItem[];
  onRequestDelete?: (id: string) => void;
  className?: string;
};

/**
 * 홈 화면 하단 모음 리스트 섹션
 */
export const ArchiveSection = ({
  items,
  onRequestDelete,
  className = '',
}: ArchiveSectionProps) => {
  const handleDeleteClick = (id: string) => {
    onRequestDelete?.(id);
  };

  return (
    <section className={`mt-7 space-y-4 pb-20 ${className}`}>
      <h2 className='text-heading-sm text-black'>모음</h2>
      <div className='space-y-3'>
        {items.map(({ id, title, category, itemCount, images }) => (
          <List.ArchiveCard
            key={id}
            title={title}
            category={category}
            itemCount={itemCount}
            images={images}
            width='w-full'
            onDeleteClick={() => handleDeleteClick(id)}
          />
        ))}
      </div>
    </section>
  );
};
