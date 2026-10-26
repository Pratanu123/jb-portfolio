import Link from "next/link";
import { deleteWork, togglePublish } from "@/actions/works";
import { AdminBack } from "@/components/admin/AdminBack";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { getAdminWorks } from "@/lib/data";

export const metadata = { title: "Works" };

export default async function AdminWorksPage() {
  const works = await getAdminWorks();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <AdminBack href="/admin" label="Back to admin" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Works</h1>
          <p className="mt-3 max-w-xl text-lg text-ink/65">
            Featured published pieces appear in Must reads.
          </p>
        </div>
        <Link href="/admin/works/new" className="btn-gold">
          New work
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-violet/15 border border-violet/15">
        {works.length === 0 ? (
          <li className="p-5 italic">No folios yet.</li>
        ) : (
          works.map((work) => (
            <li
              key={work.id}
              className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-title text-xl">{work.title}</p>
                <p className="text-sm text-ink/55">
                  {work.category.name} · {work.published ? "Published" : "Draft"}
                  {work.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/admin/works/${work.id}`} className="label text-teal">
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await togglePublish(work.id);
                  }}
                >
                  <button className="label text-violet" type="submit">
                    {work.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <ConfirmDelete
                  label="Delete"
                  message={`Delete “${work.title}”? This cannot be undone.`}
                  action={deleteWork.bind(null, work.id)}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
