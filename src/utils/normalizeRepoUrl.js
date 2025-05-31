export default function normalizeRepoUrl(url) {
  if (url.startsWith('https://github.com/')) {
    return url.replace('https://github.com/', '').replace(/\.git$/, '');
  }
  return url;
}
