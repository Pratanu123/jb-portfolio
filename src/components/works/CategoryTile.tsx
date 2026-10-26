import Link from "next/link";
import { SiteMedia } from "@/components/folio/SiteMedia";

type Props = {
  category: {
    name: string;
    slug: string;
    description: string;
    imageUrl?: string;
    accent: string;
    _count: { works: number };
  };
  index?: number;
  workCountSingular: string;
  workCountPlural: string;
};

export function CategoryTile({
  category,
  workCountSingular,
  workCountPlural,
}: Props) {
  const image = category.imageUrl || `/categories/${category.slug}.svg`;
  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <div className="relative aspect-4/5 overflow-hidden bg-[#111]">
        <SiteMedia
          src={image}
          alt=""
          fill
          objectFit="cover"
          className="transition-transform duration-700 group-hover:scale-105"
          sizes="280px"
        />
      </div>
      <p className="mt-3 text-[0.68rem] tracking-[0.18em] text-[#6b6b6b] uppercase">
        {category._count.works}{" "}
        {category._count.works === 1 ? workCountSingular : workCountPlural}
      </p>
      <h3 className="font-display mt-2 text-2xl leading-none tracking-tight">{category.name}</h3>
      <p className="mt-2 text-base leading-relaxed text-[#2a2a2a]">{category.description}</p>
    </Link>
  );
}
