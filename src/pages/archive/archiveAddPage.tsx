import { useNavigate } from 'react-router-dom';
import {
  ArchiveBottomSheet,
  type ArchiveSelectCategoryKey as ArchiveCategoryKey,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { useArchiveMockStore } from '@/stores/useArchiveMockStore';

const ArchiveAddPage = () => {
  const navigate = useNavigate();
  const addArchive = useArchiveMockStore((state) => state.addArchive);

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    addArchive({
      title: payload.name,
      category: payload.category,
      itemCount: 0,
      images: [],
    });
    navigate(ROUTES.archives);
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
