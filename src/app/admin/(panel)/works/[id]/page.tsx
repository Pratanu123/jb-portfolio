import { notFound } from "next/navigation";
import { AdminBack } from "@/components/admin/AdminBack";
import { WorkForm } from "@/components/admin/WorkForm";
import { getAdminCategories, getAdminWork } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Edit work" };

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params;
  const [work, categories] = await Promise.all([
    getAdminWork(id),
    getAdminCategories(),
  ]);
  if (!work) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <AdminBack href="/admin/works" label="Back to works" />
      <h1 className="font-display text-4xl">Edit work</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/65">
        Title, preview, cover, and the article.
      </p>
      <div className="mt-8">
        <WorkForm categories={categories} work={work} />
      </div>
    </div>
  );
}
