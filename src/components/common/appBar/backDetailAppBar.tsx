import backIcon from '@/assets/icons/common/back.svg';
import optionIcon from '@/assets/icons/common/option-36.svg';

interface BackDetailBarProps {
  // 가운데 헤더 제목 텍스트
  title: string;
  // 뒤로가기 버튼 표시 여부 (기본값: true)
  showBackButton?: boolean;
  // 옵션 버튼 표시 여부 (기본값: true)
  showOptionButton?: boolean;
  // 뒤로가기 버튼 클릭 핸들러
  onClickBack?: () => void;
  // 옵션 버튼 클릭 핸들러
  onClickOption?: () => void;
}

/**
 * 상세 헤더 컴포넌트
 * - 좌측 : 뒤로가기 버튼 + 헤더 제목
 * - 우측 : 옵션 버튼
 */
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
