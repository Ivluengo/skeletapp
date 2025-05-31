export default function isRemoteRepo(url) {
  return (
    /^https:\/\/github\.com\/.+\/.+/.test(url) || // URL completa
    /^[\w-]+\/[\w-]+(#.+)?$/.test(url) // user/repo o user/repo#branch
  );
}
