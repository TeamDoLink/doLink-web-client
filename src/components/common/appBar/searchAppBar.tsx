import searchIcon from '@/assets/icons/common/search-24.svg';

interface SearchAppBarProps {
  // 좌측 헤더 제목
  title: string;
  // 검색 버튼 클릭 핸들러
  onClickSearch?: () => void;
}

/**
 * 검색 헤더 컴포넌트
 * - 좌측 : 헤더 제목
 * - 우측 : 검색 버튼
 */
export const SearchAppBar = ({ title, onClickSearch }: SearchAppBarProps) => {
  return (
    <header
      className={`flex w-full items-center justify-between bg-white px-[20px] py-[10px]`}
    >
      <span className='text-heading-xl text-black'>{title}</span>

      <button
        type='button'
        onClick={onClickSearch}
        aria-label='검색'
        className='flex h-8 w-8 items-center justify-center'
      >
        <img src={searchIcon} alt='검색' className='h-6 w-6' />
      </button>
    </header>
  );
};
