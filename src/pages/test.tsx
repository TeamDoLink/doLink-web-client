import { CtaButton } from '@/components/common/button/ctaButton';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { TextButton } from '@/components/common/button/textButton';
import { BottomTabBar } from '@/components/common/tabBar/bottomTabBar';
import { ChipButton } from '@/components/common/button/chipButton';
import { BlueButton } from '@/components/common/button/blueButton';
import { GreyButton } from '@/components/common/button/greyButton';
import { IconButton } from '@/components/common/button/iconButton';
import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { SettingMenuItem } from '@/components/common/setting/settingMenuItem';
import { GreyLine } from '@/components/common/line/greyLine';
import { GradientBackground } from '@/components/common/background/gradientBackground';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { SearchAppBar } from '@/components/common/appBar/searchAppBar';
import { BlackLine } from '@/components/common/line/blackLine';
import { useMemo, useState } from 'react';
import { FeedBack, List, InputField, Filter } from '../components/common';
import ModalLayout from '@/components/common/feedBack/modalLayout';
import {
  CategoryEditorIconImage,
  CategoryHomeIconImage,
} from '@/constants/images';
import { SwipeableDeleteCard } from '@/components/archive/swipeableDeleteCard';

const ChipButtonDemo = () => {
  const [selected, setSelected] = useState(false);

  return (
    <ChipButton
      selected={selected}
      onClick={() => setSelected((prev) => !prev)}
    >
      2025 연말 도쿄여행
    </ChipButton>
  );
};

const SwipeableDeleteCardDemo = () => {
  const sampleTasks = useMemo(
    () => [
      {
        taskId: 101,
        title: '오늘 읽을 기사',
        link: 'https://example.com/article',
        memo: '새 기능 참고',
        status: false,
        inout: false,
        createdAt: '2025-02-01T10:00:00Z',
        modifiedAt: '2025-02-01T10:00:00Z',
      },
      {
        taskId: 102,
        title: '저장한 아카이브',
        link: 'https://example.com/archive',
        memo: null,
        status: false,
        inout: false,
        createdAt: '2025-02-01T10:00:00Z',
        modifiedAt: '2025-02-02T08:30:00Z',
      },
    ],
    []
  );

  const [linkStates, setLinkStates] = useState<Record<number, boolean>>(() =>
    sampleTasks.reduce<Record<number, boolean>>((acc, task) => {
      acc[task.taskId] = false;
      return acc;
    }, {})
  );
  const [linkEditModes, setLinkEditModes] = useState<Record<number, boolean>>(
    () =>
      sampleTasks.reduce<Record<number, boolean>>((acc, task) => {
        acc[task.taskId] = false;
        return acc;
      }, {})
  );
  const [capsuleDisabled, setCapsuleDisabled] = useState(false);

  const handleCheck = (linkId: number, checked: boolean) => {
    setLinkStates((prev) => ({ ...prev, [linkId]: checked }));
  };

  const handleEditModeChange = (isEditMode: boolean) => {
    setLinkEditModes((prev) => {
      const next = { ...prev };
      sampleTasks.forEach((task) => {
        next[task.taskId] = isEditMode;
      });
      return next;
    });
  };

  const toggleCapsuleDisabled = () => {
    setCapsuleDisabled((prev) => !prev);
  };

  return (
    <div className='flex flex-col gap-4'>
      <button
        type='button'
        className='w-fit rounded-md border border-grey-300 px-3 py-2 text-sm text-grey-700'
        onClick={toggleCapsuleDisabled}
      >
        캡슐 버튼 {capsuleDisabled ? '활성화' : '비활성화'} 전환
      </button>
      <SwipeableDeleteCard
        tasks={sampleTasks}
        createdAt={new Date('2025-02-01T10:00:00Z')}
        linkStates={linkStates}
        linkEditModes={linkEditModes}
        onCheck={handleCheck}
        onEditModeChange={handleEditModeChange}
        onOriginalClick={(linkId) => alert(`원본 보기: ${linkId}`)}
        onShareClick={(linkId) => alert(`공유: ${linkId}`)}
        onEditClick={(linkId) => alert(`편집: ${linkId}`)}
        onDeleteClick={(linkId) => alert(`삭제: ${linkId}`)}
        capsuleDisabled={capsuleDisabled}
      />
    </div>
  );
};

