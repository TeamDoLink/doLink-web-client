import { APP_VERSION_ENDPOINT } from '@/constants/config';

export type AppVersionInfo = {
  latest: string;
  minimum?: string;
};

export const fetchAppVersionInfo = async (): Promise<AppVersionInfo> => {
  const response = await fetch(APP_VERSION_ENDPOINT, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch app version info');
  }

  const data = (await response.json()) as AppVersionInfo;

  if (!data.latest) {
    throw new Error('Latest version is missing');
  }

  return data;
};
