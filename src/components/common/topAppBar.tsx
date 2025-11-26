import backIcon from '@/assets/icons/common/back.svg';
import option from '@/assets/icons/common/option-36.svg';

interface TopAppBarProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onClickBack?: () => void;
  onClickMenu?: () => void;
}

export const TopAppBar = ({
  title,
  showBackButton = true,
  showMenuButton = true,
  onClickBack,
  onClickMenu,
}: TopAppBarProps) => {
  return (
    <header className="flex h-14 w-full items-center bg-white px-3 py-3">
      <div className="flex flex-1 items-center gap-2">
        <button
          type="button"
          onClick={onClickBack}
          className={`flex h-10 w-10 items-center justify-center ${
            showBackButton ? '' : 'invisible'
          }`}
        >
          <img src={backIcon} alt="뒤로" className="h-5 w-5" />
        </button>

        <h1 className="text-heading-md text-grey-900">{title}</h1>
      </div>

      <button
        type="button"
        onClick={onClickMenu}
        className={`ml-2 flex h-10 w-10 items-center justify-center ${
          showMenuButton ? '' : 'invisible'
        }`}
      >
        <img src={option} alt="메뉴" className="h-5 w-5" />
      </button>
    </header>
  );
};
