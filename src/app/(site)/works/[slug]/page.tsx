import { notFound } from "next/navigation";
import { SiteMedia } from "@/components/folio/SiteMedia";
import { ArticleBody } from "@/components/works/ArticleBody";
import { WorkNav } from "@/components/works/WorkNav";
import { isSvgUrl } from "@/lib/media";
import { getSettings, getWorkBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "Work" };
  return { title: work.title, description: work.excerpt };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const [work, settings] = await Promise.all([getWorkBySlug(slug), getSettings()]);
  if (!work) notFound();
  const cover = work.coverImageUrl;

  return (
    <article className="folio-x relative z-10 py-6 md:py-10">
      <WorkNav
        category={work.category}
        returnLabel={settings.copy.workReturn}
        categoriesLabel={settings.copy.workCategoriesMenu}
      />
      <h1 className="font-display folio-display mt-6 break-words text-[#f4ead4]">{work.title}</h1>
      <p className="folio-body mt-4">{work.excerpt}</p>
      <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-[#8a7340] uppercase">
        {formatDate(work.publishedAt)}
      </p>

      {cover ? (
        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden bg-[#111] sm:aspect-[2/1]">
          <SiteMedia
            src={cover}
            alt=""
            fill
            objectFit={isSvgUrl(cover) ? "contain" : "cover"}
            priority
            sizes="100vw"
          />
        </div>
      ) : null}

      <div className="mt-10 w-full">
        <ArticleBody body={work.body} emptyLabel={settings.copy.articleEmpty} />
        <div className="mt-10 border-t border-[#f4ead4]/15 pt-6">
          <WorkNav
            category={work.category}
            returnLabel={settings.copy.workReturn}
            categoriesLabel={settings.copy.workCategoriesMenu}
          />
        </div>
      </div>
    </article>
  );
}
