import Link from "next/link";

export function AdminBack({
  href = "/admin",
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="label mb-5 inline-flex min-h-11 items-center text-violet hover:text-ink"
    >
      <span aria-hidden className="mr-2 font-normal">
        ←
      </span>
      {label}
    </Link>
  );
}
