"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { checklistsSeed } from "@/data/admin/resources";

export default function ChecklistsAdminPage() {
  return <ResourceManager title="Checklist" collectionKey="checklists" seed={checklistsSeed} />;
}
