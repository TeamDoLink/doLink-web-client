import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { Button, FeedBack } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useModalStore } from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWithdraw, logout } from '@/api/generated/endpoints/user/user';

const WithdrawalConfirmPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { mutate: withdraw, isPending } = useWithdraw();
  const {
    isOpen: isModalOpen,
    type: modalType,
    confirmConfig,
    openConfirm,
    close: closeModal,
  } = useModalStore();

  const handleCancel = () => {
    navigate(ROUTES.home, { replace: true });
  };

  const handleWithdraw = () => {
    withdraw(undefined, {
      onSuccess: async () => {
        try {
          await logout();
        } catch {
          // 탈퇴 후 로그아웃 실패해도 무시
        }
        clearAuth();
        queryClient.clear();
        openConfirm({
          title: '회원 탈퇴가 완료되었습니다.',
          subtitle: 'DoLink를 이용해 주셔서 감사합니다.',
          positiveLabel: '확인',
          onPositive: () => navigate(ROUTES.home, { replace: true }),
        });
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleModalClose = () => {
    if (modalType === 'confirm') {
      confirmConfig?.onNegative?.();
    }
    closeModal();
  };

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <BackDetailBar
        title='회원탈퇴'
        rightIcons={[]}
        onClickBack={handleBack}
      />

      <main className='flex flex-1 flex-col justify-between px-6 py-8 pt-[calc(56px+32px)]'>
        <section className='space-y-3'>
          <h1 className='text-heading-xl font-semibold text-grey-900'>
            탈퇴 시 할 일과 모음을 포함한
            <br />
            모든 데이터가 즉시 영구 삭제되며
            <br />
            복구할 수 없습니다.
          </h1>
          <h2 className='text-heading-xl font-semibold text-grey-900'>
            정말 탈퇴하시겠어요?
          </h2>
        </section>

        <div className='flex gap-3'>
          <Button.BlueButton
            onClick={handleCancel}
            className='flex-1 rounded-2xl py-4 text-body-lg'
          >
            취소하기
          </Button.BlueButton>
          <Button.CtaButton
            onClick={handleWithdraw}
            disabled={isPending}
            className='flex-1 rounded-2xl py-4 text-body-lg'
          >
            {isPending ? '처리 중...' : '탈퇴하기'}
          </Button.CtaButton>
        </div>
      </main>

      <FeedBack.ModalLayout
        open={isModalOpen && modalType === 'confirm'}
        onClose={handleModalClose}
      >
        {modalType === 'confirm' && confirmConfig && (
          <FeedBack.ConfirmDialog
            title={confirmConfig.title}
            subtitle={confirmConfig.subtitle}
            positiveLabel={confirmConfig.positiveLabel}
            negativeLabel={confirmConfig.negativeLabel}
            onPositive={() => {
              confirmConfig.onPositive?.();
              closeModal();
            }}
            onNegative={
              confirmConfig.negativeLabel
                ? () => {
                    confirmConfig.onNegative?.();
                    closeModal();
                  }
                : undefined
            }
          />
        )}
      </FeedBack.ModalLayout>
    </div>
  );
};

export default WithdrawalConfirmPage;
