import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const links = [
  { href: "/admin", label: "Home" },
  { href: "/admin/works", label: "Works" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  return (
    <aside className="border-b border-cream/10 bg-plum/50 md:min-h-screen md:w-56 md:border-r md:border-b-0">
      <div className="px-5 py-5">
        <p className="font-display text-xl text-gold">Admin</p>
        <p className="label mt-1 text-cream/50">Edit the site</p>
      </div>
      <nav className="flex flex-wrap gap-3 px-5 pb-5 md:flex-col">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="label text-cream/80 hover:text-gold">
            {link.label}
          </Link>
        ))}
        <Link href="/" className="label text-teal-bright hover:text-gold">
          View site
        </Link>
        <form action={logoutAction}>
          <button className="label text-crimson hover:text-gold" type="submit">
            Log out
          </button>
        </form>
      </nav>
    </aside>
  );
}
