"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

const links = [
  { href: "/services", key: "services" as const },
  { href: "/digital", key: "digital" as const },
  { href: "/courses", key: "courses" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function SiteHeader() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function switchLocale(next: "es" | "en") {
    router.replace(pathname, { locale: next });
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[background,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] shadow-[0_8px_32px_rgba(16,24,32,0.12)]"
          : "border-b border-transparent bg-[color-mix(in_srgb,var(--background)_72%,transparent)]"
      }`}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <Link
          href="/"
          className="focus-ring flex items-center gap-2.5"
          aria-label="Holive"
          data-holive-logo
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mark.svg"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 shrink-0"
            data-holive-logo
          />
          <span className="font-display text-sm font-semibold tracking-[0.28em] text-[var(--foreground)]">
            HOLIVE
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 text-xs tracking-wide text-[color-mix(in_srgb,var(--foreground)_72%,transparent)] lg:flex"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`focus-ring transition-colors hover:text-[var(--holive-gold)] ${
                  active ? "text-[var(--holive-gold)]" : ""
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="focus-ring rounded border border-[var(--border)] px-2.5 py-1.5 text-[0.65rem] font-semibold tracking-wider lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>

          <div
            className="flex overflow-hidden rounded border border-[var(--border)] text-[0.65rem] font-semibold tracking-wider"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              className={`focus-ring px-2.5 py-1.5 ${
                locale === "es"
                  ? "bg-[var(--holive-purple)] text-[var(--holive-white)]"
                  : "hover:bg-[var(--surface-muted)]"
              }`}
              onClick={() => switchLocale("es")}
              aria-pressed={locale === "es"}
            >
              {t("localeEs")}
            </button>
            <button
              type="button"
              className={`focus-ring px-2.5 py-1.5 ${
                locale === "en"
                  ? "bg-[var(--holive-purple)] text-[var(--holive-white)]"
                  : "hover:bg-[var(--surface-muted)]"
              }`}
              onClick={() => switchLocale("en")}
              aria-pressed={locale === "en"}
            >
              {t("localeEn")}
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring rounded border border-[var(--border)] px-2.5 py-1.5 text-[0.65rem] font-semibold tracking-wider hover:border-[var(--holive-gold)]"
            aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
          >
            {theme === "dark" ? "LIGHT" : "DARK"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_95%,transparent)] px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="focus-ring block py-2 tracking-wide hover:text-[var(--holive-gold)]"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
