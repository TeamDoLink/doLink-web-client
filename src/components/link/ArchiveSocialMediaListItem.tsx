import { CheckIcon } from '@/components/common/icons/checkIcon';

interface ArchiveSocialMediaListItemProps {
  title: string;
  category: string;
  itemCount: number;
  thumbnail?: string;
  isSelected?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
  highlightText?: string;
}

export default function ArchiveSocialMediaListItem({
  title,
  category,
  itemCount,
  thumbnail,
  isSelected = false,
  onPress,
  showDivider = true,
  highlightText,
}: ArchiveSocialMediaListItemProps) {
  return (
    <button onClick={onPress} className='w-full text-left outline-none'>
      <div
        className={`w-full flex-col items-center transition-colors ${
          isSelected ? 'bg-grey-50 py-3' : 'pt-3'
        }`}
      >
        {/* Info */}
        <div className='flex w-full flex-row items-center gap-4 px-5'>
          {/* Thumbnail */}
          <div className='h-[44px] w-[44px] shrink-0 overflow-hidden rounded-[10px]'>
            {thumbnail ? (
              <div className='relative h-full w-full'>
                <img
                  src={thumbnail}
                  alt={title}
                  className='h-full w-full object-cover'
                />
                <div className='absolute inset-0 bg-black/20' />
              </div>
            ) : (
              <div className='h-full w-full bg-grey-200' />
            )}
          </div>

          {/* Text */}
          <div className='flex min-w-0 flex-1 flex-col justify-center gap-[4px]'>
            {/* Title Row */}
            <div className='flex flex-row items-start gap-[16px]'>
              {/* Title */}
              <div className='flex-1 truncate py-[2px]'>
                <span className='text-[14px] font-semibold leading-[20px] text-grey-900'>
                  {isSelected &&
                  highlightText &&
                  title.startsWith(highlightText) ? (
                    <>
                      <span className='text-point'>{highlightText}</span>
                      {title.substring(highlightText.length)}
                    </>
                  ) : (
                    title
                  )}
                </span>
              </div>

              {/* Checkbox */}
              <div className='h-[24px] w-[24px] shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors'>
                {isSelected ? (
                  <div className='flex h-full w-full items-center justify-center bg-point'>
                    <CheckIcon width={14} height={14} className='text-white' />
                  </div>
                ) : (
                  <div className='h-full w-full rounded-full border-2 border-grey-300' />
                )}
              </div>
            </div>

            {/* Explanation */}
            <div className='flex flex-row items-center gap-[4px]'>
              <span className='text-[12px] font-medium leading-[18px] text-grey-500'>
                {category}
              </span>
              <span className='text-[12px] font-medium leading-[18px] text-grey-500'>
                ·
              </span>
              <span className='text-[12px] font-medium leading-[18px] text-grey-500'>
                할 일 {itemCount}개
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        {showDivider && !isSelected && (
          <div className='mt-3 w-full px-5'>
            <div className='h-px w-full bg-grey-100' />
          </div>
        )}
      </div>
    </button>
  );
}
