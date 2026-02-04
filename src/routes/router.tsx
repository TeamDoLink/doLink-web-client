import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import HomePage from '@/pages/home/homePage';
import ArchivePage from '@/pages/archive/archivePage';
import ArchiveAddPage from '@/pages/archive/archiveAddPage';
import ArchiveEditPage from '@/pages/archive/archiveEditPage';
import ArchiveDetailPage from '@/pages/archive/archiveDetailPage';
import SettingsPage from '@/pages/settings/settingsPage';
import WithdrawalReasonPage from '@/pages/settings/withdrawal/withdrawalReasonPage';
import WithdrawalConfirmPage from '@/pages/settings/withdrawal/withdrawalConfirmPage';
import LoginPage from '@/pages/auth/loginPage';
import TaskDetailPage from '@/pages/task/detail';
import TaskCreatePage from '@/pages/task/taskCreatePage';
import Test from '@/pages/test';
import Test2 from '@/pages/test2';
import Test3 from '@/pages/test3';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.archives} element={<ArchivePage />} />
      <Route path={ROUTES.archiveAdd} element={<ArchiveAddPage />} />
      <Route path={ROUTES.archiveEdit} element={<ArchiveEditPage />} />
      <Route
        path={`${ROUTES.archiveDetail}/:id`}
        element={<ArchiveDetailPage />}
      />

      <Route path={ROUTES.settings} element={<SettingsPage />} />
      <Route
        path={ROUTES.settingsWithdrawal}
        element={<WithdrawalReasonPage />}
      />
      <Route
        path={ROUTES.settingsWithdrawalConfirm}
        element={<WithdrawalConfirmPage />}
      />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.taskDetail} element={<TaskDetailPage />} />
      <Route path={ROUTES.taskCreate} element={<TaskCreatePage />} />

      {/* 공통 컴포넌트 테스트 페이지 */}
      <Route path={ROUTES.test} element={<Test />} />
      <Route path={ROUTES.test2} element={<Test2 />} />
      <Route path={ROUTES.test3} element={<Test3 />} />
    </Routes>
  );
};

export default AppRouter;
