import type { ArchiveRecord } from '@/stores/useArchiveDataStore';

export type ArchivePreview = ArchiveRecord & {
  previewImages: string[];
};

export const selectLatestArchives = (
  archives: ArchiveRecord[]
): ArchiveRecord[] =>
  archives
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)
    .map((archive) => ({
      ...archive,
      ...(archive.images ? { images: archive.images.slice() } : {}),
    }));

export const selectLatestArchivePreviews = (
  archives: ArchiveRecord[]
): ArchivePreview[] =>
  selectLatestArchives(archives).map((archive) => ({
    ...archive,
    previewImages: Array.isArray(archive.images)
      ? archive.images.slice(0, 4)
      : [],
  }));
