import { notFound } from "next/navigation";
import { WorkCard } from "@/components/works/WorkCard";
import { getCategoryBySlug, getSettings } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, settings] = await Promise.all([
    getCategoryBySlug(slug),
    getSettings(),
  ]);
  if (!category) notFound();

  const count = category.works.length;
  const countLabel =
    count === 1
      ? `${count} ${settings.copy.workCountSingular}`
      : `${count} ${settings.copy.workCountPlural}`;

  return (
    <section className="folio-x relative z-10 py-6 md:py-10">
      <h1 className="font-display folio-display break-words text-[#f4ead4]">
        {category.name}
      </h1>
      {category.description ? (
        <p className="folio-body mt-4 max-w-2xl">{category.description}</p>
      ) : null}
      <p className="mt-3 text-[11px] tracking-[0.18em] text-[#8a7340] uppercase">{countLabel}</p>

      {count === 0 ? (
        <p className="folio-body mt-10 max-w-xl">{settings.copy.categoryEmpty}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {category.works.map((work) => (
            <WorkCard key={work.id} work={work} moreLabel={settings.copy.readMore} />
          ))}
        </div>
      )}
    </section>
  );
}
