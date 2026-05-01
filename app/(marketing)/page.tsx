import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/get-user";
import { HeroSection } from "@/components/marketing/hero-section";
import { CapabilitiesSection } from "@/components/marketing/capabilities-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Xern AI — Turn Customer Feedback into Product Specs" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: "Xern AI — Turn Customer Feedback into Product Specs",
    description: SITE_DESCRIPTION,
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "2 projects/month, up to 5 files, AI analysis, Markdown export",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "9",
      priceCurrency: "USD",
      billingIncrement: "month",
      description: "20 projects/month, up to 10 files, full export, indefinite persistence",
    },
    {
      "@type": "Offer",
      name: "Max",
      price: "19",
      priceCurrency: "USD",
      billingIncrement: "month",
      description: "Unlimited projects, up to 20 files, priority AI, early access",
    },
  ],
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <HeroSection isAuthenticated={isAuthenticated} />
      <div className="relative z-10 mx-auto max-w-[1100px] h-px bg-gradient-to-r from-transparent via-[var(--color-border-subtle)] to-transparent" />
      <CapabilitiesSection />
      <div className="relative z-10 mx-auto max-w-[1100px] h-px bg-gradient-to-r from-transparent via-[var(--color-border-subtle)] to-transparent" />
      <HowItWorksSection />
      <div className="relative z-10 mx-auto max-w-[1100px] h-px bg-gradient-to-r from-transparent via-[var(--color-border-subtle)] to-transparent" />
      <CtaSection isAuthenticated={isAuthenticated} />
    </>
  );
}
