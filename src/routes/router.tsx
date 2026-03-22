import { lazy, Suspense } from 'react';
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
import TaskFormPage from '@/pages/task/taskFormPage';
import SearchPage from '@/pages/searchPage';

// Test pages are only loaded in development
const Test = lazy(() => import('@/pages/test/test'));
const Test2 = lazy(() => import('@/pages/test/test2'));
const Test3 = lazy(() => import('@/pages/test/test3'));

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.archives} element={<ArchivePage />}>
        <Route path={'add'} element={<ArchiveAddPage />} />
      </Route>
      <Route path={`${ROUTES.archiveEdit}/:id`} element={<ArchiveEditPage />} />
      <Route
        path={`${ROUTES.archiveDetail}/:id`}
        element={<ArchiveDetailPage />}
      />
      <Route path={ROUTES.archiveTutorial} element={<ArchiveDetailPage />} />

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
      <Route path={`${ROUTES.taskDetail}/:id`} element={<TaskDetailPage />} />
      <Route path={`${ROUTES.taskEdit}/:id`} element={<TaskFormPage />} />
      <Route path={ROUTES.taskCreate} element={<TaskFormPage />} />
      <Route path={ROUTES.search} element={<SearchPage />} />

      {/* 공통 컴포넌트 테스트 페이지 - 개발 환경에서만 포함 */}
      {import.meta.env.DEV && (
        <>
          <Route
            path={ROUTES.test}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Test />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.test2}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Test2 />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.test3}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Test3 />
              </Suspense>
            }
          />
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
