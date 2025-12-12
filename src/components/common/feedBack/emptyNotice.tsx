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
      className={`flex flex-col items-center gap-[1.25rem] ${className}`}
      style={style}
    >
      <div className='relative h-[3.25rem] w-[3.25rem] shrink-0'>
        <img
          src={empty_message}
          alt=''
          className='block h-full w-full max-w-none'
        />
      </div>

      <div className='flex w-full flex-col items-center gap-[0.25rem] text-center'>
        <p className='text-[16px] font-semibold leading-[20px] text-[#6b7684]'>
          {title}
        </p>
        <p className='text-[14px] font-medium leading-[20px] text-[#9c9fae]'>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
