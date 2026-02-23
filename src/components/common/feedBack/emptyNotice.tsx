import React from 'react';
import empty_message from '@/assets/icons/common/empty_message.svg';

export type EmptyNoticeProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
};

export default function EmptyNotice({
  className = '',
  style,
  title = '저장할 링크를 추가해주세요',
  subtitle = '우측 하단 검정색 + 버튼으로 추가할 수 있어요',
}: EmptyNoticeProps) {
  return (
    <div
      className={`flex flex-col items-center gap-5 ${className}`}
      style={style}
    >
      <div className='relative size-[52px] shrink-0'>
        <img
          src={empty_message}
          alt=''
          className='block size-full max-w-none'
        />
      </div>

      <div className='flex w-full flex-col items-center gap-[1px] text-center'>
        <p className='text-heading-md text-grey-500'>{title}</p>
        <p className='text-body-lg text-grey-400'>{subtitle}</p>
      </div>
    </div>
  );
}
