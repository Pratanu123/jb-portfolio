"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteCopy } from "@/lib/copy";

function destination(pathname: string, copy: SiteCopy) {
  if (pathname.startsWith("/works/")) {
    return { href: "/categories", label: copy.navBackCategories };
  }
  if (pathname.startsWith("/categories/") && pathname !== "/categories") {
    return { href: "/categories", label: copy.navBackCategories };
  }
  if (pathname === "/categories" || pathname === "/about" || pathname === "/contact") {
    return { href: "/", label: copy.navBackHome };
  }
  return { href: "/", label: copy.navBack };
}

export function PageBack({ copy }: { copy: SiteCopy }) {
  const pathname = usePathname();

  if (!pathname || pathname === "/") return null;

  const { href, label } = destination(pathname, copy);

  return (
    <div className="folio-x relative z-30 pt-5 md:pt-6">
      <Link
        href={href}
        className="inline-flex min-h-11 items-center text-[16px] font-semibold tracking-wide text-[#e8c56b] hover:text-[#f4ead4]"
      >
        <span aria-hidden className="mr-2 font-normal">
          ←
        </span>
        {label}
      </Link>
    </div>
  );
}
