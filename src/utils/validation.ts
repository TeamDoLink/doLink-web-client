/**
 * URL 유효성 검사
 * http와 https 프로토콜만 허용
 */
export const isValidUrl = (text: string): boolean => {
  if (!text) return false;

  try {
    const url = new URL(text);
    // http와 https 프로토콜만 허용
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
