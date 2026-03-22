import heroIllustration from '@/assets/icons/home/home2.svg';

type GreetingSectionProps = {
  memberName: string;
  mainGreeting?: string;
  subGreeting?: string;
  categoryIcon?: string;
};

export const GreetingSection = ({
  memberName,
  mainGreeting = '만나서 반가워요',
  subGreeting,
  categoryIcon = heroIllustration,
}: GreetingSectionProps) => {
  return (
    <section
      data-testid='personalized-message'
      className='flex items-center justify-between'
    >
      {/* 문구 */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-body-lg text-grey-600'>{mainGreeting}</h1>
        <h2 className='text-heading-2xl text-black'>
          {subGreeting && (
            <>
              <span className='text-black'>{subGreeting} </span>
              <span className='text-point'>{memberName}님</span>
            </>
          )}
          {!subGreeting && <span className='text-black'>{memberName}님</span>}
        </h2>
      </div>
      {/* 일러스트 */}
      <img
        src={categoryIcon}
        alt='홈 일러스트'
        className='h-[90px] w-[90px] flex-shrink-0 object-contain'
      />
    </section>
  );
};
