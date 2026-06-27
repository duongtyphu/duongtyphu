const warnedTables = new Set<string>();

type StoryDbError = { code?: string; message?: string } | null | undefined;

/**
 * Human Story Engine tables (reflections, memory_capsules) only exist once
 * supabase-human-story-engine.sql has been run — see
 * docs/HUMAN_STORY_ENGINE_ACTIVATION.md. Until then, queries against them
 * fail with a "relation does not exist" error, which we treat as "not
 * activated yet" rather than a real failure.
 */
export function isMissingTableError(error: StoryDbError): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") return true;
  return typeof error.message === "string" && error.message.toLowerCase().includes("does not exist");
}

export function warnMissingTableOnce(table: string) {
  if (process.env.NODE_ENV === "production") return;
  if (warnedTables.has(table)) return;
  warnedTables.add(table);
  console.warn(
    `[Human Story Engine] Bảng "${table}" chưa tồn tại trên Supabase. Chạy supabase-human-story-engine.sql để kích hoạt — xem docs/HUMAN_STORY_ENGINE_ACTIVATION.md.`
  );
}
