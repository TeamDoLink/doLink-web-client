import { CtaButton } from '@/components/common/ctaButton';
import { FloatingButton } from '@/components/common/floatingButton';
import { TextButton } from '@/components/common/textButton';
import { BottomTabBar } from '@/components/common/bottomTabBar';
import { ChipButton } from '@/components/common/chipButton';
import { BlueButton } from '@/components/common/blueButton';
import { GreyButton } from '@/components/common/greyButton';
import { IconButton } from '@/components/common/iconButton';
import { BackDetailBar } from '@/components/appBar/backDetailBar';
import { Setting } from '@/components/common/setting';
import { GreyLine } from '@/components/common/greyLine';
import { GradientBackground } from '@/components/common/gradientBackground';
import { HomeAppBar } from '@/components/appBar/homeAppBar';
import { SearchAppBar } from '@/components/appBar/searchAppBar';
import { BlackLine } from '@/components/common/blackLine';

const sections = [
  {
    title: 'CTA Button',
    description:
      '가로 320px · 세로 56px의 기본 CTA입니다. 활성 상태는 point 컬러 배경 + 화이트 텍스트, disabled면 배경을 비우고 텍스트만 grey-400으로 표시합니다.',
    component: (
      <div className="flex flex-wrap gap-4">
        <CtaButton>버튼</CtaButton>
        <CtaButton disabled>비활성 버튼</CtaButton>
      </div>
    ),
  },
  {
    title: 'Chip Button',
    description:
      'radius 6px, px-3 py-2 패딩을 가진 토글형 칩입니다. 컴포넌트 내부에서 상태를 관리하며 선택 시 point 컬러 테두리/텍스트가 활성화됩니다.',
    component: (
      <div className="gap- flex flex-wrap">
        <ChipButton>2025 연말 도쿄여행</ChipButton>
      </div>
    ),
  },
  {
    title: 'Blue Button',
    description:
      'body-sm 폰트, px-2 · py-[7px]을 쓰는 point 계열 칩 버튼입니다. visualState prop으로 enabled/pressed/disabled를 미리보기 할 수 있고 상태에 따라 투명도만 조정합니다.',
    component: (
      <div className="flex flex-col gap-3">
        <BlueButton visualState="enabled">텍스트</BlueButton>
        <BlueButton visualState="disabled">텍스트</BlueButton>
      </div>
    ),
  },
  {
    title: 'Grey Button',
    description:
      'Blue Button과 레이아웃은 같고 grey 팔레트를 씁니다. enabled/pressed는 grey-800 텍스트, disabled는 grey-400 텍스트로 고정됩니다.',
    component: (
      <div className="flex flex-col gap-3">
        <GreyButton visualState="enabled">텍스트</GreyButton>
        <GreyButton visualState="disabled">텍스트</GreyButton>
      </div>
    ),
  },
  {
    title: 'Icon Button',
    description:
      'Blue Button 색 체계를 따르면서 오른쪽에 more.svg 아이콘을 붙인 칩입니다. radius 20, pl-3 pr-2 py-[7px]이며 visualState로 상태를 고정할 수 있습니다.',
    component: (
      <div className="flex flex-col gap-3">
        <IconButton label="로그인하기" visualState="enabled" />
        <IconButton label="로그인하기" visualState="disabled" />
      </div>
    ),
  },
  {
    title: 'Text Button',
    description:
      '텍스트만 표시하는 보조 버튼입니다. p-2, body-lg 폰트를 쓰며 활성 시 point 컬러, disabled 시 grey-400으로 표시합니다.',
    component: (
      <div className="flex flex-wrap gap-4">
        <TextButton>임시저장</TextButton>
        <TextButton disabled>임시저장</TextButton>
      </div>
    ),
  },
  {
    title: 'Floating Button',
    description:
      '지름 52px 원형 FAB입니다. enabled엔 블랙 배경 + #000425/28% 그림자를 쓰고, pressed는 grey-600 배경, disabled는 아이콘만 grey-600으로 바뀝니다.',
    component: (
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col items-center gap-2">
          <FloatingButton aria-label="Enabled plus" />
          <span className="text-caption text-grey-500">Enabled</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FloatingButton visualState="disabled" aria-label="Disabled plus" />
          <span className="text-caption text-grey-500">Disabled</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Bottom Tab Bar',
    description:
      '홈/모음/설정 3개 탭을 기본으로 제공하는 하단 내비입니다. 내부 state로 선택 값을 보관하며 onChange를 넘기면 외부 제어도 가능합니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <BottomTabBar />
      </div>
    ),
  },
  {
    title: 'Back Detail Bar',
    description:
      '디테일 화면 상단바입니다. 좌측 back.svg, 우측 option-36.svg 아이콘(각 36px)을 쓰며 showBackButton/showOptionButton으로 노출을 제어합니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <BackDetailBar title="Title" />
      </div>
    ),
  },
  {
    title: 'Home App Bar',
    description:
      '홈 첫 화면 전용 상단바입니다. 좌우 20px/상하 10px 여백을 두고 좌측에 65.23×20 로고, 우측에 search-24.svg 버튼을 배치했습니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <HomeAppBar />
      </div>
    ),
  },
  {
    title: 'Search App Bar',
    description:
      'Home App Bar 레이아웃을 그대로 쓰되 좌측은 heading-xl · black 텍스트를 props로 받아 렌더링하는 버전입니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <SearchAppBar title="title" />
      </div>
    ),
  },
  {
    title: 'Setting Row',
    description:
      '높이 56px, 좌우 12px 패딩을 가진 리스트형 버튼입니다. 좌측 큰 텍스트와 우측 보조 텍스트/화살표를 조합해 설정 행을 표현합니다.',
    component: (
      <div className="w-full max-w-md space-y-3 rounded-3xl bg-grey-100 p-6">
        <Setting leftText="텍스트" rightText="텍스트" />
      </div>
    ),
  },
  {
    title: 'Grey Line',
    description:
      '가로 375px, 세로 1px의 기본 구분선입니다. grey-200 컬러를 사용합니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <GreyLine />
      </div>
    ),
  },
  {
    title: 'Black Line',
    description: '색상 #0D0F20, 가로 2px · 세로 20px 크기의 세로 구분선입니다.',
    component: (
      <div className="w-full max-w-md rounded-3xl bg-grey-100 p-6">
        <BlackLine />
      </div>
    ),
  },
  {
    title: 'Gradient Background',
    description:
      '기본 배경색은 #f2f3f7이며 상단 272px에는 white → transparent 그라데이션 오버레이를 깔아 화면 깊이를 줍니다.',
    component: (
      <div className="w-full max-w-md bg-grey-100 p-6">
        <GradientBackground className="mx-auto" />
      </div>
    ),
  },
];

const Test = () => {
  return (
    <main className="min-h-screen w-full bg-grey-50 px-6 py-10 text-grey-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-grey-500">/test</p>
          <h1 className="text-3xl font-bold">UI Test 페이지</h1>
        </header>

        {sections.map(({ title, description, component }) => (
          <section key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-grey-600">{description}</p>
            </div>

            <div className="mt-4 border border-dashed border-grey-200 bg-grey-50 p-4">
              {component}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default Test;
