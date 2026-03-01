import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FeedBack } from '@/components/common';
import { useDraftBridge } from '@/hooks/useDraftBridge';
import { useAuthStore } from '@/stores/useAuthStore';
import type { TaskDraft } from '@/types/draft';
import { ROUTES } from '@/constants/routes';

const DRAFT_KEY = 'task-create-draft';

/**
 * + 버튼(할 일 추가) 공통 액션 훅
 *
 * 1. 비로그인 → 로그인 토스트 표시 (3초 후 자동 사라짐)
 * 2. 로그인 + 임시저장 있음 → 임시저장 다이얼로그 (createPortal)
 * 3. 로그인 + 임시저장 없음 → taskCreate 바로 이동
 *
 * @returns handleFloatingButtonClick - + 버튼 onClick에 연결
 * @returns portalNode - 컴포넌트 JSX에 {portalNode} 추가 필요
 */
export const useTaskCreateAction = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { loadDraft } = useDraftBridge<TaskDraft>();

  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  const handleFloatingButtonClick = async () => {
    if (!isAuthenticated) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }

    try {
      const draft = await loadDraft(DRAFT_KEY);
      if (draft) {
        setShowDraftDialog(true);
      } else {
        navigate(ROUTES.taskCreate);
      }
    } catch {
      navigate(ROUTES.taskCreate);
    }
  };

  const handleRestoreDraft = () => {
    setShowDraftDialog(false);
    navigate(ROUTES.taskCreate, { state: { restoreDraft: true } });
  };

  const handleDiscardDraft = () => {
    setShowDraftDialog(false);
    navigate(ROUTES.taskCreate, { state: { restoreDraft: false } });
  };

  const portalNode = createPortal(
    <>
      <FeedBack.ModalLayout
        open={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
      >
        <FeedBack.ConfirmDialog
          title={`작성 중인 할 일이 있어요.\n이어서 작성할까요?`}
          positiveLabel='이어서 작성하기'
          negativeLabel='새로 작성하기'
          onPositive={handleRestoreDraft}
          onNegative={handleDiscardDraft}
        />
      </FeedBack.ModalLayout>

      {showLoginToast && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast message='로그인이 필요해요.' />
        </div>
      )}
    </>,
    document.body
  );

  return {
    handleFloatingButtonClick,
    portalNode,
  };
};
