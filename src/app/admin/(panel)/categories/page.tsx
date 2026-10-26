import { AdminBack } from "@/components/admin/AdminBack";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getAdminCategories } from "@/lib/data";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <AdminBack href="/admin" label="Back to admin" />
      <h1 className="font-display text-4xl">Categories</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/65">
        Name, short description, and the gold mark on Home.
      </p>
      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
