import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow AI answer-engine crawlers that cite sources (do NOT train on content)
      {
        userAgent: [
          "OAI-SearchBot",       // OpenAI search/citation bot
          "Claude-SearchBot",    // Anthropic search/citation bot
          "Claude-User",         // Anthropic Claude browsing
          "PerplexityBot",       // Perplexity AI
          "Googlebot-Extended",  // Google AI Overviews
        ],
        allow: "/",
        disallow: ["/dashboard", "/projects/", "/settings/", "/api/", "/auth/"],
      },
      // Block training bots (uncomment to opt out of AI training data collection)
      // { userAgent: "GPTBot", disallow: "/" },
      // { userAgent: "ClaudeBot", disallow: "/" },
      // { userAgent: "CCBot", disallow: "/" },
      // { userAgent: "anthropic-ai", disallow: "/" },

      // Default: allow public pages, block private app routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/projects/", "/settings/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
