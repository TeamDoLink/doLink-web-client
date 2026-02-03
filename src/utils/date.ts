const padTwoDigits = (value: number) => value.toString().padStart(2, '0');

const getStartOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const formatRelativeDateLabel = (
  createdAt: string,
  referenceDate: Date = new Date()
) => {
  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) {
    return '';
  }

  const startOfReference = getStartOfDay(referenceDate).getTime();
  const startOfCreated = getStartOfDay(createdDate).getTime();
  const diffInMs = startOfReference - startOfCreated;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 0) {
    return '오늘';
  }

  if (diffInDays <= 7) {
    return `${diffInDays}일 전`;
  }

  const year = createdDate.getFullYear();
  const month = padTwoDigits(createdDate.getMonth() + 1);
  const day = padTwoDigits(createdDate.getDate());

  return `${year}.${month}.${day}`;
};