const sections = [
  {
    title: 'CTA Button',
    description:
      '가로 320px · 세로 56px의 기본 CTA입니다. 활성 상태는 point 컬러 배경 + 화이트 텍스트, disabled면 배경을 비우고 텍스트만 grey-400으로 표시합니다.',
    component: (
      <div className='flex flex-wrap gap-4'>
        <CtaButton>버튼</CtaButton>
        <CtaButton disabled>비활성 버튼</CtaButton>
      </div>
    ),
  },
  {
    title: 'Swipeable Delete Card',
    description:
      '같은 날짜에 묶인 링크 리스트를 스와이프해 삭제하는 컴포넌트입니다. edit 모드 전환과 캡슐 버튼 비활성 상태를 토글해볼 수 있습니다.',
    component: <SwipeableDeleteCardDemo />,
  },
  {
    title: 'Chip Button',
    description:
      'radius 6px, px-3 py-2 패딩을 가진 토글형 칩입니다. 외부에서 selected 상태를 내려 제어하며, 선택 시 point 컬러 테두리/텍스트가 활성화됩니다.',
    component: (
      <div className='flex flex-wrap gap-4'>
        <ChipButtonDemo />
      </div>
    ),
  },
  {
    title: 'Blue Button',
    description:
      'body-sm 폰트, px-2 · py-[7px]을 쓰는 point 계열 칩 버튼입니다. visualState prop으로 enabled/pressed/disabled를 미리보기 할 수 있고 상태에 따라 투명도만 조정합니다.',
    component: (
      <div className='flex flex-col gap-3'>
        <BlueButton visualState='enabled'>텍스트</BlueButton>
        <BlueButton visualState='disabled'>텍스트</BlueButton>
      </div>
    ),
  },
  {
    title: 'Grey Button',
    description:
      'Blue Button과 레이아웃은 같고 grey 팔레트를 씁니다. enabled/pressed는 grey-800 텍스트, disabled는 grey-400 텍스트로 고정됩니다.',
    component: (
      <div className='flex flex-col gap-3'>
        <GreyButton visualState='enabled'>텍스트</GreyButton>
        <GreyButton visualState='disabled'>텍스트</GreyButton>
      </div>
    ),
  },
  {
    title: 'Icon Button',
    description:
      'Blue Button 색 체계를 따르면서 오른쪽에 more.svg 아이콘을 붙인 칩입니다. radius 20, pl-3 pr-2 py-[7px]이며 visualState로 상태를 고정할 수 있습니다.',
    component: (
      <div className='flex flex-col gap-3'>
        <IconButton label='로그인하기' visualState='enabled' />
        <IconButton label='로그인하기' visualState='disabled' />
      </div>
    ),
  },
  {
    title: 'Text Button',
    description:
      '텍스트만 표시하는 보조 버튼입니다. p-2, body-lg 폰트를 쓰며 활성 시 point 컬러, disabled 시 grey-400으로 표시합니다.',
    component: (
      <div className='flex flex-wrap gap-4'>
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
      <div className='flex flex-wrap gap-6'>
        <div className='flex flex-col items-center gap-2'>
          <FloatingButton aria-label='Enabled plus' />
          <span className='text-caption-sm text-grey-500'>Enabled</span>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <FloatingButton visualState='disabled' aria-label='Disabled plus' />
          <span className='text-caption-sm text-grey-500'>Disabled</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Bottom Tab Bar',
    description:
      '홈/모음/설정 3개 탭을 기본으로 제공하는 하단 내비입니다. 내부 state로 선택 값을 보관하며 onChange를 넘기면 외부 제어도 가능합니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <BottomTabBar />
      </div>
    ),
  },
  {
    title: 'Back Detail Bar',
    description:
      '디테일 화면 상단바입니다. 좌측 back.svg 버튼과 제목, 우측엔 actions 배열로 제어하는 임시저장/검색/더보기 액션을 렌더링합니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <div className='flex flex-col gap-4'>
          {/* Save 아이콘만 */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Save 아이콘 (enabled)
            </p>
            <BackDetailBar
              title='할일 추가'
              rightIcons='save'
              isSaveDisabled={false}
              onClickSave={() => alert('Save!')}
            />
          </div>

          {/* Save 아이콘 disabled */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Save 아이콘 (disabled)
            </p>
            <BackDetailBar
              title='할일 추가'
              rightIcons='save'
              isSaveDisabled={true}
              onClickSave={() => alert('Save!')}
            />
          </div>

          {/* Search 아이콘만 */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Search 아이콘만
            </p>
            <BackDetailBar
              title='검색'
              rightIcons='search'
              onClickSearch={() => alert('Search!')}
            />
          </div>

          {/* Option 아이콘만 */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Option 아이콘만
            </p>
            <BackDetailBar
              title='상세'
              rightIcons='option'
              onClickOption={() => alert('Option!')}
            />
          </div>

          {/* Save + Option */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Save + Option (enabled)
            </p>
            <BackDetailBar
              title='할일 수정'
              rightIcons={['save', 'option']}
              isSaveDisabled={false}
              onClickSave={() => alert('Save!')}
              onClickOption={() => alert('Option!')}
            />
          </div>

          {/* Save + Option (disabled) */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Save + Option (disabled)
            </p>
            <BackDetailBar
              title='할일 수정'
              rightIcons={['save', 'option']}
              isSaveDisabled={true}
              onClickSave={() => alert('Save!')}
              onClickOption={() => alert('Option!')}
            />
          </div>

          {/* Search + Option */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Search + Option
            </p>
            <BackDetailBar
              title='할일 목록'
              rightIcons={['search', 'option']}
              onClickSearch={() => alert('Search!')}
              onClickOption={() => alert('Option!')}
            />
          </div>

          {/* Save + Search + Option */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Save + Search + Option
            </p>
            <BackDetailBar
              title='복잡한 화면'
              rightIcons={['save', 'search', 'option']}
              isSaveDisabled={false}
              onClickSave={() => alert('Save!')}
              onClickSearch={() => alert('Search!')}
              onClickOption={() => alert('Option!')}
            />
          </div>

          {/* Back 버튼 없음 */}
          <div>
            <p className='mb-2 text-xs font-semibold text-grey-600'>
              Back 버튼 없음 (showBackButton=false)
            </p>
            <BackDetailBar
              title='Back 없는 화면'
              showBackButton={false}
              rightIcons='option'
              onClickOption={() => alert('Option!')}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Home App Bar',
    description:
      '홈 첫 화면 전용 상단바입니다. 좌우 20px/상하 10px 여백을 두고 좌측에 65.23×20 로고, 우측에 search-24.svg 버튼을 배치했습니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <HomeAppBar />
      </div>
    ),
  },
  {
    title: 'Search App Bar',
    description:
      'Home App Bar 레이아웃을 그대로 쓰되 좌측은 heading-xl · black 텍스트를 props로 받아 렌더링하는 버전입니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <SearchAppBar title='title' />
      </div>
    ),
  },
  {
    title: 'Setting Menu Item',
    description:
      '설정 화면 전용 메뉴 아이템입니다. 좌측 큰 텍스트와 우측 보조 텍스트/화살표를 조합해 렌더링합니다.',
    component: (
      <div className='w-full max-w-md space-y-3 rounded-3xl bg-grey-100 p-6'>
        <SettingMenuItem leftText='텍스트' rightText='텍스트' />
      </div>
    ),
  },
  {
    title: 'Grey Line',
    description:
      '가로 375px, 세로 1px의 기본 구분선입니다. grey-200 컬러를 사용합니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <GreyLine />
      </div>
    ),
  },
  {
    title: 'Black Line',
    description: '색상 #0D0F20, 가로 2px · 세로 20px 크기의 세로 구분선입니다.',
    component: (
      <div className='w-full max-w-md rounded-3xl bg-grey-100 p-6'>
        <BlackLine />
      </div>
    ),
  },
  {
    title: 'Gradient Background',
    description:
      '기본 배경색은 #f2f3f7이며 상단 272px에는 white → transparent 그라데이션 오버레이를 깔아 화면 깊이를 줍니다.',
    component: (
      <div className='w-full max-w-md bg-grey-100 p-6'>
        <GradientBackground className='mx-auto' />
      </div>
    ),
  },
];

const Test = () => {
  return (
    <>
      <main className='min-h-screen w-full bg-grey-50 px-6 py-10 text-grey-900'>
        <div className='mx-auto flex max-w-4xl flex-col gap-8'>
          <header className='space-y-3'>
            <p className='text-sm font-semibold text-grey-500'>/test</p>
            <h1 className='text-3xl font-bold'>UI Test 페이지</h1>
          </header>

          {sections.map(({ title, description, component }) => (
            <section key={title} className='rounded-2xl bg-white p-6 shadow-sm'>
              <div className='space-y-1'>
                <h2 className='text-xl font-semibold'>{title}</h2>
                <p className='text-sm text-grey-600'>{description}</p>
              </div>

              <div className='mt-4 border border-dashed border-grey-200 bg-grey-50 p-4'>
                {component}
              </div>
            </section>
          ))}
        </div>
      </main>
      <CommonTestComponent />
    </>
  );
};

export default Test;

function CommonTestComponent() {
  const [searchValue, setSearchValue] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [linkInputValue, setLinkInputValue] = useState('');
  const [numericInputValue, setNumericInputValue] = useState('');
  const [numericInputState, setNumericInputState] = useState<
    'Activated' | 'Focused' | 'Error'
  >('Activated');
  const [solidSelectedChips, setSolidSelectedChips] = useState<Set<string>>(
    new Set()
  );
  const [lineSelectedChips, setLineSelectedChips] = useState<Set<string>>(
    new Set()
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArchiveCategory, setSelectedArchiveCategory] =
    useState<string>('');
  const [sortValue, setSortValue] = useState<'all' | 'latest'>('all');
  const [todoItems, setTodoItems] = useState([
    {
      id: 1,
      title: '타이틀(Title)14pt/SB',
      time: '1일 전',
      platform: 'Instagram',
      checked: false,
    },
    {
      id: 2,
      title: '또 다른 할일',
      time: '2시간 전',
      platform: 'Twitter',
      checked: false,
    },
    {
      id: 3,
      title: '가나다라마바사아자차카타파하ABCDEFG',
      time: '2시간 전',
      platform: 'Twitter',
      checked: false,
    },
  ]);

  return (
    <div className='flex min-h-screen flex-col gap-8 bg-grey-50 p-8'>
      <h1 className='text-3xl font-bold'>Design System Components Demo</h1>

      {/* SearchInputField Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>SearchInputField</h2>

        <div className='border-t border-grey-200 pt-8'>
          <p className='mb-3 font-semibold text-grey-900'>입력 test</p>
          <p className='mb-4 text-sm text-grey-600'>
            입력 필드에 포커스가 되면 테두리 색상이 파란색(#394CFF)으로 변경되고
            커서가 표시됩니다
          </p>

          <p className='mb-4 text-sm text-grey-600'>반응형일 시</p>
          <InputField.SearchInputField
            value={searchValue}
            onChange={setSearchValue}
            placeholder='원하는 콘텐츠를 검색해보세요'
            onFocus={() => console.log('SearchInputField focused')}
            onBlur={() => console.log('SearchInputField blurred')}
          />
          {searchValue && (
            <div className='mt-4 rounded-lg bg-point/10 p-3'>
              <p className='text-sm font-semibold text-grey-900'>
                검색 입력값: <span className='text-point'>{searchValue}</span>
              </p>
            </div>
          )}
        </div>

        <p className='mb-4 text-sm text-grey-600'>
          width 335px로 고정(피그마 기준)
        </p>

        <InputField.SearchInputField
          value={searchValue2}
          onChange={setSearchValue2}
          placeholder='원하는 콘텐츠를 검색해보세요'
          onFocus={() => console.log('SearchInputField focused')}
          onBlur={() => console.log('SearchInputField blurred')}
          width='w-[335px]'
        />

        {searchValue2 && (
          <div className='mt-4 rounded-lg bg-point/10 p-3'>
            <p className='text-sm font-semibold text-grey-900'>
              검색 입력값: <span className='text-point'>{searchValue2}</span>
            </p>
          </div>
        )}
      </section>

      {/* TextInputField Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>TextInputField</h2>

        {/* 1. 모든 상태 정적 표시 */}
        <div className='mb-8'>
          <h3 className='mb-4 text-lg font-semibold text-grey-900'>
            📋 모든 상태 한눈에 보기
          </h3>
          <div className='flex w-[335px] flex-col gap-1'>
            {/* Enabled State */}
            <div className='flex flex-col gap-2'>
              <div className='rounded-lg bg-grey-50 p-3'>
                <p className='mb-2 text-xs font-semibold text-grey-600'>
                  Enabled State
                </p>
                <p className='mb-2 text-xs text-grey-500'>
                  (초기 상태, Placeholder만 표시)
                </p>
              </div>
              <InputField.TextInputField
                state='Enabled'
                placeholder='플레이스 홀더'
                width='w-full'
              />
            </div>

            {/* Focused State */}
            <div className='flex flex-col gap-2'>
              <div className='rounded-lg bg-grey-50 p-3'>
                <p className='mb-2 text-xs font-semibold text-grey-600'>
                  Focused State
                </p>
                <p className='mb-2 text-xs text-grey-500'>
                  (입력 중, 커서 애니메이션)
                </p>
              </div>
              <InputField.TextInputField
                state='Focused'
                value='텍스트 입력 중'
                placeholder='입력 중'
                width='w-full'
              />
            </div>

            {/* Activated State */}
            <div className='flex flex-col gap-2'>
              <div className='rounded-lg bg-grey-50 p-3'>
                <p className='mb-2 text-xs font-semibold text-grey-600'>
                  Activated State
                </p>
                <p className='mb-2 text-xs text-grey-500'>(입력 완료 상태)</p>
              </div>
              <InputField.TextInputField
                state='Activated'
                value='텍스트 입력 완료'
                placeholder='완료'
                width='w-full'
              />
            </div>

            {/* Error State */}
            <div className='flex flex-col gap-2'>
              <div className='rounded-lg bg-grey-50 p-3'>
                <p className='mb-2 text-xs font-semibold text-grey-600'>
                  Error State
                </p>
                <p className='mb-2 text-xs text-grey-500'>(오류 발생 상태)</p>
              </div>
              <InputField.TextInputField
                state='Error'
                value='플레이스 홀더'
                errorMessage='오류 발생 이유'
                width='w-full'
              />
            </div>

            {/* Text+Button State */}
            <div className='col-span-1 flex flex-col gap-2 md:col-span-2 lg:col-span-2'>
              <div className='rounded-lg bg-grey-50 p-3'>
                <p className='mb-2 text-xs font-semibold text-grey-600'>
                  Text+Button State
                </p>
                <p className='mb-2 text-xs text-grey-500'>
                  (버튼이 있는 입력 필드)
                </p>
              </div>
              <InputField.TextInputField
                state='Link'
                value={linkInputValue}
                onChange={setLinkInputValue}
                placeholder='링크 입력'
                buttonLabel='테스트'
                onButtonClick={() => alert('Button clicked!')}
                width='w-full'
              />
            </div>
          </div>
        </div>

        <div className='border-t border-grey-200 py-8' />

        {/* 2. 동적 상태 변화 테스트 - Activated -> Focused -> Error/Activated */}
        <div>
          <h3 className='mb-4 text-lg font-semibold text-grey-900'>
            🎯 실제 상태 변화 테스트 (Activated → Focused → Error/Activated)
          </h3>
          <p className='mb-4 text-sm text-grey-600'>
            Activated 상태에서 입력 필드를 클릭하면 Focused 상태로 변경 → 입력
            후 다른 곳을 클릭하면 검증 실행 (숫자만 허용)
          </p>

          <div className='rounded-lg border-2 border-point/20 bg-point/5 p-6'>
            <div className='flex flex-col gap-4'>
              {/* 상태 표시 */}
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      numericInputState === 'Focused'
                        ? 'bg-yellow-500'
                        : numericInputState === 'Activated'
                          ? 'bg-green-500'
                          : 'bg-error'
                    }`}
                  />
                  <span className='font-semibold text-grey-900'>
                    현재 상태:{' '}
                    <span className='text-point'>{numericInputState}</span>
                  </span>
                </div>
              </div>

              {/* Activated -> Focused 상태 */}
              {(numericInputState === 'Activated' ||
                numericInputState === 'Focused') && (
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-point text-xs font-semibold text-white'>
                      1
                    </span>
                    <p className='text-sm font-semibold text-grey-900'>
                      {numericInputState === 'Activated'
                        ? '입력 필드를 클릭하면 Focused 상태로 변경됩니다'
                        : '숫자를 입력 후 다른 곳을 클릭하면 검증 실행'}
                    </p>
                  </div>
                  <InputField.TextInputField
                    state={numericInputState}
                    value={numericInputValue}
                    onChange={(val) => {
                      setNumericInputValue(val);
                    }}
                    onFocus={() => {
                      setNumericInputState('Focused');
                    }}
                    onBlur={() => {
                      // 검증 로직
                      const isNumeric = /^\d+$/.test(numericInputValue);
                      if (!isNumeric && numericInputValue) {
                        // 검증 실패
                        setNumericInputState('Error');
                      } else if (numericInputValue) {
                        // 검증 성공
                        setNumericInputState('Activated');
                      } else {
                        // 입력값 없음
                        setNumericInputState('Activated');
                      }
                    }}
                    placeholder='숫자를 입력해주세요'
                    width='w-full'
                  />
                  <p className='text-xs italic text-grey-500'>
                    {numericInputState === 'Activated'
                      ? '💡 입력 필드를 클릭하여 Focused 상태로 전환하세요'
                      : '💡 입력 후 아래 다른 곳을 클릭하면 검증이 실행됩니다 (숫자만 허용)'}
                  </p>
                </div>
              )}

              {/* Error 상태 */}
              {numericInputState === 'Error' && (
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs font-semibold text-white'>
                      !
                    </span>
                    <p className='text-sm font-semibold text-grey-900'>
                      검증 실패 - 숫자만 입력해야 합니다
                    </p>
                  </div>
                  <InputField.TextInputField
                    state='Error'
                    value={numericInputValue}
                    errorMessage='⚠️ 숫자만 입력 가능합니다. 다시 입력해주세요.'
                    width='w-full'
                  />
                  <button
                    onClick={() => {
                      setNumericInputValue('');
                      setNumericInputState('Activated');
                    }}
                    className='rounded-lg bg-point px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600'
                  >
                    🔄 다시 입력
                  </button>
                  <div className='rounded-lg bg-red-50 p-3'>
                    <p className='text-sm text-error'>
                      💡 "다시 입력" 버튼을 클릭하면 Activated 상태로
                      초기화됩니다
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ConfirmDialog Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>ConfirmDialog</h2>
        <button
          onClick={() => setShowConfirmDialog(true)}
          className='rounded-lg bg-point px-6 py-2 font-semibold text-white'
        >
          Show Confirm Dialog
        </button>

        <ModalLayout
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
        >
          <FeedBack.ConfirmDialog
            title='제목이 들어갑니다'
            subtitle='부제목이 들어갑니다'
            positiveLabel='Positive'
            negativeLabel='Negative'
            onPositive={() => {
              alert('Positive action!');
              setShowConfirmDialog(false);
            }}
            onNegative={() => {
              setShowConfirmDialog(false);
            }}
          />
        </ModalLayout>
      </section>

      {/* AlertDialog Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>AlertDialog</h2>
        <button
          onClick={() => setShowAlertDialog(true)}
          className='rounded-lg bg-point px-6 py-2 font-semibold text-white'
        >
          Show Alert Dialog
        </button>

        <ModalLayout
          open={showAlertDialog}
          onClose={() => setShowAlertDialog(false)}
        >
          <FeedBack.AlertDialog
            title='알림 제목'
            subtitle='알림 내용이 여기에 들어갑니다'
            primaryLabel='Postive'
            secondaryLabel='텍스트버튼'
            onPrimary={() => {
              alert('Primary action!');
              setShowAlertDialog(false);
            }}
            onSecondary={() => {
              setShowAlertDialog(false);
            }}
          />
        </ModalLayout>
      </section>

      {/* Toast Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>Toast</h2>
        <button
          onClick={() => setShowToast(true)}
          className='rounded-lg bg-point px-6 py-2 font-semibold text-white'
        >
          Show Toast
        </button>

        {showToast && (
          <div className='fixed bottom-8 left-1/2 z-50 -translate-x-1/2'>
            <FeedBack.Toast
              message='로그인 후 간편하게 DoLink를 이용해보세요.'
              actionLabel='로그인'
              onAction={() => {
                alert('Login action!');
                setShowToast(false);
              }}
            />
          </div>
        )}
      </section>

      {/* CategoryEditorChip Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>CategoryEditorChip</h2>
        <p className='mb-6 text-sm text-grey-600'>
          클릭하여 카테고리 선택 토글(일부만 가져옴)
        </p>

        <div className='flex flex-wrap gap-8'>
          <Filter.CategoryEditorChip
            label='기타'
            unselectedIcon={CategoryEditorIconImage.etc.unselected}
            selectedIcon={CategoryEditorIconImage.etc.selected}
            isSelected={selectedCategory === 'etc'}
            onClick={() => setSelectedCategory('etc')}
          />
          <Filter.CategoryEditorChip
            label='운동'
            unselectedIcon={CategoryEditorIconImage.exercise.unselected}
            selectedIcon={CategoryEditorIconImage.exercise.selected}
            isSelected={selectedCategory === 'exercise'}
            onClick={() => setSelectedCategory('exercise')}
          />
          <Filter.CategoryEditorChip
            label='취미'
            unselectedIcon={CategoryEditorIconImage.hobby.unselected}
            selectedIcon={CategoryEditorIconImage.hobby.selected}
            isSelected={selectedCategory === 'hobby'}
            onClick={() => setSelectedCategory('hobby')}
          />
          <Filter.CategoryEditorChip
            label='금융'
            unselectedIcon={CategoryEditorIconImage.money.unselected}
            selectedIcon={CategoryEditorIconImage.money.selected}
            isSelected={selectedCategory === 'money'}
            onClick={() => setSelectedCategory('money')}
          />
          <Filter.CategoryEditorChip
            label='음식점'
            unselectedIcon={CategoryEditorIconImage.restaurant.unselected}
            selectedIcon={CategoryEditorIconImage.restaurant.selected}
            isSelected={selectedCategory === 'restaurant'}
            onClick={() => setSelectedCategory('restaurant')}
          />
          <Filter.CategoryEditorChip
            label='쇼핑'
            unselectedIcon={CategoryEditorIconImage.shopping.unselected}
            selectedIcon={CategoryEditorIconImage.shopping.selected}
            isSelected={selectedCategory === 'shopping'}
            onClick={() => setSelectedCategory('shopping')}
          />
          <Filter.CategoryEditorChip
            label='공부'
            unselectedIcon={CategoryEditorIconImage.study.unselected}
            selectedIcon={CategoryEditorIconImage.study.selected}
            isSelected={selectedCategory === 'study'}
            onClick={() => setSelectedCategory('study')}
          />
          <Filter.CategoryEditorChip
            label='팁'
            unselectedIcon={CategoryEditorIconImage.tips.unselected}
            selectedIcon={CategoryEditorIconImage.tips.selected}
            isSelected={selectedCategory === 'tips'}
            onClick={() => setSelectedCategory('tips')}
          />
          <Filter.CategoryEditorChip
            label='여행'
            unselectedIcon={CategoryEditorIconImage.travel.unselected}
            selectedIcon={CategoryEditorIconImage.travel.selected}
            isSelected={selectedCategory === 'travel'}
            onClick={() => setSelectedCategory('travel')}
          />
        </div>

        <div className='mt-6 rounded-lg border-2 border-point/20 bg-point/5 p-4'>
          <p className='text-sm font-semibold text-grey-900'>
            선택된 카테고리:{' '}
            <span className='text-point'>{selectedCategory}</span>
          </p>
        </div>
      </section>

      {/* ArchiveCategoryChip Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>ArchiveCategoryChip</h2>
        <p className='mb-6 text-sm text-grey-600'>
          클릭하여 카테고리 선택 토글(일부만 가져옴)
        </p>

        <div className='flex flex-wrap gap-8'>
          <Filter.ArchiveCategoryChip
            label='커리어'
            unselectedIcon={CategoryHomeIconImage.career.unselected}
            selectedIcon={CategoryHomeIconImage.career.selected}
            isSelected={selectedArchiveCategory === 'career'}
            onClick={() => setSelectedArchiveCategory('career')}
          />
          <Filter.ArchiveCategoryChip
            label='기타'
            unselectedIcon={CategoryHomeIconImage.etc.unselected}
            selectedIcon={CategoryHomeIconImage.etc.selected}
            isSelected={selectedArchiveCategory === 'etc'}
            onClick={() => setSelectedArchiveCategory('etc')}
          />
          <Filter.ArchiveCategoryChip
            label='운동'
            unselectedIcon={CategoryHomeIconImage.exercise.unselected}
            selectedIcon={CategoryHomeIconImage.exercise.selected}
            isSelected={selectedArchiveCategory === 'exercise'}
            onClick={() => setSelectedArchiveCategory('exercise')}
          />
          <Filter.ArchiveCategoryChip
            label='취미'
            unselectedIcon={CategoryHomeIconImage.hobby.unselected}
            selectedIcon={CategoryHomeIconImage.hobby.selected}
            isSelected={selectedArchiveCategory === 'hobby'}
            onClick={() => setSelectedArchiveCategory('hobby')}
          />
          <Filter.ArchiveCategoryChip
            label='금융'
            unselectedIcon={CategoryHomeIconImage.money.unselected}
            selectedIcon={CategoryHomeIconImage.money.selected}
            isSelected={selectedArchiveCategory === 'money'}
            onClick={() => setSelectedArchiveCategory('money')}
          />
          <Filter.ArchiveCategoryChip
            label='쇼핑'
            unselectedIcon={CategoryHomeIconImage.shopping.unselected}
            selectedIcon={CategoryHomeIconImage.shopping.selected}
            isSelected={selectedArchiveCategory === 'shopping'}
            onClick={() => setSelectedArchiveCategory('shopping')}
          />
          <Filter.ArchiveCategoryChip
            label='공부'
            unselectedIcon={CategoryHomeIconImage.study.unselected}
            selectedIcon={CategoryHomeIconImage.study.selected}
            isSelected={selectedArchiveCategory === 'study'}
            onClick={() => setSelectedArchiveCategory('study')}
          />
          <Filter.ArchiveCategoryChip
            label='팁'
            unselectedIcon={CategoryHomeIconImage.tips.unselected}
            selectedIcon={CategoryHomeIconImage.tips.selected}
            isSelected={selectedArchiveCategory === 'tips'}
            onClick={() => setSelectedArchiveCategory('tips')}
          />
          <Filter.ArchiveCategoryChip
            label='여행'
            unselectedIcon={CategoryHomeIconImage.travel.unselected}
            selectedIcon={CategoryHomeIconImage.travel.selected}
            isSelected={selectedArchiveCategory === 'travel'}
            onClick={() => setSelectedArchiveCategory('travel')}
          />
        </div>

        <div className='mt-6 rounded-lg border-2 border-point/20 bg-point/5 p-4'>
          <p className='text-sm font-semibold text-grey-900'>
            선택된 폴더 카테고리:{' '}
            <span className='text-point'>{selectedArchiveCategory}</span>
          </p>
        </div>
      </section>

      {/* ItemChips Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>ItemChips</h2>

        {/* Solid Type */}
        <div className='mb-8'>
          <h3 className='mb-4 text-lg font-semibold text-grey-900'>
            🎨 Solid Type
          </h3>
          <p className='mb-4 text-sm text-grey-600'>
            클릭하여 선택/미선택 상태 토글
          </p>
          <div className='flex flex-wrap gap-3'>
            {['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4'].map(
              (label) => (
                <Filter.ItemChips
                  key={label}
                  type='solid'
                  label={label}
                  isSelected={solidSelectedChips.has(label)}
                  onClick={() => {
                    const newSelected = new Set(solidSelectedChips);
                    if (newSelected.has(label)) {
                      newSelected.delete(label);
                    } else {
                      newSelected.add(label);
                    }
                    setSolidSelectedChips(newSelected);
                  }}
                />
              )
            )}
          </div>
          <div className='mt-4 rounded-lg bg-grey-50 p-3'>
            <p className='text-sm text-grey-700'>
              선택된 항목:{' '}
              {solidSelectedChips.size > 0
                ? Array.from(solidSelectedChips).join(', ')
                : '없음'}
            </p>
          </div>
        </div>

        <div className='border-t border-grey-200 py-8' />

        {/* Line Type */}
        <div>
          <h3 className='mb-4 text-lg font-semibold text-grey-900'>
            📌 Line Type
          </h3>
          <p className='mb-4 text-sm text-grey-600'>
            클릭하여 선택/미선택 상태 토글
          </p>
          <div className='flex flex-wrap gap-3'>
            {['옵션 A', '옵션 B', '옵션 C', '옵션 D'].map((label) => (
              <Filter.ItemChips
                key={label}
                type='line'
                label={label}
                isSelected={lineSelectedChips.has(label)}
                onClick={() => {
                  const newSelected = new Set(lineSelectedChips);
                  if (newSelected.has(label)) {
                    newSelected.delete(label);
                  } else {
                    newSelected.add(label);
                  }
                  setLineSelectedChips(newSelected);
                }}
              />
            ))}
          </div>
          <div className='mt-4 rounded-lg bg-grey-50 p-3'>
            <p className='text-sm text-grey-700'>
              선택된 항목:{' '}
              {lineSelectedChips.size > 0
                ? Array.from(lineSelectedChips).join(', ')
                : '없음'}
            </p>
          </div>
        </div>
      </section>

      {/* SortDropdown Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>SortDropdown</h2>
        <p className='mb-6 text-sm text-grey-600'>
          드롭다운을 클릭하여 정렬 옵션 선택
        </p>

        <div className='flex flex-col gap-6'>
          <div>
            <p className='mb-3 font-semibold text-grey-900'>
              기본 상태 (전체 선택됨)
            </p>
            <Filter.SortDropdown
              value={sortValue}
              onChange={setSortValue}
              options={[
                { value: 'all', label: '전체' },
                { value: 'latest', label: '최신 순' },
              ]}
            />
          </div>

          <div className='border-t border-grey-200 pt-6'>
            <p className='mb-4 font-semibold text-grey-900'>선택된 값</p>
            <div className='rounded-lg bg-point/10 p-4'>
              <p className='text-sm text-grey-900'>
                현재 선택:{' '}
                <span className='font-semibold text-point'>
                  {sortValue === 'all' ? '전체' : '최신 순'}
                </span>
              </p>
            </div>
          </div>

          <div className='border-t border-grey-200 pt-6'>
            <p className='mb-4 font-semibold text-grey-900'>드롭다운 특징</p>
            <ul className='flex flex-col gap-2 text-sm text-grey-600'>
              <li>✓ 드롭다운 외부 클릭 시 자동 닫힘</li>
              <li>✓ 선택 항목 실시간 업데이트</li>
              <li>✓ 선택된 항목 하이라이트 표시</li>
              <li>✓ 부드러운 애니메이션 (체브론 회전)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TodoItem Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>TodoItem</h2>
        <div className='flex flex-col gap-4'>
          {todoItems.map((item) => (
            <List.TodoItem
              key={item.id}
              title={item.title}
              subtitle={`${item.time} · ${item.platform}`}
              checked={item.checked}
              onChange={(checked) => {
                setTodoItems(
                  todoItems.map((todo) =>
                    todo.id === item.id ? { ...todo, checked } : todo
                  )
                );
              }}
            />
          ))}
        </div>
      </section>

      {/* ArchiveCard Demo Section */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>ArchiveCard</h2>
        <p className='mb-6 text-sm text-grey-600'>
          보관된 프로젝트를 표시하는 카드 (Default / Edit 타입)
        </p>

        <div className='flex flex-col gap-4'>
          <div>
            <p className='mb-3 text-sm font-semibold'>
              Default Type - 이미지 4개
            </p>
            <List.ArchiveCard
              type='default'
              title='보관된 프로젝트 1'
              category='기타'
              itemCount={5}
              width='w-[335px]'
              images={[
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
              ]}
              onMoreClick={() => alert('More clicked!')}
            />
          </div>

          <div className='border-t border-grey-200 pt-4'>
            <p className='mb-3 text-sm font-semibold'>
              Default Type - 이미지 2개
            </p>
            <List.ArchiveCard
              type='default'
              title='보관된 프로젝트 2'
              category='커리어'
              itemCount={3}
              width='w-[335px]'
              images={[
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
              ]}
              onMoreClick={() => alert('More clicked!')}
            />
          </div>

          <div className='border-t border-grey-200 pt-4'>
            <p className='mb-3 text-sm font-semibold'>
              Default Type - 이미지 없음
            </p>
            <List.ArchiveCard
              type='default'
              title='빈 프로젝트'
              category='운동'
              itemCount={0}
              width='w-[335px]'
              onMoreClick={() => alert('More clicked!')}
            />
          </div>

          <div className='border-t border-grey-200 pt-4'>
            <p className='mb-3 text-sm font-semibold'>
              ✨ 터치 상호작용 테스트 (포인터/터치 환경)
            </p>
            <p className='mb-4 text-sm text-grey-600'>
              "..." 버튼을 클릭하면 edit/delete 버튼이 나타나고, 카드 외부를
              클릭하면 다시 default로 돌아갑니다.
            </p>
            <List.ArchiveCard
              type='default'
              title='터치 상호작용 테스트'
              category='터치 테스트'
              itemCount={5}
              images={[
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
                'https://www.figma.com/api/mcp/asset/2653ef1d-ae33-425b-87f8-26e361b2e09e',
              ]}
              onMoreClick={() => console.log('More button clicked!')}
              onTypeChange={(type) => console.log(`Type changed to: ${type}`)}
              onEditClick={() => alert('✏️ Edit clicked!')}
              onDeleteClick={() => alert('🗑️ Delete clicked!')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
