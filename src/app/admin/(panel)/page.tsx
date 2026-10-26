import Link from "next/link";
import { AdminBack } from "@/components/admin/AdminBack";
import { getAdminStats } from "@/lib/data";

export const metadata = { title: "Admin" };

const desks = [
  {
    href: "/admin/settings",
    label: "Settings",
    body: "Header, home, footer, About page, and contact — the same order as the live site.",
  },
  {
    href: "/admin/works",
    label: "Works",
    body: "Articles for Must reads and the category pages.",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    body: "The list on Home, plus each gold mark.",
  },
];

export default async function AdminHomePage() {
  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <AdminBack href="/" label="Back to site" />
      <h1 className="font-display text-4xl">Admin</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/65">
        Change the live site from here.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Works", stats.works],
          ["Published", stats.published],
          ["Drafts", stats.drafts],
          ["Categories", stats.categories],
        ].map(([label, value]) => (
          <div key={label} className="border border-violet/20 bg-cream p-4">
            <p className="label text-crimson">{label}</p>
            <p className="mt-2 font-title text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {desks.map((desk) => (
          <Link
            key={desk.href}
            href={desk.href}
            className="block border border-violet/20 bg-cream p-5 transition-colors hover:border-gold"
          >
            <p className="font-title text-2xl">{desk.label}</p>
            <p className="mt-2 text-base leading-relaxed text-ink/65">{desk.body}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-title text-2xl">Recent works</h2>
          <Link href="/admin/works/new" className="btn-gold">
            New work
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-violet/15 border border-violet/15">
          {stats.recent.length === 0 ? (
            <li className="p-4 italic text-ink/50">None yet.</li>
          ) : (
            stats.recent.map((work) => (
              <li key={work.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-title text-lg">{work.title}</p>
                  <p className="text-sm text-ink/50">
                    {work.category.name} · {work.published ? "Published" : "Draft"}
                  </p>
                </div>
                <Link href={`/admin/works/${work.id}`} className="label text-teal">
                  Edit
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
