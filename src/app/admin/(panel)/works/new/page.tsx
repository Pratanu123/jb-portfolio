import { AdminBack } from "@/components/admin/AdminBack";
import { WorkForm } from "@/components/admin/WorkForm";
import { getAdminCategories } from "@/lib/data";

export const metadata = { title: "New work" };

export default async function NewWorkPage() {
  const categories = await getAdminCategories();
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <AdminBack href="/admin/works" label="Back to works" />
      <h1 className="font-display text-4xl">New work</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/65">
        Title, preview, cover, and the article.
      </p>
      <div className="mt-8">
        <WorkForm categories={categories} />
      </div>
    </div>
  );
}
