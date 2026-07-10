import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* OpenNext / Cloudflare config lands in deploy phase */
};

export default withNextIntl(nextConfig);
