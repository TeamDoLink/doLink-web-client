import { useState } from 'react';
import { InputField, Button, AppBar, FeedBack } from '@/components/common';
import { CollectionChipSelector, type CollectionChip } from '@/components/task';
import { useClipboardBridge } from '@/hooks/useClipboardBridge';
import { useDraftBridge } from '@/hooks/useDraftBridge';
import type { TaskDraft } from '@/types/draft';
import { ModalLayout } from '@/components/common/feedBack';

// 임시저장 키
const DRAFT_KEY = 'task-create-draft';

// 임시 데이터 - 실제로는 API에서 받아올 데이터
const MOCK_COLLECTIONS: CollectionChip[] = [
  { id: '1', label: '2025 연말 도쿄 여행' },
  { id: '2', label: '넷플릭스 볼 영화' },
  { id: '3', label: '가을 축제' },
  { id: '4', label: '게임 신작' },
  { id: '5', label: '아무거나' },
  { id: '7', label: '재테크' },
  { id: '6', label: '퇴사 후 할 일' },
  { id: '8', label: '용산' },
  { id: '10', label: '뭐하지' },
  { id: '11', label: '할 일' },
  { id: '12', label: '할 일' },
  { id: '13', label: '할 일' },
  { id: '14', label: '할 일' },
  { id: '15', label: '할 일' },
  { id: '16', label: '할 일' },
  { id: '17', label: '할 일' },
];

/**
 * 업무 생성 페이지 (테스트용)
 * 할일 추가를 위한 전체 폼 페이지
 */
