import { Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/home/homePage';
import ArchivePage from '@/pages/archive/archivePage';
import SettingsPage from '@/pages/settings/settingsPage';
import Test from '@/pages/test';
import Test2 from '@/pages/test2';
import Test3 from '@/pages/test3';
import ArchiveDetailPage from '@/pages/archive/archiveDetailPage';
import TaskDetailPage from '@/pages/task/detail';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/archives' element={<ArchivePage />} />
      <Route path='/settings' element={<SettingsPage />} />

      {/* TODO 추후 id 생성*/}
      <Route path='/archives/detail' element={<ArchiveDetailPage />} />
      {/* TODO  task 추후 id 생성*/}
      <Route path='/task/detail' element={<TaskDetailPage />} />

      {/* 공통 컴포넌트 테스트 페이지 */}
      <Route path='/test' element={<Test />} />
      <Route path='/test2' element={<Test2 />} />
      <Route path='/test3' element={<Test3 />} />
    </Routes>
  );
};

export default AppRouter;
