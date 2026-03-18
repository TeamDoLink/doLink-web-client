import { useRef, useState, useEffect } from 'react';
import imgEditIcon from '@/assets/icons/common/edit-24.svg';
import imgDeleteIcon from '@/assets/icons/common/delete-24.svg';
import imgMoreIcon from '@/assets/icons/common/option-24.svg';

export type ArchiveCardProps = {
  type?: 'default' | 'edit';
  title?: string;
  category?: string;
  itemCount?: number;
  width?: string;
  images?: string[];
  onMoreClick?: () => void;
  onTypeChange?: (type: 'default' | 'edit') => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  disableActionMenu?: boolean;
  onClick?: () => void;
  isTutorial?: boolean;
};

// TODO category type 지정 - mapping 함수 만들어서 자동 매칭해 관리 예정
// 아이콘, 이미지
export default function ArchiveCard({
  type = 'default',
  title,
  category,
  itemCount = 0,
  width = 'w-full',
  images = [],
  onMoreClick,
  onTypeChange,
  onEditClick,
  onDeleteClick,
  disableActionMenu = false,
  onClick,
  isTutorial: _isTutorial = false,
}: ArchiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 터치/마우스 환경 모두 대응
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      // 카드 외부를 터치했는가?
      if (!cardRef.current?.contains(target)) {
        setIsOpen(false);
        onTypeChange?.('default');
      }
    };

    // 카드가 열려있을 때만 리스너 추가 (성능 최적화)
    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerDown, true);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isOpen, onTypeChange]);

  // RN WebView 호환성을 위한 fallback
  // TODO RN Weibview test
  useEffect(() => {
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!cardRef.current?.contains(target)) {
        setIsOpen(false);
        onTypeChange?.('default');
      }
    };

    if (isOpen) {
      document.addEventListener('touchend', handleTouchEnd, true);
    }

    return () => {
      document.removeEventListener('touchend', handleTouchEnd, true);
    };
  }, [isOpen, onTypeChange]);

  const handleMoreClick = () => {
    if (disableActionMenu) {
      onMoreClick?.();
      return;
    }
    // isTutorial이어도 메뉴는 열림
    setIsOpen(true);
    onTypeChange?.('edit');
    onMoreClick?.();
  };

  const handleCardClick = () => {
    if (!onClick) {
      return;
    }
    onClick();
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  // 항상 4개의 슬롯을 생성 (이미지가 있으면 표시, 없으면 배경만)
  const slots = Array.from({ length: 4 }, (_, index) => images[index]);
  const displayType = isOpen ? 'edit' : type;

  return (
    <div
      ref={cardRef}
      data-testid='archive-card'
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex ${width} items-start gap-3 rounded-xl bg-white p-3 pl-3 pr-4 shadow-sm`}
      onClick={onClick ? handleCardClick : undefined}
      onKeyDown={onClick ? handleCardKeyDown : undefined}
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
          <div className='flex w-full min-w-0 items-center gap-1 text-caption-sm text-grey-500'>
            <p className='min-w-0 truncate'>{category}</p>
            <p className='shrink-0'>·</p>
            <p className='min-w-0 truncate'>할 일 {itemCount}개</p>
          </div>
        </div>
      </div>

      {displayType === 'default' ? (
        <button
          type='button'
          aria-label='더보기'
          onClick={(event) => {
            event.stopPropagation();
            handleMoreClick();
          }}
          className='flex h-6 w-6 flex-shrink-0 items-center justify-center pt-[7px]'
        >
          <img alt='more' className='h-6 w-6' src={imgMoreIcon} />
        </button>
      ) : (
        <div className='flex flex-shrink-0 items-center gap-2.5 pt-[7px]'>
          <button
            type='button'
            aria-label='편집'
            onClick={(event) => {
              event.stopPropagation();
              onEditClick?.();
            }}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center'
          >
            <img alt='edit' className='h-5 w-5' src={imgEditIcon} />
          </button>
          <button
            type='button'
            aria-label='삭제'
            onClick={(event) => {
              event.stopPropagation();
              onDeleteClick?.();
            }}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center'
          >
            <img alt='delete' className='h-5 w-5' src={imgDeleteIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
