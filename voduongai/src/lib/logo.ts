const extensionById: Record<string, string> = {
  chatgpt: "svg",
  claude: "ico",
  gemini: "svg",
  canva: "ico",
  capcut: "ico",
  heygen: "ico",
  hostinger: "ico",
  notion: "ico",
  make: "ico",
  "google-workspace": "ico",
  figma: "ico",
};

export function logoUrl(id: string) {
  const ext = extensionById[id] ?? "ico";
  return `/tools/${id}.${ext}`;
}
