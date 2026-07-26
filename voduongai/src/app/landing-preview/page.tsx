import type { Metadata } from "next";
import { LandingPreviewHeader } from "@/components/landing-preview/LandingPreviewHeader";
import { LandingPreviewHero } from "@/components/landing-preview/LandingPreviewHero";
import { LandingPreviewStatsBar } from "@/components/landing-preview/LandingPreviewStatsBar";
import { LandingPreviewEcosystem } from "@/components/landing-preview/LandingPreviewEcosystem";
import { LandingPreviewRoadmap } from "@/components/landing-preview/LandingPreviewRoadmap";
import { LandingPreviewPlatform } from "@/components/landing-preview/LandingPreviewPlatform";
import { LandingPreviewCommunity } from "@/components/landing-preview/LandingPreviewCommunity";
import { LandingPreviewQuoteBar } from "@/components/landing-preview/LandingPreviewQuoteBar";
import { LandingPreviewNewsletter } from "@/components/landing-preview/LandingPreviewNewsletter";
import { LandingPreviewNetworkFounder } from "@/components/landing-preview/LandingPreviewNetworkFounder";
import { LandingPreviewFooter } from "@/components/landing-preview/LandingPreviewFooter";

const title = "Xem trước thiết kế landing page mới";
const description = "Bản xem trước thiết kế trang chủ mới của VO DUONG AI — không phải trang chủ chính thức.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
};

export default function LandingPreviewPage() {
  return (
    <div className="bg-[#F7F8FC]">
      <LandingPreviewHeader />
      <LandingPreviewHero />
      <LandingPreviewStatsBar />
      <LandingPreviewEcosystem />
      <LandingPreviewRoadmap />
      <LandingPreviewPlatform />
      <LandingPreviewCommunity />
      <LandingPreviewQuoteBar />
      <LandingPreviewNewsletter />
      <LandingPreviewNetworkFounder />
      <LandingPreviewFooter />
    </div>
  );
}
