import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AntiCopy } from "@/components/site/AntiCopy";
import { BackToTop } from "@/components/site/BackToTop";
import { ChromeGate } from "@/components/site/ChromeGate";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDescription,
    keywords: [
      "Vo Duong AI",
      "VO DUONG AI",
      "học AI",
      "AI Toolkit",
      "Affiliate Marketing",
      "tài sản số",
    ],
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: siteConfig.url,
      siteName: settings.siteName,
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    icons: {
      icon: settings.faviconUrl,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.displayName,
    alternateName: settings.siteName,
    url: siteConfig.url,
    description: settings.seoDescription,
    sameAs: [settings.facebookUrl, settings.youtubeUrl, settings.tiktokUrl, settings.zaloUrl],
  };

  return (
    <html lang="vi" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--color-brand-blue:${settings.primaryColor};--color-brand-violet:${settings.secondaryColor};--color-brand-orange:${settings.accentColor};}`,
          }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        <div className="mesh-navy fixed inset-0 -z-10" aria-hidden="true" />
        <AntiCopy />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ChromeGate header={<Header settings={settings} />} footer={<Footer settings={settings} />}>
          {children}
        </ChromeGate>
        <BackToTop />
      </body>
    </html>
  );
}
