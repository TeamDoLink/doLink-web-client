import { useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGetTask } from '@/api/generated/endpoints/task/task';
import { useGetSharedTask } from '@/api/generated/endpoints/share/share';
import type {
  ApiResponseTaskResponse,
  TaskResponse,
} from '@/api/generated/models';

type UseTaskDetailNavigationReturn = {
  taskData: TaskResponse | null | undefined;
  isLoading: boolean;
  isShareMode: boolean;
};

export const useTaskDetailNavigation = (): UseTaskDetailNavigationReturn => {
  const location = useLocation();
  const params = useParams<{ id?: string; token?: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isShareMode = location.pathname.includes('/share');

  const taskId = isShareMode ? 0 : Number(params.id);
  const shareToken = isShareMode ? (params.token ?? '') : '';

  const { data: taskResponse, isLoading: isLoadingTask } = useGetTask(taskId, {
    query: { enabled: !isShareMode && isAuthenticated },
  });

  const { data: sharedTaskResponse, isLoading: isLoadingSharedTask } =
    useGetSharedTask(shareToken, {
      query: { enabled: isShareMode && !!shareToken },
    });

  if (isShareMode) {
    const apiResponse =
      sharedTaskResponse as unknown as ApiResponseTaskResponse;
    return {
      taskData: apiResponse?.result,
      isLoading: isLoadingSharedTask,
      isShareMode: true,
    };
  }

  const apiResponse = taskResponse as unknown as ApiResponseTaskResponse;
  return {
    taskData: apiResponse?.result,
    isLoading: isLoadingTask,
    isShareMode: false,
  };
};
