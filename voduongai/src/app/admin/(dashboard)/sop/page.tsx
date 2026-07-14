"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { sopSeed } from "@/data/admin/resources";

export default function SopAdminPage() {
  return <ResourceManager title="SOP" collectionKey="sop" seed={sopSeed} />;
}
