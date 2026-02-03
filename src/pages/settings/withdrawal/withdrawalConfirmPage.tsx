import { useNavigate } from 'react-router-dom';

import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { Button, FeedBack } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useModalStore } from '@/stores/useModalStore';

const WithdrawalConfirmPage = () => {
  const navigate = useNavigate();
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
    openConfirm({
      title: '회원 탈퇴가 완료되었습니다.',
      subtitle: 'DoLink를 이용해 주셔서 감사합니다.',
      positiveLabel: '확인',
      onPositive: () => navigate(ROUTES.home, { replace: true }),
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

      <main className='flex flex-1 flex-col justify-between px-6 py-8'>
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
            className='flex-1 rounded-2xl py-4 text-body-lg'
          >
            탈퇴하기
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
