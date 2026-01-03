import type { PropsWithChildren } from 'react';
import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-36.svg';
import optionIcon from '@/assets/icons/common/option-36.svg';
import { TextButton } from '@/components/common/button/textButton';
import { BaseBottomSheet } from '@/components/common/bottomSheet/baseBottomSheet';

interface ArchiveAddBottomSheetProps extends PropsWithChildren {
  title: string;
  onClose: () => void;
  onClickBack?: () => void;
  onClickSave?: () => void;
  onClickSearch?: () => void;
  onClickOption?: () => void;
  isSaveDisabled?: boolean;
}

/**
 * 모음 관련 바텀시트 헤더 컴포넌트
 * - 드래그로 닫기 가능
 * - 뒤로, 임시저장(optional), 검색(optional), 옵션(optional) 버튼 제공
 */
export const ArchiveAddBottomSheet = ({
  title,
  onClose,
  onClickBack,
  onClickSave,
  onClickSearch,
  onClickOption,
  isSaveDisabled = false,
  children,
}: ArchiveAddBottomSheetProps) => {
  const handleBackClick = () => {
    if (onClickBack) {
      onClickBack();
    } else {
      onClose();
    }
  };
  return (
    <BaseBottomSheet onClose={onClose} contentClassName='gap-6'>
      <header className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handleBackClick}
            className='flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-80'
            aria-label='뒤로'
          >
            <img src={backIcon} alt='' className='h-6 w-6' />
          </button>
          <h1 className='text-heading-lg text-grey-900'>{title}</h1>
        </div>

        <div className='flex items-center gap-1'>
          {onClickSave && (
            <TextButton
              disabled={isSaveDisabled}
              onClick={onClickSave}
              aria-label='임시저장'
              className='text-caption-md text-grey-500'
            >
              임시저장
            </TextButton>
          )}
          {onClickSearch && (
            <button
              type='button'
              onClick={onClickSearch}
              className='flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-80'
              aria-label='검색'
            >
              <img src={searchIcon} alt='검색' />
            </button>
          )}
          {onClickOption && (
            <button
              type='button'
              onClick={onClickOption}
              className='flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-80'
              aria-label='옵션'
            >
              <img src={optionIcon} alt='옵션' />
            </button>
          )}
        </div>
      </header>

      <div>{children}</div>
    </BaseBottomSheet>
  );
};

export default ArchiveAddBottomSheet;
