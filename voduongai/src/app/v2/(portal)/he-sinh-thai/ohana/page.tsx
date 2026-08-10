import { notFound } from "next/navigation";

import { PartnerPage } from "@/components/v2/portal/PartnerPage";
import { getPartner } from "@/lib/v2/data/ecosystem";

export const metadata = { title: "Ohana" };

export default async function OhanaPage() {
  const partner = await getPartner("ohana");
  if (!partner) notFound();

  return <PartnerPage partner={partner} />;
}
