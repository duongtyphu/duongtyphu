export function logoUrl(link: string) {
  const domain = link.split(",")[0].trim().replace(/^https?:\/\//, "").split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
