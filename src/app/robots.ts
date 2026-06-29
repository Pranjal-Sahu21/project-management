import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://zynero-delta.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/contact"],
      disallow: [
        "/projects",
        "/projectsDetail",
        "/team",
        "/settings",
        "/taskDetails",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
