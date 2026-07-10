"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { BLOG_POSTS, localized } from "@/content/blog";

export function BlogIndexClient() {
  const t = useTranslations("Pages.blog");
  const locale = useLocale();

  return (
    <PageHero
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      holiTip={t("holiAside")}
    >
      <ul className="space-y-8">
        {BLOG_POSTS.map((post, i) => (
          <SectionReveal key={post.slug} delay={0.04 * i}>
            <li>
              <Link
                href={`/blog/${post.slug}`}
                className="focus-ring group block border-b border-[var(--border)] pb-8"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <time className="font-mono-code text-[0.65rem] tracking-[0.18em] text-[var(--holive-gold)]">
                    {post.date}
                  </time>
                  <span className="font-mono-code text-[0.6rem] text-[color-mix(in_srgb,var(--foreground)_45%,transparent)]">
                    {t("min", { n: post.readingMinutes })}
                  </span>
                </div>
                <h2 className="font-display mt-2 text-2xl font-semibold transition-colors group-hover:text-[var(--holive-gold)]">
                  {localized(post.title, locale)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
                  {localized(post.excerpt, locale)}
                </p>
                <p className="mt-3 text-xs tracking-wide text-[var(--holive-purple)]">
                  {t("read")} →
                </p>
              </Link>
            </li>
          </SectionReveal>
        ))}
      </ul>
    </PageHero>
  );
}
