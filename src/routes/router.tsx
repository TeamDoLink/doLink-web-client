import { Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/home/homePage';
import ArchivePage from '@/pages/archive/archivePage';
import ArchiveAddPage from '@/pages/archive/archiveAddPage';
import ArchiveEditPage from '@/pages/archive/archiveEditPage';
import SettingsPage from '@/pages/settings/settingsPage';
import WithdrawalReasonPage from '@/pages/settings/withdrawal/withdrawalReasonPage';
import WithdrawalConfirmPage from '@/pages/settings/withdrawal/withdrawalConfirmPage';
import LoginPage from '@/pages/auth/loginPage';
import Test from '@/pages/test';
import Test2 from '@/pages/test2';
import Test3 from '@/pages/test3';
import ArchiveDetailPage from '@/pages/archive/archiveDetailPage';
import TaskDetailPage from '@/pages/task/detail';
import TaskCreatePage from '@/pages/task/taskCreatePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/archives' element={<ArchivePage />} />
      <Route path='/archives/add' element={<ArchiveAddPage />} />
      <Route path='/archives/edit' element={<ArchiveEditPage />} />

      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/settings/withdrawal' element={<WithdrawalReasonPage />} />
      <Route
        path='/settings/withdrawal/confirm'
        element={<WithdrawalConfirmPage />}
      />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/task/detail' element={<TaskDetailPage />} />
      <Route path='/task/create' element={<TaskCreatePage />} />
      <Route path='/archives/detail/:id' element={<ArchiveDetailPage />} />

      {/* 공통 컴포넌트 테스트 페이지 */}
      <Route path='/test' element={<Test />} />
      <Route path='/test2' element={<Test2 />} />
      <Route path='/test3' element={<Test3 />} />
    </Routes>
  );
};

export default AppRouter;
