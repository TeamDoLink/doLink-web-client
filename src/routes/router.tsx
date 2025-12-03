import { Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/home/homePage';
import FoldersPage from '@/pages/folders/foldersPage';
import SettingsPage from '@/pages/settings/settingsPage';
import Test from '@/pages/Test';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/folders' element={<FoldersPage />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  );
};

export default AppRouter;
