"use client";

import { ContentManager } from "@/components/admin/ContentManager";
import { newsSeed } from "@/data/admin/content";

export default function NewsAdminPage() {
  return <ContentManager title="Tin tức nội bộ" collectionKey="news" seed={newsSeed} />;
}
