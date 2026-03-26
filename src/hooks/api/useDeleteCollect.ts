import { mutationOptions } from '@tanstack/react-query';
import { getDeleteCollectMutationOptions } from '@/api/generated/endpoints/collection/collection';

export const deleteCollectMutationOptions = mutationOptions({
  ...getDeleteCollectMutationOptions(),
  onSuccess: (_data, _variables, _result, context) => {
    if (!context?.client) return;
    context?.client.invalidateQueries({
      queryKey: ['collections'],
    });
    context?.client.invalidateQueries({
      queryKey: ['/api/v1/collect/count'],
    });
    context?.client.invalidateQueries({
      queryKey: ['/api/v1/collect/category-counts'],
    });
  },
  onError: (error) => {
    console.error('Failed to delete collection:', error);
  },
});
