import backIcon from '@/assets/icons/common/back.svg';
import optionIcon from '@/assets/icons/common/option-36.svg';

interface BackDetailBarProps {
  title: string;
  showBackButton?: boolean;
  showOptionButton?: boolean;
  onClickBack?: () => void;
  onClickOption?: () => void;
}

export const BackDetailBar = ({
  title,
  showBackButton = true,
  showOptionButton = true,
  onClickBack,
  onClickOption,
}: BackDetailBarProps) => {
  return (
    <header className='flex h-14 w-full items-center bg-white px-3 py-3'>
      <div className='flex flex-1 items-center gap-2'>
        <button
          type='button'
          onClick={onClickBack}
          className={`flex h-9 w-9 items-center justify-center ${
            showBackButton ? '' : 'invisible'
          }`}
        >
          <img src={backIcon} alt='뒤로' className='h-9 w-9' />
        </button>

        <h1 className='text-heading-md text-grey-900'>{title}</h1>
      </div>

      <button
        type='button'
        onClick={onClickOption}
        className={`ml-2 flex h-9 w-9 items-center justify-center ${
          showOptionButton ? '' : 'invisible'
        }`}
      >
        <img src={optionIcon} alt='옵션' className='h-9 w-9' />
      </button>
    </header>
  );
};
