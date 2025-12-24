import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { TAB_ROUTE_MAP } from '@/constants/routes';

/**
 * 하단 탭 이동을 위한 내비게이션 훅
 */
export const useBottomTabNavigation = () => {
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (next: TabKey) => {
      navigate(TAB_ROUTE_MAP[next]);
    },
    [navigate]
  );

  return { handleTabChange };
};
