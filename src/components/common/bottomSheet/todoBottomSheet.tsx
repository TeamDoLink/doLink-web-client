import type { PropsWithChildren } from 'react';
import plusIcon from '@/assets/icons/common/plus.svg';
import { BaseBottomSheet } from '@/components/common/bottomSheet/baseBottomSheet';

interface TodoBottomSheetProps extends PropsWithChildren {
  title: string;
  onClickAddCollection: () => void;
  onClose: () => void;
  dismissThreshold?: number;
}

/**
 * 할 일 담기 BottomSheet 컨테이너 컴포넌트
 * 드래그 핸들을 통해 아래로 스와이프하여 닫는 기능 구현
 */

export const TodoBottomSheet = ({
  title,
  onClickAddCollection,
  onClose,
  dismissThreshold = 80,
  children,
}: TodoBottomSheetProps) => {
  return (
    <BaseBottomSheet
      onClose={onClose}
      dismissThreshold={dismissThreshold}
      contentClassName='gap-4'
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-heading-xl text-black'>{title}</h2>
        <button
          type='button'
          onClick={onClickAddCollection}
          className='inline-flex items-center gap-1 text-caption-md text-grey-500'
        >
          <img src={plusIcon} alt='' className='h-3 w-3' aria-hidden />
          <span>모음 추가</span>
        </button>
      </div>

      <div>{children}</div>
    </BaseBottomSheet>
  );
};
