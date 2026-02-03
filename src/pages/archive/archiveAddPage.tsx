import { useNavigate } from 'react-router-dom';
import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { archiveMockApi } from '@/api/archive.mock';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';

const ArchiveAddPage = () => {
  const navigate = useNavigate();
  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    archiveMockApi.add({
      title: payload.name,
      category: payload.category,
      itemCount: 0,
      images: [],
    });
    setSelectedArchiveId(null);
    navigate(ROUTES.archives);
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
