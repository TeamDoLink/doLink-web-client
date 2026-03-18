import { useNavigate } from 'react-router-dom';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { ROUTES, TAB_ROUTE_MAP } from '@/constants/routes';

/**
 * 하단 탭 이동을 위한 내비게이션 훅
 */
export const useBottomTabNavigation = () => {
  const navigate = useNavigate();

  const handleTabChange = (next: TabKey) => {
    if (next === 'archive') {
      navigate(ROUTES.archives, { replace: true });
      return;
    }
    navigate(TAB_ROUTE_MAP[next]);
  };

  return { handleTabChange };
};