function TestTaskCreatePage() {
  const MAX_LENGTH = 100; // 가장 일반적인 경우
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    linkValue,
    setLinkValue,
    requestClipboard,
    isLoading,
    error,
    clearError,
  } = useClipboardBridge();

  // TODO 임시저장 불러오기 시  isLoading  error 화면 UI 처리
  const {
    saveDraft,
    loadDraft,
    deleteDraft,
    isLoading: isDraftLoading,
    error: draftError,
  } = useDraftBridge<TaskDraft>();

  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  // 선택된 아카이브 모음 상태
  const [selectedArchiveCollection, setSelectedArchiveCollection] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [linkFocused, setLinkFocused] = useState(false);

  /**
   * 제목 입력필드 focus 핸들러
   */
  const handleTitleFocus = () => {
    setTitleFocused(true);
  };

  /**
   * 제목 입력필드 blur 핸들러
   */
  const handleTitleBlur = () => {
    setTitleFocused(false);
  };

  /**
   * 링크 입력필드 focus 핸들러
   */
  const handleLinkFocus = () => {
    setLinkFocused(true);
  };

  /**
   * 링크 입력필드 blur 핸들러
   */
  const handleLinkBlur = () => {
    setLinkFocused(false);
  };

  /**
   * 붙여넣기 버튼 클릭 핸들러
   */
  const handlePasteClick = () => {
    clearError();
    requestClipboard();
  };

  /**
   * 링크 입력값 변경 핸들러
   */
  const handleLinkChange = (value: string) => {
    setLinkValue(value);
    clearError();
  };

  /**
   * 제목 입력값 변경 핸들러
   */
  const handleTitleChange = (value: string) => {
    if (value.length <= MAX_LENGTH) setTitle(value);
  };

  /**
   * 메모 입력값 변경 핸들러
   */
  const handleMemoChange = (value: string) => {
    if (value.length <= MAX_LENGTH) setMemo(value);
  };

  /**
   * 모음 선택 핸들러
   */
  const handleCollectionSelect = (id: string) => {
    const selected = MOCK_COLLECTIONS.find((item) => item.id === id);
    if (selected) {
      setSelectedArchiveCollection({
        id: selected.id,
        name: selected.label,
      });
    }
  };

  /**
   * 임시저장 데이터 불러오기 (수동)
   */
  const handleLoadDraft = async () => {
    try {
      const draftData = await loadDraft(DRAFT_KEY);

      if (draftData) {
        setTitle(draftData.title);

        if (draftData.link && draftData.memo) {
          setLinkValue(draftData.link);
          setMemo(draftData.memo);
        }

        // archive 정보로 collection 찾아서 설정
        const collection = MOCK_COLLECTIONS.find(
          (item) => item.label === draftData.archive
        );

        if (collection) {
          setSelectedArchiveCollection({
            id: collection.id,
            name: collection.label,
          });
        } else {
          setSelectedArchiveCollection(null);
        }
        console.log('✅ 임시저장 데이터 불러오기 성공:', draftData);
      } else {
        console.log('⚠️ 저장된 임시저장 데이터가 없습니다.');
      }
    } catch (err) {
      console.error('❌ 임시저장 데이터 불러오기 실패:', err);
    }
  };

  /**
   * 테스트용 임시저장 데이터 생성
   */
  const handleCreateTestDraft = async () => {
    const testDraft: TaskDraft = {
      archive: '2025 연말 도쿄 여행',
      title: '테스트 할일 제목입니다',
      link: 'https://example.com/test-link',
      memo: '이것은 테스트용 메모입니다.',
    };

    try {
      await saveDraft(DRAFT_KEY, testDraft);
      console.log('✅ 테스트 임시저장 데이터 생성 완료:', testDraft);
      alert('테스트 데이터가 저장되었습니다!');
    } catch (err) {
      console.error('❌ 테스트 데이터 저장 실패:', err);
    }
  };

  /**
   * 임시저장 데이터 삭제
   */
  const handleClearDraft = async () => {
    try {
      await deleteDraft(DRAFT_KEY);
      console.log('🗑️ 임시저장 데이터가 삭제되었습니다.');
    } catch (err) {
      console.error('❌ 임시저장 데이터 삭제 실패:', err);
    }
  };

  /**
   * 임시저장 버튼 클릭 핸들러
   */
  const handleDraftAddClick = async () => {
    try {
      const draftData: TaskDraft = {
        archive: selectedArchiveCollection?.name || '',
        title,
        link: linkValue,
        memo,
      };

      await saveDraft(DRAFT_KEY, draftData);
      console.log('임시저장 완료:', draftData);
    } catch (err) {
      console.error('임시저장 실패:', err);
    }
  };

  const handleAddClick = () => {
    // TODO 추가하기 시 , 할 일 API 로직 연결 예정
    // TODO 이전에 할 일 추가 동작한 화면으로 Return
  };
  // [ ] TEST 지워야함
  // setShowConfirmDialog(true);

  /**
   * 임시저장 버튼 활성화 조건: title, linkValue, memo 중 한글자라도 입력하거나 모음 선택
   */
  const isDraftSaveEnabled =
    title.trim() !== '' ||
    linkValue.trim() !== '' ||
    memo.trim() !== '' ||
    selectedArchiveCollection !== null;

  /**
   * 추가하기 버튼 활성화 조건: 제목과 모음 선택 필수
   */
  const isAddButtonEnabled =
    title.trim() !== '' && selectedArchiveCollection !== null;

  /**
   * 제목 입력필드 상태 결정
   */
  const getTitleState = (): 'Enabled' | 'Focused' | 'Activated' => {
    if (titleFocused) return 'Focused';
    if (title) return 'Activated';
    return 'Enabled';
  };

  /**
   * 링크 입력필드 상태 결정
   */
  const getLinkState = ():
    | 'Enabled'
    | 'Focused'
    | 'Activated'
    | 'Error'
    | 'Link' => {
    if (error) return 'Error';
    if (linkFocused) return 'Focused';
    if (linkValue) return 'Activated';
    return 'Link';
  };

  /**
   * 에러 메시지 표시
   */
  const showErrorMessage = (): string | undefined => {
    if (!error) return undefined;

    const message =
      error.code === 'WEBVIEW_NOT_AVAILABLE'
        ? 'React Native WebView 환경이 아닙니다.'
        : error.code === 'MESSAGE_FAILED'
          ? `클립보드 읽기 실패: ${error.message}`
          : `오류: ${error.message}`;

    return message;
  };

  return (
    <div>
      {/* TODO 팀 컨벤션에 맞게 전역 state? 내부 state? 결정해 수정  */}
      {/* TODO 임시저장 조건 충족화면 */}
      <ModalLayout
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <FeedBack.ConfirmDialog
          title={`작성 중인 할 일을\n저장하고 나갈까요?`}
          positiveLabel='저장하고 나가기'
          negativeLabel='취소'
          onPositive={() => {
            // TODO 임시저장하고 나가기 이전 화면으로 이동
          }}
          onNegative={() => {
            // 모달 창만 사라지기
            setShowConfirmDialog(false);
          }}
        />
      </ModalLayout>

      <AppBar.BackDetailBar
        title='할 일 추가 (테스트)'
        rightIcons={['save']}
        isSaveDisabled={!isDraftSaveEnabled}
        onClickSave={handleDraftAddClick}
      />

      <div className='flex h-full flex-col gap-6 overflow-y-auto bg-white px-5 py-4'>
        {/* 테스트 패널 - 임시저장 테스트용 */}
        <div className='rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 p-4'>
          <p className='mb-3 text-body-md font-bold text-blue-900'>
            🧪 임시저장 테스트 패널
          </p>
          <div className='flex flex-col gap-2'>
            <button
              onClick={handleCreateTestDraft}
              className='rounded-lg bg-blue-500 px-4 py-2 text-body-sm font-semibold text-white hover:bg-blue-600'
            >
              1️⃣ 테스트 데이터 저장하기
            </button>
            <button
              onClick={handleLoadDraft}
              className='rounded-lg bg-green-500 px-4 py-2 text-body-sm font-semibold text-white hover:bg-green-600'
            >
              2️⃣ 임시저장 불러오기
            </button>
            <button
              onClick={handleClearDraft}
              className='rounded-lg bg-red-500 px-4 py-2 text-body-sm font-semibold text-white hover:bg-red-600'
            >
              3️⃣ 임시저장 삭제하기
            </button>
          </div>
          <p className='mt-2 text-body-xs text-blue-700'>
            💡 순서: 테스트 데이터 저장 → 임시저장 불러오기 → 데이터 확인
          </p>
        </div>

        {/* 담을 모음 선택 섹션 */}
        <CollectionChipSelector
          items={MOCK_COLLECTIONS}
          selectedId={selectedArchiveCollection?.id || ''}
          onSelect={handleCollectionSelect}
          expandedItemCount={8}
        />

        {/* 제목 섹션 */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <label className='text-body-lg font-semibold text-black'>
              제목
            </label>
            <span
              className={`text-body-sm ${
                title.length >= MAX_LENGTH ? 'text-error' : 'text-gray-500'
              }`}
            >
              {title.length}/{MAX_LENGTH}
            </span>
          </div>
          <InputField.TextInputField
            state={getTitleState()}
            placeholder='제목을 입력해주세요.'
            value={title}
            onChange={handleTitleChange}
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            width='w-full'
          />
        </div>

        {/* 링크(선택) 섹션 */}
        <div className='flex flex-col gap-2'>
          <label className='text-body-lg font-semibold text-black'>
            링크(선택)
          </label>
          <InputField.TextInputField
            state={getLinkState()}
            placeholder='링크를 입력해주세요.'
            errorMessage={error ? showErrorMessage() : undefined}
            buttonLabel={isLoading ? '로딩 중...' : '붙여넣기'}
            value={linkValue}
            onChange={handleLinkChange}
            onFocus={handleLinkFocus}
            onBlur={handleLinkBlur}
            onButtonClick={handlePasteClick}
            width='w-full'
          />
        </div>

        {/* 메모(선택) 섹션 */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <label className='text-body-lg font-semibold text-black'>
              메모(선택)
            </label>
            <span
              className={`text-body-sm ${
                memo.length >= MAX_LENGTH ? 'text-error' : 'text-gray-500'
              }`}
            >
              {memo.length}/{MAX_LENGTH}
            </span>
          </div>
          <textarea
            placeholder='메모를 입력해주세요.'
            value={memo}
            onChange={(e) => handleMemoChange(e.target.value)}
            className='h-[132px] w-full resize-none rounded-[10px] border border-grey-200 bg-white px-4 py-4 text-body-md text-grey-900 outline-none placeholder:text-grey-400'
          />
        </div>

        {/* 추가하기 버튼 */}
        <Button.CtaButton
          disabled={!isAddButtonEnabled}
          onClick={handleAddClick}
        >
          추가하기
        </Button.CtaButton>
      </div>
    </div>
  );
}

export default TestTaskCreatePage;
