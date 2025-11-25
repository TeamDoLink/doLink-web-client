import imgEditIcon from '@/assets/icons/common/edit-24.svg';
import imgDeleteIcon from '@/assets/icons/common/delete.svg';
import imgMoreIcon from '@/assets/icons/common/option-24.svg';

export type ArchiveCardProps = {
  type?: 'default' | 'edit';
  title?: string;
  category?: string;
  itemCount?: number;
  width?: string;
  images?: string[];
  onMoreClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
};

export default function ArchiveCard({
  type = 'default',
  title = '보관된 프로젝트',
  category = '기타',
  itemCount = 1,
  width = 'w-full',
  images = [],
  onMoreClick,
  onEditClick,
  onDeleteClick,
}: ArchiveCardProps) {
  // 항상 4개의 슬롯을 생성 (이미지가 있으면 표시, 없으면 배경만)
  const slots = Array.from({ length: 4 }, (_, index) => images[index]);

  return (
    <div
      className={`flex ${width} items-start gap-3 rounded-xl bg-white p-3 pl-3 pr-4 shadow-sm`}
    >
      <div className='flex min-h-0 min-w-0 flex-1 items-center gap-4'>
        <div className='grid size-[60px] shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-[9.6px]'>
          {slots.map((imageSrc, index) => (
            <div
              key={index}
              className='relative overflow-hidden rounded-[4px] bg-black/20'
            >
              {imageSrc && (
                <img
                  alt={`thumbnail-${index}`}
                  className='absolute inset-0 size-full object-cover'
                  src={imageSrc}
                />
              )}
            </div>
          ))}
        </div>
        <div className='flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center gap-1'>
          <p className='w-full truncate text-body-lg text-black'>{title}</p>
          <div className='flex items-center gap-1 text-caption-sm text-grey-500'>
            <p className='shrink-0'>{category}</p>
            <p className='shrink-0'>·</p>
            <p className='shrink-0'>할 일 {itemCount}개</p>
          </div>
        </div>
      </div>

      {type === 'default' ? (
        <button
          onClick={onMoreClick}
          className='flex h-6 w-6 flex-shrink-0 items-center justify-center pt-[7px]'
        >
          <img alt='more' className='h-6 w-6' src={imgMoreIcon} />
        </button>
      ) : (
        <div className='flex flex-shrink-0 items-center gap-2.5 pt-[7px]'>
          <button
            onClick={onEditClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center'
          >
            <img alt='edit' className='h-5 w-5' src={imgEditIcon} />
          </button>
          <button
            onClick={onDeleteClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center'
          >
            <img alt='delete' className='h-5 w-5' src={imgDeleteIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
