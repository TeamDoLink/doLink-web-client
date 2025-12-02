import { useCallback, useState } from 'react';
import { InputField, Button, AppBar } from '@/components/common';
import { CollectionChipSelector, type CollectionChip } from '@/components/task';
import { useClipboardBridge } from '@/hooks/useClipboardBridge';

/**
 * 업무 생성 페이지
 * 할일 추가를 위한 전체 폼 페이지
 */
function TaskCreatePage() {
  const {
    linkValue,
    setLinkValue,
    requestClipboard,
    isLoading,
    error,
    clearError,
  } = useClipboardBridge();

  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [linkFocused, setLinkFocused] = useState(false);

  // 임시 데이터 - 실제로는 API에서 받아올 데이터
  const collections: CollectionChip[] = [
    { id: '1', label: '2025 연말 도쿄 여행' },
    { id: '2', label: '넷플릭스 볼 영화' },
    { id: '3', label: '가을 축제' },
    { id: '4', label: '게임 신작' },
    { id: '5', label: '아무거나' },
    { id: '6', label: '퇴사 후 할 일' },
    { id: '7', label: '재테크' },
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
   * 제목 입력필드 focus 핸들러
   */
  const handleTitleFocus = useCallback(() => {
    setTitleFocused(true);
  }, []);

  /**
   * 제목 입력필드 blur 핸들러
   */
  const handleTitleBlur = useCallback(() => {
    setTitleFocused(false);
  }, []);

  /**
   * 링크 입력필드 focus 핸들러
   */
  const handleLinkFocus = useCallback(() => {
    setLinkFocused(true);
  }, []);

  /**
   * 링크 입력필드 blur 핸들러
   */
  const handleLinkBlur = useCallback(() => {
    setLinkFocused(false);
  }, []);

  /**
   * 붙여넣기 버튼 클릭 핸들러
   */
  const handlePasteClick = useCallback(() => {
    clearError();
    requestClipboard();
  }, [requestClipboard, clearError]);

  /**
   * 링크 입력값 변경 핸들러
   */
  const handleLinkChange = useCallback(
    (value: string) => {
      setLinkValue(value);
      clearError();
    },
    [setLinkValue, clearError]
  );

  /**
   * 제목 입력값 변경 핸들러
   */
  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  /**
   * 추가하기 버튼 클릭 핸들러
   */
  const handleAddClick = useCallback(() => {
    // TODO: API 호출 구현
    console.log({
      title,
      collection: selectedCollectionId,
      link: linkValue,
      memo,
    });
  }, [title, selectedCollectionId, linkValue, memo]);

  /**
   * 추가하기 버튼 활성화 조건: 제목과 모음 선택 필수
   */
  const isAddButtonEnabled = title.trim() !== '' && selectedCollectionId !== '';

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
      <AppBar.BackDetailBar
        title='할 일 추가'
        rightIcons={['save']}
        isSaveDisabled={!isAddButtonEnabled}
        onClickSave={handleAddClick}
      />

      <div className='flex h-full flex-col gap-6 overflow-y-auto bg-white px-5 py-4'>
        {/* 담을 모음 선택 섹션 */}
        <CollectionChipSelector
          items={collections}
          selectedId={selectedCollectionId}
          onSelect={setSelectedCollectionId}
          expandedItemCount={8}
        />

        {/* 제목 섹션 */}
        <div className='flex flex-col gap-2'>
          <label className='text-body-lg font-semibold text-black'>제목</label>
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
          <label className='text-body-lg font-semibold text-black'>
            메모(선택)
          </label>
          <textarea
            placeholder='메모를 입력해주세요.'
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
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

export default TaskCreatePage;
