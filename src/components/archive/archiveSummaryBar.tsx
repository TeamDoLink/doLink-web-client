import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import plusIcon from '@/assets/icons/common/plus.svg';
import { GreyLine } from '@/components/common/line/greyLine';

interface ArchiveSummaryBarProps extends HTMLAttributes<HTMLDivElement> {
  totalCount: number;
  onClickAdd?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

/**
 * 아카이브 개수 요약 바
 * - 좌측: 총 n개
 * - 우측: 모음 추가 버튼
 */
export const ArchiveSummaryBar = ({
  totalCount,
  onClickAdd,
  className = '',
  ...divProps
}: ArchiveSummaryBarProps) => {
  return (
    <div className={`w-full ${className}`} {...divProps}>
      <div className='flex h-[43px] w-full items-center justify-between px-5'>
        <p
          data-testid='archive-total-count'
          className='text-body-md text-black'
        >
          총 <span className='text-point'>{totalCount}</span>개
        </p>
        <button
          type='button'
          data-testid='archive-add-button'
          onClick={onClickAdd}
          className='flex items-center gap-1 text-grey-700'
        >
          <img src={plusIcon} alt='' aria-hidden='true' className='h-4 w-4' />
          <span className='text-caption-md text-grey-700'>모음 추가</span>
        </button>
      </div>
      <GreyLine width='w-full' />
    </div>
  );
};
