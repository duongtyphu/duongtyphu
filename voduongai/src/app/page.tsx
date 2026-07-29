import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

// Static canonical scoped to just "/" — the root layout's metadata is
// shared by every route (about, contact, blogai, privacy...), so setting
// canonical there would wrongly point all of them at the homepage. This
// page is a Server Component specifically so it can carry its own
// metadata; the actual UI (which needs the client-only theme context)
// lives in HomeClient.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeClient />;
}
