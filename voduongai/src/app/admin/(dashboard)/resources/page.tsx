"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { resourcesSeed } from "@/data/admin/resources";

export default function ResourcesAdminPage() {
  return <ResourceManager title="Tài nguyên" collectionKey="resources" seed={resourcesSeed} />;
}
