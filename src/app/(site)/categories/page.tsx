import { CategoryIndex } from "@/components/folio/CategoryIndex";
import { getCategories, getSettings } from "@/lib/data";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <section className="folio-x relative z-10 py-6 md:py-10">
      <p className="font-display folio-display text-[#f4ead4]">
        {settings.copy.categoriesHeading}
      </p>
      <CategoryIndex
        categories={categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          mark: category.mark,
          markImageUrl: category.markImageUrl,
        }))}
      />
    </section>
  );
}
