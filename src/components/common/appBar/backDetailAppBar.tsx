import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-36.svg';
import optionIcon from '@/assets/icons/common/option-36.svg';
import { TextButton } from '@/components/common/button/textButton';

type RightIconType = 'save' | 'search' | 'option';

interface BaseBackDetailBarProps {
  // 가운데 헤더 제목 텍스트
  title: string;
  // 뒤로가기 버튼 표시 여부 (기본값: true)
  showBackButton?: boolean;
  // 뒤로가기 버튼 클릭 핸들러
  onClickBack?: () => void;
  // 검색 버튼 클릭 핸들러
  onClickSearch?: () => void;
  // 옵션 버튼 클릭 핸들러
  onClickOption?: () => void;
}

interface SaveIconProps extends BaseBackDetailBarProps {
  // 우측 아이콘에 'save' 포함 시 필수
  rightIcons: 'save' | RightIconType[] | (RightIconType | 'save')[];
  // 임시저장 버튼 disabled 상태 (기본값: false)
  isSaveDisabled?: boolean;
  // 임시저장 버튼 클릭 핸들러
  onClickSave: () => void;
}

interface NoSaveIconProps extends BaseBackDetailBarProps {
  // 우측 아이콘에 'save' 미포함
  rightIcons?:
    | Exclude<RightIconType, 'save'>
    | Exclude<RightIconType, 'save'>[];
  isSaveDisabled?: never;
  onClickSave?: never;
}

type BackDetailBarProps = SaveIconProps | NoSaveIconProps;

/**
 * 상세 헤더 컴포넌트
 * - 좌측 : 뒤로가기 버튼 + 헤더 제목
 * - 우측 : 아이콘 버튼들 (임시저장, 검색, 옵션)
 *
 * @example
 * <BackDetailBar
 *   title="할 일 추가"
 *   rightIcons={['save', 'option']}
 *   isSaveDisabled={false}
 *   onClickSave={handleSave}
 *   onClickOption={handleOption}
 * />
 */
export const BackDetailBar = ({
  title,
  showBackButton = true,
  rightIcons,
  isSaveDisabled = false,
  onClickBack,
  onClickSave,
  onClickSearch,
  onClickOption,
}: BackDetailBarProps) => {
  // rightIcons를 배열로 정규화
  const icons: RightIconType[] = Array.isArray(rightIcons)
    ? (rightIcons as RightIconType[])
    : [rightIcons as RightIconType];

  const getIconButton = (iconType: RightIconType) => {
    switch (iconType) {
      case 'save':
        return (
          <TextButton
            key='save'
            disabled={isSaveDisabled}
            onClick={onClickSave}
            aria-label='임시저장'
          >
            임시저장
          </TextButton>
        );
      case 'search':
        return (
          <button
            key='search'
            type='button'
            onClick={onClickSearch}
            aria-label='검색'
          >
            <img src={searchIcon} alt='검색' />
          </button>
        );
      case 'option':
        return (
          <button
            key='option'
            type='button'
            onClick={onClickOption}
            aria-label='옵션'
          >
            <img src={optionIcon} alt='옵션' />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <header className='w-full bg-white'>
      <div
        className='w-full'
        style={{ height: 'var(--safe-area-top, 44px)' }}
        aria-hidden
      />

      <div className='flex h-14 w-full items-center justify-between gap-2 px-3 sm:px-4'>
        {/* 좌측: 뒤로가기 + 제목 */}
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          <button
            type='button'
            onClick={onClickBack}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-opacity hover:opacity-70 ${
              showBackButton ? '' : 'invisible'
            }`}
            aria-label='뒤로'
          >
            <img src={backIcon} alt='' className='h-6 w-6' />
          </button>

          <h1 className='truncate text-heading-md font-semibold text-grey-900'>
            {title}
          </h1>
        </div>

        {/* 우측: 아이콘 버튼들 */}
        <div className='flex shrink-0 items-center gap-1'>
          {icons.map((iconType) => getIconButton(iconType))}
        </div>
      </div>
    </header>
  );
};
