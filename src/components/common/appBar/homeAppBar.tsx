import logoSvg from '@/assets/logos/logo.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';

interface HomeAppBarProps {
  // 우측 검색 버튼 클릭 핸들러
  onClickSearch?: () => void;
}

/**
 * 홈 화면 헤더 컴포넌트
 * - 좌측 : doLink 로고
 * - 우측 : 검색 버튼
 */
export const HomeAppBar = ({ onClickSearch }: HomeAppBarProps) => {
  return (
    <header className='w-full bg-white'>
      <div
        className='w-full'
        style={{ height: 'var(--safe-area-top, 44px)' }}
        aria-hidden
      />

      <div className='flex h-14 w-full items-center justify-between px-[20px]'>
        <img src={logoSvg} alt='DoLink 로고' className='h-[20px] w-[65.23px]' />

        <button
          type='button'
          onClick={onClickSearch}
          aria-label='검색'
          className='flex h-8 w-8 items-center justify-center'
        >
          <img src={searchIcon} alt='검색' className='h-6 w-6' />
        </button>
      </div>
    </header>
  );
};
