type Item = {
  href: string;
  label: string;
};

export function FolioLinkRows({ items }: { items: Item[] }) {
  return (
    <div className="mt-8 grid w-fit max-w-full grid-cols-[auto_2.75rem] items-center gap-x-6">
      {items.map((item) => (
        <a
          key={`${item.label}-${item.href}`}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="font-display col-span-2 grid grid-cols-subgrid items-center py-3 text-[20px] tracking-tight uppercase"
        >
          <span className="min-w-0">{item.label}</span>
          <span aria-hidden className="text-center text-[32px] font-light leading-none">
            +
          </span>
        </a>
      ))}
    </div>
  );
}
