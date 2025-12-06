import imgNoData from '@/assets/icons/common/no-img-data.svg';
import { FlagButton } from '@/components/common/button/flagButton';

export type TaskSearchItemProps = {
  title: string;
  subtitle: string;
  thumbnail?: string;
  searchQuery?: string;
  isCompleted?: boolean;
  onClick?: () => void;
  width?: string;
};

/**
 * TaskSearchItem 컴포넌트
 *x
 * @description
 * - 검색 결과에 표시되는 할일 아이템 컴포넌트
 * - 검색어와 일치하는 부분을 파란색으로 하이라이트
 * - "완료" 상태 표시 배지
 */
export default function TaskSearchItem({
  title,
  subtitle,
  thumbnail,
  searchQuery = '',
  isCompleted = false,
  onClick,
  width = 'w-full',
}: TaskSearchItemProps) {
  // 검색어 하이라이트 함수
  // TODO : 공통 유틸 함수로 분리 고려
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className='text-point'>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      className={`flex ${width} items-start gap-3 px-0 py-0`}
    >
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

      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col items-start gap-0.5'>
        {/* Title with highlight and completed badge */}
        <div className='flex w-full items-center gap-1.5'>
          <p className='truncate text-body-lg text-black'>
            {highlightText(title, searchQuery)}
          </p>

          {/* TODO 서현님 공통컴포넌트 버튼 완료시 대체 예정 */}
          {isCompleted ? (
            <FlagButton completed>완료</FlagButton>
          ) : (
            <FlagButton>미완료</FlagButton>
          )}
        </div>

        {/* Subtitle */}
        <p className='truncate text-caption-sm text-grey-500'>{subtitle}</p>
      </div>
    </button>
  );
}
