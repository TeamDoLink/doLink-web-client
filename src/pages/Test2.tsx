import { useState } from 'react';
import { TodoBottomSheet } from '@/components/common/bottomSheet/todoBottomSheet';
import { CtaSecondButton } from '@/components/common/button/ctaSecondButton';
import { FlagLabel } from '@/components/common/label/flagLabel';
import { LinkCapsuleButton } from '@/components/common/button/linkCapsuleButton';
import { ShareCapsuleButton } from '@/components/common/button/shareCapsuleButton';
import { TabButton } from '@/components/common/button/tabButton';
import { OptionMenu } from '@/components/common/menu/optionMenu';

const TabButtonShowcase = () => {
  const [selected, setSelected] = useState<'left' | 'right'>('left');

  return (
    <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
      <div className='flex gap-3'>
        <TabButton
          selected={selected === 'left'}
          onClick={() => setSelected('left')}
        >
          왼쪽 탭
        </TabButton>
        <TabButton
          selected={selected === 'right'}
          onClick={() => setSelected('right')}
        >
          오른쪽 탭
        </TabButton>
      </div>
    </div>
  );
};

const TodoBottomSheetShowcase = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className='flex w-full max-w-md flex-col gap-4 rounded-3xl bg-grey-100 p-6'>
      {open ? (
        <TodoBottomSheet
          title='할 일 담기'
          onClickAddCollection={() => undefined}
          onClose={() => setOpen(false)}
        >
          <div className='flex flex-col gap-2 rounded-2xl bg-grey-50 p-4 text-body-sm text-grey-600'>
            <p>핸들을 아래로 드래그하면 시트가 닫혀요.</p>
            <p>닫힌 뒤에는 버튼으로 다시 열어 테스트할 수 있습니다.</p>
          </div>
        </TodoBottomSheet>
      ) : (
        <div className='flex flex-col items-start gap-2'>
          <p className='text-body-sm text-grey-600'>
            드래그 제스처를 확인했으면 다시 열어보세요.
          </p>
          <CtaSecondButton onClick={() => setOpen(true)}>
            바텀시트 열기
          </CtaSecondButton>
        </div>
      )}
    </div>
  );
};

const CapsuleButtonShowcase = () => (
  <div className='flex flex-col gap-4 rounded-3xl bg-grey-100 p-6'>
    <div className='flex gap-2'>
      <LinkCapsuleButton />
      <ShareCapsuleButton />
    </div>
    <div className='flex gap-2'>
      <LinkCapsuleButton disabled />
      <ShareCapsuleButton disabled />
    </div>
  </div>
);

const sections = [
  {
    title: 'Option Menu',
    description:
      '아이콘과 텍스트를 포함한 두 가지 액션 메뉴입니다. 항목을 클릭하면 해당 항목만 하이라이트됩니다.',
    component: (
      <div className='flex flex-wrap gap-3 rounded-3xl bg-grey-100 p-6'>
        <OptionMenu />
      </div>
    ),
  },
  {
    title: 'Capsule Buttons',
    description:
      '링크 원본과 공유 액션을 개별 버튼으로 제공하는 캡슐형 UI입니다. disabled 상태에서는 연한 회색으로 표시됩니다.',
    component: <CapsuleButtonShowcase />,
  },
  {
    title: 'Flag Label',
    description:
      '완료/미완료 상태에 따라 배경과 텍스트 컬러가 달라지는 라벨입니다.',
    component: (
      <div className='flex gap-3 rounded-3xl bg-grey-100 p-6'>
        <FlagLabel completed>완료</FlagLabel>
        <FlagLabel>미완료</FlagLabel>
      </div>
    ),
  },
  {
    title: 'CTA Second Button',
    description:
      '배경은 point 컬러 20% 투명도, active 시 40%로 변경되는 보조 CTA 버튼입니다.',
    component: (
      <div className='flex flex-wrap gap-4 rounded-3xl bg-grey-100 p-6'>
        <CtaSecondButton>텍스트</CtaSecondButton>
        <CtaSecondButton disabled>텍스트</CtaSecondButton>
      </div>
    ),
  },
  {
    title: 'Tab Button',
    description:
      '선택 여부에 따라 텍스트 컬러를 달리하는 탭 스타일 버튼입니다.',
    component: <TabButtonShowcase />,
  },
  {
    title: 'Todo Bottom Sheet',
    description:
      '상단 핸들바와 “모음 추가” 액션을 포함한 할 일 담기 바텀시트 래퍼입니다.',
    component: <TodoBottomSheetShowcase />,
  },
];

const Test2 = () => {
  return (
    <main className='min-h-screen w-full bg-grey-50 px-6 py-10 text-grey-900'>
      <div className='mx-auto flex max-w-4xl flex-col gap-8'>
        <header className='space-y-3'>
          <p className='text-sm font-semibold text-grey-500'>/test2</p>
          <h1 className='text-3xl font-bold'>UI Test 페이지 2</h1>
        </header>

        {sections.map(({ title, description, component }) => (
          <section key={title} className='rounded-2xl bg-white p-6 shadow-sm'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold'>{title}</h2>
              <p className='text-sm text-grey-600'>{description}</p>
            </div>
            <div className='mt-4'>{component}</div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default Test2;
