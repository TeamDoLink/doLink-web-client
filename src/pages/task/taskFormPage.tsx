import { useEffect, useMemo, useState } from 'react';
import { InputField, Button, AppBar, FeedBack } from '@/components/common';
import { CollectionChipSelector, type CollectionChip } from '@/components/task';
import { useClipboardBridge } from '@/hooks/useClipboardBridge';
import { useDraftBridge } from '@/hooks/useDraftBridge';
import type { TaskDraft } from '@/types/draft';
import { ModalLayout } from '@/components/common/feedBack';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useCreate,
  useGetTask,
  useUpdateTask,
} from '@/api/generated/endpoints/task/task';
import { useListCollectSelectOptions } from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseListCollectionSimpleResponse,
  ApiResponseTaskResponse,
} from '@/api/generated/models';

// 임시저장 키
const DRAFT_KEY = 'task-create-draft';

/**
 * 할 일 생성/수정 페이지
 * 할 일 추가 및 수정을 위한 전체 폼 페이지
 */
function TaskFormPage() {
  const MAX_LENGTH = 100; // 가장 일반적인 경우
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { clipboardLinkValue, requestClipboard, hasClipboardLink, error } =
    useClipboardBridge();

  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  // 모음 선택 목록 API
  const { data: collectionsData } = useListCollectSelectOptions();

  const collections: CollectionChip[] = useMemo(
    () =>
      (
        (collectionsData as unknown as ApiResponseListCollectionSimpleResponse)
          ?.result ?? []
      ).map((item) => ({
        id: String(item.collectionId),
        label: item.name ?? '',
      })),
    [collectionsData]
  );

  // 할 일 상세 (수정 모드에서만 사용)
  const { data: taskData } = useGetTask(Number(id), {
    query: { enabled: isEditMode },
  });
  const apiTaskData = taskData as unknown as ApiResponseTaskResponse;
  const task = apiTaskData?.result;

  // 할 일 생성/수정 API
  const { mutate: createTask, isPending: isCreating } = useCreate();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  // TODO 임시저장 불러오기 시  isLoading  error 화면 UI 처리
  const { saveDraft, loadDraft, deleteDraft } = useDraftBridge<TaskDraft>();

  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [linkValue, setLinkValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 선택된 아카이브 모음 상태
  const [selectedArchiveCollection, setSelectedArchiveCollection] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [linkFocused, setLinkFocused] = useState(false);

  const isPending = isCreating || isUpdating;

  // 수정 모드일 때 API 결과로 초기값 세팅
  useEffect(() => {
    if (!isEditMode || !task || !collections.length) return;

    setTitle(task.title ?? '');
    setLinkValue(task.link ?? '');
    setMemo(task.memo ?? '');

    if (task.collectionId != null) {
      const found = collections.find((c) => Number(c.id) === task.collectionId);
      if (found) {
        setSelectedArchiveCollection({ id: found.id, name: found.label });
      }
    }
  }, [isEditMode, task, collections]);

  /**
   * 페이지 진입 시 임시저장 복구
   */
  useEffect(() => {
    const restoreDraft = async () => {
      // 수정 모드일 때는 임시저장 복구 사용 안 함
      if (isEditMode) return;
      // location.state로 전달된 restoreDraft 확인
      const shouldRestore = (
        location.state as { restoreDraft?: boolean } | null | undefined
      )?.restoreDraft;

      if (shouldRestore === false) {
        // 새로 작성 선택 시 임시저장 삭제
        try {
          await deleteDraft(DRAFT_KEY);
        } catch (err) {
          console.error('임시저장 삭제 실패:', err);
        }

        return;
      }

      if (shouldRestore === true) {
        // 이어서 작성 선택 시 임시저장 복구
        try {
          const draft = await loadDraft(DRAFT_KEY);
          if (draft) {
            setTitle(draft.title || '');
            setLinkValue(draft.link || '');
            setMemo(draft.memo || '');
            if (draft.archive) {
              // archive 이름으로 collection 찾기
              const collection = collections.find(
                (c) => c.label === draft.archive
              );
              if (collection) {
                setSelectedArchiveCollection({
                  id: collection.id,
                  name: collection.label,
                });
              }
            }
          }
        } catch (err) {
          console.error('임시저장 복구 실패:', err);
        }
      }
    };

    restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, isEditMode]);

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
    requestClipboard();
  };

  /**
   * 링크 입력필드 blur 핸들러
   */
  const handleLinkBlur = () => {
    setLinkFocused(false);
  };

  /**
   * 링크 입력값 변경 핸들러
   */
  const handleLinkChange = (value: string) => {
    setLinkValue(value);
  };

  /**
   * 클립보드에서 붙여넣기
   */
  const handlePasteFromClipboard = () => {
    setLinkValue(clipboardLinkValue);
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
    const selected = collections.find((item) => item.id === id);
    if (selected) {
      setSelectedArchiveCollection({
        id: selected.id,
        name: selected.label,
      });
    }
  };

  const handleSaveDraft = async () => {
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
      throw err;
    }
  };

  const handleAddClick = () => {
    if (!selectedArchiveCollection) return;

    if (isEditMode && task) {
      updateTask(
        {
          taskId: Number(id),
          data: {
            collectionId: Number(selectedArchiveCollection.id),
            title,
            link: linkValue || undefined,
            memo: memo || undefined,
          },
        },
        {
          onSuccess: () => {
            navigate(-1);
          },
        }
      );
      return;
    }

    createTask(
      {
        data: {
          collectionId: Number(selectedArchiveCollection.id),
          title,
          link: linkValue || undefined,
          memo: memo || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  /**
   * 뒤로가기 버튼 클릭 핸들러
   */
  const handleBackClick = () => {
    // 입력된 내용이 있으면 확인 모달 표시
    if (isDraftSaveEnabled) {
      setShowConfirmDialog(true);
    } else {
      // 입력된 내용이 없으면 바로 이동
      navigate(-1);
    }
  };

  /**
   * 저장하고 나가기
   */
  const handleSave = async () => {
    try {
      await handleSaveDraft();
      navigate(-1);
    } catch (err) {
      console.error('저장 후 나가기 실패:', err);
    }
  };

  const hanldeCancel = async () => {
    setShowConfirmDialog(false);
  };

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
    if (linkValue) return 'Activated';
    if (hasClipboardLink) return 'Link'; // 클립보드에 링크 있으면 버튼 표시
    if (linkFocused) return 'Focused'; // 포커스했지만 클립보드에 링크 없음
    return 'Enabled'; // 기본 상태
  };

  /**
   * 에러 메시지 표시
   */
  const getErrorMessage = (): string | undefined => {
    if (!error) return undefined;

    if (error.code === 'WEBVIEW_NOT_AVAILABLE') {
      return 'React Native WebView 환경이 아닙니다.';
    }
    if (error.code === 'MESSAGE_FAILED') {
      return `클립보드 읽기 실패: ${error.message}`;
    }
    return `오류: ${error.message}`;
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
          onPositive={handleSave}
          onNegative={hanldeCancel}
        />
      </ModalLayout>

      <AppBar.BackDetailBar
        title={isEditMode ? '할 일 수정' : '할 일 추가'}
        rightIcons={isEditMode ? [] : ['save']}
        isSaveDisabled={!isDraftSaveEnabled}
        onClickSave={() => setShowConfirmDialog(true)}
        onClickBack={handleBackClick}
      />

      <div className='flex h-full flex-col gap-6 overflow-y-auto bg-white px-5 py-4'>
        {/* 담을 모음 선택 섹션 */}
        <CollectionChipSelector
          items={collections}
          selectedId={selectedArchiveCollection?.id || ''}
          onSelect={handleCollectionSelect}
          expandedItemCount={8}
        />

        {/* 제목 섹션 */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='task-title'
              className='text-body-lg font-semibold text-black'
            >
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
            id='task-title'
            name='title'
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
          <label
            htmlFor='task-link'
            className='text-body-lg font-semibold text-black'
          >
            링크(선택)
          </label>
          <InputField.TextInputField
            id='task-link'
            name='link'
            state={getLinkState()}
            placeholder='링크를 입력해주세요.'
            errorMessage={getErrorMessage()}
            buttonLabel={hasClipboardLink ? '붙여넣기' : undefined}
            value={linkValue}
            onChange={handleLinkChange}
            onFocus={handleLinkFocus}
            onBlur={handleLinkBlur}
            onButtonClick={
              hasClipboardLink ? handlePasteFromClipboard : undefined
            }
            width='w-full'
          />
        </div>

        {/* 메모(선택) 섹션 */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='task-memo'
              className='text-body-lg font-semibold text-black'
            >
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
            id='task-memo'
            name='memo'
            placeholder='메모를 입력해주세요.'
            value={memo}
            onChange={(e) => handleMemoChange(e.target.value)}
            className='h-[132px] w-full resize-none rounded-[10px] border border-grey-200 bg-white px-4 py-4 text-body-md text-grey-900 outline-none placeholder:text-grey-400 focus:border-grey-800'
          />
        </div>

        {/* 추가하기 버튼 */}
        <Button.CtaButton
          disabled={!isAddButtonEnabled || isPending}
          onClick={handleAddClick}
          className='w-full'
        >
          {isEditMode ? '수정하기' : '추가하기'}
        </Button.CtaButton>
      </div>
    </div>
  );
}

export default TaskFormPage;
