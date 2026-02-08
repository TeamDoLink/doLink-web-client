import { Button } from '@/components/common';
import empty_message from '@/assets/icons/common/empty_message.svg';

const ServerOfflinePage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-grey-50 px-5'>
      <div className='flex flex-col items-center gap-6 pb-20'>
        <div className='relative size-16'>
          <img src={empty_message} alt='Error' className='block size-full' />
        </div>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-heading-lg text-grey-900'>
            서버와 연결할 수 없습니다
          </h1>
          <p className='text-body-lg text-grey-500'>
            현재 서버가 점검 중이거나 잠시 중단되었을 수 있습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <Button.CtaButton onClick={handleRetry} className='mt-4 min-w-[160px]'>
          다시 시도하기
        </Button.CtaButton>
      </div>
    </div>
  );
};

export default ServerOfflinePage;
