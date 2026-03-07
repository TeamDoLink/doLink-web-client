import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { Button } from '@/components/common';
import { SettingRadioOption } from '@/components/setting';
import { ROUTES } from '@/constants/routes';

const WITHDRAWAL_REASONS = [
  { id: 'infrequent', label: '앱을 자주 사용하지 않아요.' },
  { id: 'mismatch', label: '할 일을 관리하는 방식이 맞지 않아요.' },
  { id: 'notification', label: '알림/리마인드 기능이 부족해요.' },
  { id: 'findability', label: '원하는 기능을 찾기 어려워요.' },
  { id: 'etc', label: '기타' },
] as const;

const WithdrawalReasonPage = () => {
  const navigate = useNavigate();
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [etcReason, setEtcReason] = useState('');

  const trimmedEtcReason = etcReason.trim();
  const isEtcSelected = selectedReasonId === 'etc';
  const isSubmittable =
    selectedReasonId !== null &&
    (!isEtcSelected || trimmedEtcReason.length > 0);

  const handleSelectReason = (id: string) => {
    setSelectedReasonId(id);
    if (id !== 'etc') {
      setEtcReason('');
    }
  };

  const handleChangeEtcReason = (value: string) => {
    setEtcReason(value.slice(0, 200));
  };

  const handleSubmit = () => {
    if (!isSubmittable) return;
    const reasonLabel = WITHDRAWAL_REASONS.find(
      ({ id }) => id === selectedReasonId
    )?.label;

    navigate(ROUTES.settingsWithdrawalConfirm, {
      state: {
        reasonId: selectedReasonId,
        reasonLabel: isEtcSelected ? trimmedEtcReason : reasonLabel,
      },
    });
  };

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <BackDetailBar
        title='회원탈퇴'
        rightIcons={[]}
        onClickBack={() => navigate(-1)}
      />

      <main className='flex flex-1 flex-col p-6 pt-[calc(56px+24px)]'>
        <div>
          <h1 className='text-heading-xl font-semibold text-grey-900'>
            두링크를 사용해 주셔서 감사합니다.
          </h1>
          <p className='mt-3 text-body-lg text-grey-500'>
            이용 중 불편하거나 아쉬웠던 부분이 있으신가요?
            <br />
            의견을 남겨주시면 더 나은 서비스로 발전하는 데 많은 도움이 됩니다.
          </p>
        </div>

        <div className='mt-5 flex flex-col'>
          {WITHDRAWAL_REASONS.map(({ id, label }) => {
            const isSelected = selectedReasonId === id;
            const showEtcTextarea = id === 'etc' && isSelected;

            return (
              <div key={id} className='flex flex-col gap-2'>
                <SettingRadioOption
                  label={label}
                  selected={isSelected}
                  onSelect={() => handleSelectReason(id)}
                />
                {showEtcTextarea && (
                  <div className='flex flex-col gap-2'>
                    <textarea
                      value={etcReason}
                      onChange={(event) =>
                        handleChangeEtcReason(event.target.value)
                      }
                      placeholder='탈퇴 사유를 입력해주세요.'
                      className='h-[112px] w-full resize-none rounded-[10px] border border-grey-200 px-4 py-3 text-body-md text-grey-900 placeholder:text-grey-400'
                    />
                    <div className='text-right text-caption-sm text-grey-500'>
                      {etcReason.length}/200
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className='px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-4'>
        <Button.CtaButton
          type='button'
          disabled={!isSubmittable}
          onClick={handleSubmit}
        >
          의견 보내기
        </Button.CtaButton>
      </footer>
    </div>
  );
};

export default WithdrawalReasonPage;
