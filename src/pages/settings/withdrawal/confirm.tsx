import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { Button, FeedBack } from '@/components/common';
import { ROUTES } from '@/constants/routes';

const WithdrawalConfirmPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleCancel = () => {
    navigate(ROUTES.home, { replace: true });
  };

  const handleWithdraw = () => {
    setOpenModal(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleConfirmWithdrawal = () => {
    setOpenModal(false);
    navigate(ROUTES.home, { replace: true });
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

      <FeedBack.ModalLayout open={openModal} onClose={handleModalClose}>
        <FeedBack.ConfirmDialog
          title='회원 탈퇴가 완료되었습니다.'
          subtitle='DoLink를 이용해 주셔서 감사합니다.'
          positiveLabel='확인'
          onPositive={handleConfirmWithdrawal}
          onNegative={handleModalClose}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default WithdrawalConfirmPage;
