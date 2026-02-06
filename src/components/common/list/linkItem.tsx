import { useRef } from 'react';
import imgEditIcon from '@/assets/icons/common/edit-24.svg';
import imgDeleteIcon from '@/assets/icons/common/delete-24.svg';
import imgNoData from '@/assets/icons/common/no-img-data.svg';
import { CheckBox } from './checkBox';
import {
  LinkCapsuleButton,
  ShareCapsuleButton,
} from '@/components/common/button';

export type LinkItemProps = {
  title: string;
  subtitle: string;
  thumbnail?: string;
  checked?: boolean;
  isEditMode?: boolean;
  onChange?: (checked: boolean) => void;

  onOriginalClick?: () => void;
  onShareClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  width?: string;
  actionDisabled?: boolean;
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
  onOriginalClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  width = 'w-full',
  actionDisabled = false,
}: LinkItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleCheckboxClick = () => {
    if (!isEditMode && !actionDisabled) {
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
            <p className='w-full truncate whitespace-pre text-caption-sm text-grey-500'>
              {subtitle}
            </p>
          </div>

          {/* Buttons */}
          <div className='flex items-start gap-1'>
            <LinkCapsuleButton
              onClick={onOriginalClick}
              disabled={actionDisabled}
            />
            <ShareCapsuleButton
              onClick={onShareClick}
              disabled={actionDisabled}
            />
          </div>
        </div>
      </div>

      {/* Right Icons */}
      {isEditMode ? (
        <div className='flex flex-shrink-0 items-center gap-2.5'>
          {/* Edit Button */}
          <button
            type='button'
            onClick={onEditClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
          >
            <img alt='edit' className='h-6 w-6' src={imgEditIcon} />
          </button>
          {/* Delete Button */}
          <button
            onClick={onDeleteClick}
            className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
            type='button'
          >
            <img alt='delete' className='h-6 w-6' src={imgDeleteIcon} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleCheckboxClick}
          className='flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden'
          type='button'
        >
          <CheckBox checked={checked} disabled={actionDisabled} />
        </button>
      )}
    </div>
  );
}
