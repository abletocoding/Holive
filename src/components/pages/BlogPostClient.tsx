"use client";

import { Link } from "@/i18n/navigation";
import { HoliMascot } from "@/components/holi/HoliMascot";
import { TextScramble } from "@/components/effects/TextScramble";

type Props = {
  slug: string;
  date: string;
  readingMinutes: number;
  title: string;
  tags: string[];
  body: string[];
  backLabel: string;
  minLabel: string;
  holiAside: string;
};

export function BlogPostClient({
  date,
  title,
  tags,
  body,
  backLabel,
  minLabel,
  holiAside,
}: Props) {
  return (
    <article className="page-hero">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Link
          href="/blog"
          className="focus-ring font-mono-code text-xs tracking-[0.2em] text-[var(--holive-gold)] hover:underline"
        >
          ← {backLabel}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_200px]">
          <div>
            <div className="flex flex-wrap gap-3 font-mono-code text-[0.65rem] tracking-[0.18em] text-[color-mix(in_srgb,var(--foreground)_50%,transparent)]">
              <time>{date}</time>
              <span>{minLabel}</span>
            </div>
            <TextScramble
              as="h1"
              text={title}
              className="font-display mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight"
            />
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded border border-[var(--border)] px-2 py-0.5 font-mono-code text-[0.55rem] tracking-[0.15em]"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="prose-holive mt-10 max-w-2xl text-base leading-relaxed text-[color-mix(in_srgb,var(--foreground)_82%,transparent)]">
              {body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="doodle-frame flex flex-col items-center text-center">
              <HoliMascot pose="think" className="h-20 w-16" />
              <p className="font-mono-code mt-3 text-[0.55rem] tracking-[0.22em] text-[var(--holive-gold)]">
                HOLI
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,transparent)]">
                {holiAside}
              </p>
            </div>
          </aside>
        </div>
      </div>
      <div id="main" className="sr-only" />
    </article>
  );
}
