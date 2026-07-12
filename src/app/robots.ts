import type { MetadataRoute } from "next";
import { rootUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel"] },
    sitemap: rootUrl("/sitemap.xml"),
  };
}
