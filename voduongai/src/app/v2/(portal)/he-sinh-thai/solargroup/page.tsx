import { notFound } from "next/navigation";

import { PartnerPage } from "@/components/v2/portal/PartnerPage";
import { getPartner } from "@/lib/v2/data/ecosystem";

export const metadata = { title: "SolarGroup" };

export default async function SolarGroupPage() {
  const partner = await getPartner("solargroup");
  if (!partner) notFound();

  return <PartnerPage partner={partner} />;
}
