"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { ebooksSeed } from "@/data/admin/resources";

export default function EbooksAdminPage() {
  return <ResourceManager title="Ebook" collectionKey="ebooks" seed={ebooksSeed} />;
}
