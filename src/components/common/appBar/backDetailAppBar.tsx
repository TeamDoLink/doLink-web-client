import backIcon from '@/assets/icons/common/back.svg';
import searchIcon from '@/assets/icons/common/search-24.svg';
import optionIcon from '@/assets/icons/common/option-24.svg';
import { TextButton } from '@/components/common/button/textButton';

type BackDetailAction = 'temporarySave' | 'search' | 'more';

interface BackDetailBarProps {
  // 가운데 헤더 제목 텍스트
  title: string;
  // 뒤로가기 버튼 표시 여부 (기본값: true)
  showBackButton?: boolean;
  // 액션 아이템 타입 목록 (기본값: 임시저장/검색/더보기)
  actions?: BackDetailAction[];
  // 뒤로가기 버튼 클릭 핸들러
  onClickBack?: () => void;
  // 임시저장 버튼 클릭 핸들러
  onClickTemporarySave?: () => void;
  // 검색 버튼 클릭 핸들러
  onClickSearch?: () => void;
  // 더보기 버튼 클릭 핸들러
  onClickMore?: () => void;
  // 임시저장 버튼 라벨 (기본값: 임시저장)
  temporarySaveLabel?: string;
}

/**
 * 상세 헤더 컴포넌트
 * - 좌측 : 뒤로가기 버튼 + 헤더 제목
 * - 우측 : 임시저장 텍스트 버튼 · 검색 · 더보기 액션(선택적으로 노출)
 */
export const BackDetailBar = ({
  title,
  showBackButton = true,
  actions = ['temporarySave', 'search', 'more'],
  onClickBack,
  onClickTemporarySave,
  onClickSearch,
  onClickMore,
  temporarySaveLabel = '임시저장',
}: BackDetailBarProps) => {
  const renderAction = (action: BackDetailAction) => {
    switch (action) {
      case 'temporarySave':
        return (
          // 임시저장 버튼
          <TextButton
            key='temporarySave'
            onClick={onClickTemporarySave}
            className='text-body-sm !text-grey-400'
          >
            {temporarySaveLabel}
          </TextButton>
        );
      case 'search':
        // 검색 버튼
        return (
          <button
            key='search'
            type='button'
            onClick={onClickSearch}
            className='flex h-9 w-9 items-center justify-center'
          >
            <img src={searchIcon} alt='검색' className='h-6 w-6' />
          </button>
        );
      case 'more':
        // 옵션 버튼
        return (
          <button
            key='more'
            type='button'
            onClick={onClickMore}
            className='flex h-9 w-9 items-center justify-center'
          >
            <img src={optionIcon} alt='더보기' className='h-6 w-6' />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <header className='flex h-14 w-full items-center justify-between px-4'>
      <div className='flex flex-1 items-center gap-2'>
        <button
          type='button'
          onClick={onClickBack}
          className={`flex h-9 w-9 items-center justify-center ${
            showBackButton ? '' : 'invisible'
          }`}
        >
          <img src={backIcon} alt='뒤로' className='h-6 w-6' />
        </button>

        <h1 className='text-heading-lg text-grey-900'>{title}</h1>
      </div>

      <div className='flex items-center gap-1'>{actions.map(renderAction)}</div>
    </header>
  );
};
