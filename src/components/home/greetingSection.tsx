import heroIllustration from '@/assets/icons/home/home2.svg';

type GreetingSectionProps = {
  memberName: string;
  greeting: string;
};

export const GreetingSection = ({
  memberName,
  greeting,
}: GreetingSectionProps) => {
  return (
    <section className='flex items-center justify-between'>
      {/* 문구 */}
      <div className='flex flex-col gap-1'>
        <p className='text-heading-sm text-grey-500'>{greeting}</p>
        <h1 className='text-display-2xl text-black'>
          만나서 반가워요
          <br />
          <span className='text-display-2xl text-black'>{memberName}님</span>
        </h1>
      </div>
      {/* 일러스트 */}
      <img
        src={heroIllustration}
        alt='홈 일러스트'
        className='h-[120px] w-[130px] flex-shrink-0 object-contain'
      />
    </section>
  );
};
