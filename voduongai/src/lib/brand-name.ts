export function brandMain(siteName: string) {
  const lastSpace = siteName.lastIndexOf(" ");
  return lastSpace === -1 ? siteName : siteName.slice(0, lastSpace + 1);
}

export function brandAccent(siteName: string) {
  const lastSpace = siteName.lastIndexOf(" ");
  return lastSpace === -1 ? "" : siteName.slice(lastSpace + 1);
}
