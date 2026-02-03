export const openExternalLink = (url: string) => {
  if (!url) {
    return;
  }

  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return;
    }

    window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Invalid URL:', url);
  }
};
