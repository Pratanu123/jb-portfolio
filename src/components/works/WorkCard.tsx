import Link from "next/link";
import { SiteMedia } from "@/components/folio/SiteMedia";
import { isSvgUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";

type WorkCardProps = {
  work: {
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl: string;
    publishedAt: Date | null;
    category: { name: string; slug: string; accent: string };
  };
  moreLabel?: string;
};

function toSentenceCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function WorkCard({ work, moreLabel = "Read more" }: WorkCardProps) {
  const cover = work.coverImageUrl || "/covers/cover-1.svg";

  return (
    <Link href={`/works/${work.slug}`} className="group block min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111] sm:aspect-[4/5]">
        <SiteMedia
          src={cover}
          alt=""
          fill
          objectFit={isSvgUrl(cover) ? "contain" : "cover"}
          className="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <p className="mt-3 text-[11px] font-bold tracking-wide text-[#8a7340] uppercase">
        {work.category.name}
      </p>
      <h3 className="font-display folio-list mt-2 break-words text-[#f4ead4]">
        {toSentenceCase(work.title)}
      </h3>
      <p className="folio-body mt-3">{work.excerpt}</p>
      {work.publishedAt ? (
        <p className="mt-3 text-[11px] tracking-[0.14em] text-[#8a7340] uppercase">
          {formatDate(work.publishedAt)}
        </p>
      ) : null}
      <span className="mt-4 inline-block text-[16px] font-bold text-[#e8c56b]">{moreLabel}</span>
    </Link>
  );
}
