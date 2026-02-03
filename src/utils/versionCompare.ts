import { coerce, gte } from 'semver';

export const isLatestVersion = (
  current: string,
  latest: string
): boolean | null => {
  const currentSemver = coerce(current);
  const latestSemver = coerce(latest);

  if (!currentSemver || !latestSemver) {
    return null;
  }

  return gte(currentSemver, latestSemver);
};
