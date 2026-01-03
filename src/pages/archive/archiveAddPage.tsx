import { useNavigate } from 'react-router-dom';
import {
  ArchiveBottomSheet,
  type ArchiveSelectCategoryKey as ArchiveCategoryKey,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';

const ArchiveAddPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    console.log('모음 생성 요청(Mock):', payload);
    navigate(ROUTES.archives);
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
