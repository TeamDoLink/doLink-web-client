import { APP_VERSION_ENDPOINT } from '@/constants/config';

export type AppVersionInfo = {
  latest: string;
  minimum?: string;
};

export const fetchAppVersionInfo = async (): Promise<AppVersionInfo> => {
  const response = await fetch(APP_VERSION_ENDPOINT, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch app version info (status=${response.status})`
    );
  }

  const data: unknown = await response.json();

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid app version info format');
  }

  const obj = data as Record<string, unknown>;

  // latest: 필수, string, 비어있지 않음
  if (typeof obj.latest !== 'string' || !obj.latest.trim()) {
    throw new Error('Latest version is missing or invalid');
  }

  // minimum: 선택, 있으면 string이어야 함
  if (obj.minimum !== undefined && typeof obj.minimum !== 'string') {
    throw new Error('Minimum version has invalid format');
  }

  const minimum = typeof obj.minimum === 'string' ? obj.minimum : undefined;

  return {
    latest: obj.latest,
    minimum,
  };
};
