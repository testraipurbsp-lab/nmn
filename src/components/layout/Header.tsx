"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { buttonStyles } from "@/components/ui/Button";
import { mainNav } from "@/config/navigation";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname();
  // The menu is "open" only for the page it was opened on, so navigating closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) =>
    setOpenAt((cur) => {
      const was = cur === pathname;
      const value = typeof next === "function" ? next(was) : next;
      return value ? pathname : null;
    });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-ink/85 backdrop-blur-md" : "border-transparent bg-ink/40"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="NMN.DEV home" className="relative z-[60]">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`py-2 text-[0.92rem] transition-colors duration-200 hover:text-paper ${
                      active ? "text-paper" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      aria-hidden
                      className="absolute -bottom-[1px] left-0 right-0 h-px bg-lime"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className={buttonStyles("primary", "max-md:hidden !py-2.5")}>
            Let&apos;s Talk
          </Link>
          <button
            type="button"
            className="relative z-[60] -mr-2 inline-flex size-11 items-center justify-center text-paper md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
    </header>

    {/* Rendered outside <header>: its backdrop-filter would otherwise become the
        containing block for this fixed overlay and clip it to the header's box. */}
    <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pb-10 pt-28 md:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden className="ambient pointer-events-none absolute -right-24 top-20 size-[360px]" />
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {[...mainNav, { label: "Contact", href: "/contact" }].map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      className="border-b border-line"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-baseline justify-between py-5 text-4xl font-medium tracking-[-0.035em] ${
                          active ? "text-lime" : "text-paper"
                        }`}
                      >
                        {item.label}
                        <span className="label">{String(i + 1).padStart(2, "0")}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/contact" className={buttonStyles("primary", "w-full")}>
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
