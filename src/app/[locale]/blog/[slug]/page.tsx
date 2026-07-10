import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { BlogPostClient } from "@/components/pages/BlogPostClient";
import { BLOG_POSTS, getPost } from "@/content/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Holive" };
  const title = locale.startsWith("en") ? post.title.en : post.title.es;
  const description = locale.startsWith("en")
    ? post.excerpt.en
    : post.excerpt.es;
  return { title: `${title} — Holive`, description };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "Pages.blog" });

  return (
    <>
      <BlogPostClient
        slug={post.slug}
        date={post.date}
        readingMinutes={post.readingMinutes}
        title={locale.startsWith("en") ? post.title.en : post.title.es}
        tags={locale.startsWith("en") ? post.tags.en : post.tags.es}
        body={locale.startsWith("en") ? post.body.en : post.body.es}
        backLabel={t("back")}
        minLabel={t("min", { n: post.readingMinutes })}
        holiAside={t("holiAside")}
      />
      <Footer showGame={false} />
    </>
  );
}
