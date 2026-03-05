import { List } from '@/components/common';
import {
  ARCHIVE_CATEGORY_LABEL,
  type ArchiveCategoryKey,
} from '@/utils/archiveCategory';
import type { ArchiveItem } from '@/types';

type ArchiveSectionItem = ArchiveItem & {
  previewImages?: string[];
};

type ArchiveSectionProps = {
  items: ArchiveSectionItem[];
  onRequestDelete?: (id: string) => void;
  onRequestEdit?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
};

/**
 * 홈 화면 하단 모음 리스트 섹션
 */
export const ArchiveSection = ({
  items,
  onRequestDelete,
  onRequestEdit,
  onClick,
  className = '',
}: ArchiveSectionProps) => {
  const handleEditClick = (id: string) => {
    onRequestEdit?.(id);
  };

  const handleDeleteClick = (id: string) => {
    onRequestDelete?.(id);
  };

  const handleClick = (id: string) => {
    onClick?.(id);
  };

  return (
    <section className={`${className}`}>
      <h2 className='mb-2 py-2 text-heading-sm text-black'>모음</h2>
      <div className='space-y-3'>
        {items.map(
          ({ id, title, category, itemCount, previewImages, isTutorial }) => {
            const label =
              ARCHIVE_CATEGORY_LABEL[category as ArchiveCategoryKey] ??
              category;

            return (
              <List.ArchiveCard
                key={id}
                title={title}
                category={label}
                itemCount={itemCount}
                images={previewImages}
                width='w-full'
                isTutorial={isTutorial}
                onClick={() => handleClick(id)}
                onEditClick={() => handleEditClick(id)}
                onDeleteClick={() => handleDeleteClick(id)}
              />
            );
          }
        )}
      </div>
    </section>
  );
};
