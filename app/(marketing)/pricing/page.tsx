import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple, transparent pricing for ${SITE_NAME}. Start free, upgrade when you're ready. Plans from $0 to $19/month.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    url: `${SITE_URL}/pricing`,
    title: `Pricing — ${SITE_NAME}`,
    description: `Simple, transparent pricing for ${SITE_NAME}. Start free, upgrade when you're ready.`,
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
