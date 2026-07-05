import { redirect } from "next/navigation";
import { PROFESSION_GROUPS } from "@/data/khong-gian-ai";

export async function generateStaticParams() {
  return PROFESSION_GROUPS.map((p) => ({ slug: p.slug }));
}

export default async function LegacyProfessionRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/portal/aiworkspace/${slug}`);
}
