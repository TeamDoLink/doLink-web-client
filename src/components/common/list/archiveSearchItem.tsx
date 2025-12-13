export type ArchiveSearchItemProps = {
  title: string;
  category: string;
  itemCount?: number;
  width?: string;
  images?: string[];
  searchQuery?: string;
  onClick?: () => void;
};

/**
 * 검색어에 해당하는 텍스트를 파란색으로 하이라이트하는 유틸리티 함수
 */
function highlightText(text: string, searchQuery?: string) {
  if (!searchQuery || !text) {
    return <span>{text}</span>;
  }

  // 대소문자 구분 없이 검색
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // 검색어와 일치하는 부분인지 확인 (대소문자 무시)
        const isMatch = part.toLowerCase() === searchQuery.toLowerCase();
        return (
          <span
            key={index}
            className={`inline-flex items-start ${isMatch ? 'text-point' : ''}`}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

/**
 * 아카이브 검색 결과 아이템 컴포넌트
 *
 * @description
 * - 검색된 아카이브를 표시하는 리스트 아이템
 * - 썸네일은 2x2 그리드로 최대 4개의 이미지 표시
 * - 검색어와 일치하는 텍스트는 파란색으로 하이라이트
 */
export default function ArchiveSearchItem({
  title,
  category,
  itemCount = 0,
  width = 'w-full',
  images = [],
  searchQuery,
  onClick,
}: ArchiveSearchItemProps) {
  // 항상 4개의 슬롯을 생성 (이미지가 있으면 표시, 없으면 배경만)
  const slots = Array.from({ length: 4 }, (_, index) => images[index]);

  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex ${width} h-[60px] items-center gap-4 focus:outline-none`}
    >
      {/* 썸네일 */}
      <div className='grid h-[60px] w-[60px] shrink-0 grid-cols-2 grid-rows-2 gap-[2px] overflow-clip rounded-[9.6px]'>
        {slots.map((imageSrc, index) => (
          <div key={index} className='relative overflow-hidden'>
            {imageSrc && (
              <>
                <img
                  alt={`thumbnail-${index}`}
                  className='absolute inset-0 size-full object-cover'
                  src={imageSrc}
                />
              </>
            )}
            <div className='pointer-events-none absolute inset-0 bg-black/20' />
          </div>
        ))}
      </div>

      {/* 텍스트 영역 */}
      <div className='flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center gap-1'>
        {/* 제목 - 검색어 하이라이트 */}
        <p className='w-full truncate text-start text-body-lg text-black'>
          {highlightText(title, searchQuery)}
        </p>

        {/* 부제목 */}
        <div className='flex w-full min-w-0 items-center gap-1 text-caption-sm text-grey-500'>
          <p className='min-w-0 truncate'>{category}</p>
          <span className='shrink-0'>·</span>
          <p className='min-w-0 truncate'>할 일 {itemCount}개</p>
        </div>
      </div>
    </button>
  );
}
