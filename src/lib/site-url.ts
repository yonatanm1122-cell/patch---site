import { site } from "@/content/site";

/** Final public URL. Until site.url is set, a local URL is used and the launch check flags it. */
export const siteUrl = (site.url || "http://localhost:4173").replace(/\/$/, "");
