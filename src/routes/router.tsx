import { Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/home/homePage';
import ArchivePage from '@/pages/archive/archivePage';
import SettingsPage from '@/pages/settings/settingsPage';
import Test from '@/pages/test';
import Test2 from '@/pages/test2';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/archives' element={<ArchivePage />} />
      <Route path='/settings' element={<SettingsPage />} />

      {/* 공통 컴포넌트 테스트 페이지 */}
      <Route path='/test' element={<Test />} />
      <Route path='/test2' element={<Test2 />} />
    </Routes>
  );
};

export default AppRouter;
