// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

import mdx from "@astrojs/mdx";

const shikiConfig = /** @type {const} */ ({
  themes: codeThemes,
  defaultColor: codeDefaultColor,
});

export default defineConfig({
  site: siteConfig.siteUrl,
  redirects: {
    "/posts/leaked-obs-secret-keys": "/post/exposed-secret-keys-site-defacement-for-800",
    "/posts/employee-email-leakage": "/post/leaking-employee-emails-for-250",
    "/posts/strapi-rce-writeup": "/post/strapi-rce-billion-dollar-company",
    "/whoami": "/about",
  },
  integrations: [
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
    mdx(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
