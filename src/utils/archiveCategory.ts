export type ArchiveFilterCategoryKey =
  | 'all'
  | 'restaurant'
  | 'hobby'
  | 'travel'
  | 'money'
  | 'shopping'
  | 'exercise'
  | 'career'
  | 'study'
  | 'tips'
  | 'etc';

// 홈화면
export type ArchiveCategoryKey = Exclude<ArchiveFilterCategoryKey, 'all'>;

// 모음 추가/수정
export type ArchiveFilterCategory = ArchiveCategoryKey;

const ARCHIVE_CATEGORY_LABEL: Record<ArchiveFilterCategoryKey, string> = {
  all: '전체',
  restaurant: '맛집',
  hobby: '취미',
  travel: '여행',
  money: '재테크',
  shopping: '쇼핑',
  exercise: '운동',
  career: '커리어',
  study: '자기개발',
  tips: '꿀팁',
  etc: '기타',
};

export const getArchiveCategoryLabel = (category: ArchiveFilterCategoryKey) =>
  ARCHIVE_CATEGORY_LABEL[category];

export const toEditorCategory = (category: ArchiveFilterCategory) => category;

export const toFilterCategory = (category: ArchiveCategoryKey) => category;
