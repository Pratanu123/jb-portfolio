import Link from "next/link";
import { Caption, Panel } from "@/components/comic/ComicKit";
import { getSettings } from "@/lib/data";

export default async function NotFound() {
  const settings = await getSettings();
  const { copy } = settings;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-4">
      <Panel className="py-8 text-center">
        <Caption>{copy.notFoundEyebrow}</Caption>
        <h1 className="font-display folio-display mt-4">{copy.notFoundHeading}</h1>
        <p className="folio-body mt-4">{copy.notFoundBody}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="comic-btn">
            ← {copy.navBackHome}
          </Link>
          <Link href="/categories" className="comic-btn">
            {copy.navCategories}
          </Link>
          <a
            href={settings.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="comic-btn-red"
          >
            {settings.websiteLabel}
          </a>
        </div>
      </Panel>
    </div>
  );
}
