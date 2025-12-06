import { useRef, useEffect } from 'react';
import imgEditIcon from '@/assets/icons/common/edit-24.svg';
import imgDeleteIcon from '@/assets/icons/common/delete.svg';
import imgNoData from '@/assets/icons/common/no-img-data.svg';
import { CheckboxComponent } from './checkBoxComponent';

export type LinkItemProps = {
  title: string;
  subtitle: string;
  thumbnail?: string;
  checked?: boolean;
  isEditMode?: boolean;
  onChange?: (checked: boolean) => void;
  onEditModeChange?: (isEditMode: boolean) => void;
  onOriginalClick?: () => void;
  onShareClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  width?: string;
};

/**
 * LinkItem 컴포넌트
 *
 * @description
 * - 링크 아이템을 표시하는 컴포넌트
 * - default: 체크박스가 비어있는 기본 상태
 * - done: 체크되고 제목에 취소선이 있는 완료 상태
 * - edit: 편집/삭제 아이콘이 표시되는 편집 상태 (외부에서 제어)
 * - 편집 상태에서 아이콘 외부 클릭 시 이전 상태로 복귀
 */
export default function LinkItem({
  title,
  subtitle,
  thumbnail,
  checked = false,
  isEditMode = false,
  onChange,
  onEditModeChange,
  onOriginalClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  width = 'w-full',
}: LinkItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  // 편집 모드에서 외부 클릭 시 이전 상태로 복귀
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (!itemRef.current?.contains(target)) {
        onEditModeChange?.(false);
      }
    };

    if (isEditMode) {
      document.addEventListener('pointerdown', handlePointerDown, true);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isEditMode, onEditModeChange]);

  const handleCheckboxClick = () => {
    if (!isEditMode) {
      onChange?.(!checked);
    }
  };

  return (
    <div ref={itemRef} className={`flex ${width} items-start gap-3`}>
      <div className='flex min-h-0 min-w-0 flex-1 items-start gap-3'>
        {/* Thumbnail */}
        <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-lg'>
          {thumbnail ? (
            <img
              alt='thumbnail'
              className='absolute inset-0 h-full w-full object-cover'
              src={thumbnail}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-[6px] bg-grey-200'>
              <img alt='no image' className='h-auto w-auto' src={imgNoData} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className='flex min-h-0 min-w-0 flex-1 flex-col items-start gap-1.5'>
          {/* Text */}
          <div className='flex w-full flex-col items-start gap-0.5'>
            <p
              className={`w-full truncate text-body-lg ${
                checked && !isEditMode
                  ? 'text-grey-500 line-through'
                  : 'text-black'
              }`}
            >
              {title}
            </p>
            <p className='whitespace-pre text-caption-sm text-grey-500'>
              {subtitle}
            </p>
          </div>

          {/* Buttons */}
          <div className='flex items-start gap-1'>
            {/*TODO 서현님 공통 컴포넌트 버튼으로 대체 예정 -> 임시로 구현 */}
            <button
              onClick={onOriginalClick}
              className='flex items-center justify-center gap-1 overflow-hidden rounded-[20px] border border-grey-200 bg-white px-2.5 py-[5px]'
            >
              <svg
                className='h-3 w-3 text-grey-700'
                viewBox='0 0 12 12'
                fill='none'
              >
                <path
                  d='M2 10L10 2M10 2H4M10 2V8'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <p className='whitespace-pre text-center text-caption-sm text-grey-700'>
                원본
              </p>
            </button>

            {/*TODO 서현님 공통 컴포넌트 버튼으로 대체 예정 -> 임시로 구현 */}
            <button
              onClick={onShareClick}
              className='flex items-center justify-center gap-1 overflow-hidden rounded-[20px] border border-grey-200 bg-white px-2.5 py-[5px]'
            >
              <svg
                className='h-3 w-3 text-grey-700'
                viewBox='0 0 12 12'
                fill='none'
              >
                <path
                  d='M4 7L8 3M8 7V3H4'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <p className='whitespace-pre text-center text-caption-sm text-grey-700'>
                공유
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Icons */}
      {isEditMode ? (
        <div className='flex flex-shrink-0 items-center gap-2.5'>
          <button
            onClick={onEditClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
          >
            <img alt='edit' className='h-6 w-6' src={imgEditIcon} />
          </button>
          <button
            onClick={onDeleteClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
          >
            <img alt='delete' className='h-6 w-6' src={imgDeleteIcon} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleCheckboxClick}
          className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
        >
          <CheckboxComponent checked={checked} />
        </button>
      )}
    </div>
  );
}
