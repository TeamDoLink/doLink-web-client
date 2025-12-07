import { useNavigate } from 'react-router-dom';
import { TabBar } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';

const TAB_ROUTE_MAP: Record<TabKey, string> = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
};

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  return (
    <div className='flex min-h-screen flex-col bg-grey-50'>
      <header className='px-5 py-4 text-heading-md text-grey-900'>설정</header>
      <main className='grow px-5 py-6'>
        <section className='rounded-xl bg-white p-6 shadow-sm'>
          <h1 className='text-heading-sm text-grey-900'>설정 페이지</h1>
          <p className='mt-2 text-body-sm text-grey-500'>
            설정 목록과 상세 UI를 이 영역 안에서 구성하세요.
          </p>
        </section>
      </main>
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <TabBar.BottomTabBar value='setting' onChange={handleTabChange} />
      </footer>
    </div>
  );
};

export default SettingsPage;
