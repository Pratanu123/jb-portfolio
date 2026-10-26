import Link from "next/link";

type Props = {
  category: { name: string; slug: string };
  returnLabel: string;
  categoriesLabel: string;
};

export function WorkNav({ category, returnLabel, categoriesLabel }: Props) {
  return (
    <nav
      aria-label="Post"
      className="flex flex-col gap-3 border border-[#e8c56b]/30 bg-black/55 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8"
    >
      <Link
        href={`/categories/${category.slug}`}
        className="inline-flex min-h-11 items-center text-[16px] font-bold text-[#e8c56b] hover:text-[#f4ead4]"
      >
        <span aria-hidden className="mr-2 font-normal">
          ←
        </span>
        <span>
          {returnLabel}
          <span className="font-normal text-[#cfc3a8]"> · {category.name}</span>
        </span>
      </Link>
      <Link
        href="/categories"
        className="inline-flex min-h-11 items-center text-[16px] font-bold text-[#e8c56b] hover:text-[#f4ead4]"
      >
        {categoriesLabel}
      </Link>
    </nav>
  );
}
