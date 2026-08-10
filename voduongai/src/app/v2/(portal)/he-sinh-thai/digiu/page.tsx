import { notFound } from "next/navigation";

import { PartnerPage } from "@/components/v2/portal/PartnerPage";
import { getPartner } from "@/lib/v2/data/ecosystem";

export const metadata = { title: "DigiU" };

export default async function DigiUPage() {
  const partner = await getPartner("digiu");
  if (!partner) notFound();

  return <PartnerPage partner={partner} />;
}
