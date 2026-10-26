"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteCopy } from "@/lib/copy";

type Props = {
  displayName: string;
  websiteUrl: string;
  websiteLabel: string;
  copy: SiteCopy;
};

export function SiteHeader({ displayName, websiteUrl, websiteLabel, copy }: Props) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: copy.navHome },
    { href: "/categories", label: copy.navCategories },
    { href: "/about", label: copy.navAbout },
    { href: "/contact", label: copy.navContact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/40 text-[#f4ead4] backdrop-blur-sm pt-[env(safe-area-inset-top)]">
      <div className="folio-x relative flex min-h-[52px] items-center justify-between">
        <Link
          href="/"
          className="font-display max-w-[62%] truncate text-[13px] tracking-[0.12em] uppercase sm:text-[14px] sm:tracking-[0.14em]"
          onClick={() => setOpen(false)}
        >
          {displayName}.
        </Link>
        <nav className="hidden items-center gap-5 lg:flex xl:gap-12">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[12px] tracking-[0.16em] uppercase"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display text-[12px] tracking-[0.16em] uppercase"
          >
            {websiteLabel}
          </a>
        </nav>
        <button
          type="button"
          className="font-display inline-flex min-h-11 min-w-11 items-center justify-end text-[12px] tracking-[0.16em] uppercase lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? copy.navClose : copy.navMenu}
        </button>
      </div>
      {open ? (
        <nav className="folio-x border-t border-[#f4ead4]/15 bg-black py-4 lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display flex min-h-11 items-center text-[14px] tracking-[0.14em] uppercase"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="font-display flex min-h-11 items-center text-[14px] tracking-[0.14em] uppercase"
              onClick={() => setOpen(false)}
            >
              {websiteLabel}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
