import logoSvg from '@/assets/logos/logo.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';

interface HomeAppBarProps {
  className?: string;
  onClickSearch?: () => void;
}

export const HomeAppBar = ({
  className = '',
  onClickSearch,
}: HomeAppBarProps) => {
  return (
    <header
      className={`flex w-full items-center justify-between bg-white px-[20px] py-[10px] ${className}`}
    >
      <img src={logoSvg} alt='DoLink 로고' className='h-[20px] w-[65.23px]' />

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
