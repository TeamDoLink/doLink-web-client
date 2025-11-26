import searchIcon from '@/assets/icons/common/search-24.svg';

interface SearchAppBarProps {
  title: string;
  className?: string;
  onClickSearch?: () => void;
}

export const SearchAppBar = ({
  title,
  className = '',
  onClickSearch,
}: SearchAppBarProps) => {
  return (
    <header
      className={`flex w-full items-center justify-between bg-white px-[20px] py-[10px] ${className}`}
    >
      <span className="text-heading-xl text-black">{title}</span>

      <button
        type="button"
        onClick={onClickSearch}
        aria-label="검색"
        className="flex h-8 w-8 items-center justify-center"
      >
        <img src={searchIcon} alt="검색" className="h-6 w-6" />
      </button>
    </header>
  );
};
