"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { templatesSeed } from "@/data/admin/resources";

export default function TemplatesAdminPage() {
  return <ResourceManager title="Template" collectionKey="templates" seed={templatesSeed} />;
}
