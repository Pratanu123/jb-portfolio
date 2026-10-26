import { FooterSky } from "@/components/folio/FooterSky";
import type { SiteCopy } from "@/lib/copy";
import type { SocialLink } from "@/lib/types";

type Props = {
  displayName: string;
  tagline: string;
  websiteUrl: string;
  websiteLabel: string;
  socials: SocialLink[];
  copy: SiteCopy;
};

export function SiteFooter({
  displayName,
  tagline,
  websiteUrl,
  websiteLabel,
  socials,
  copy,
}: Props) {
  return (
    <footer className="folio-x relative z-10 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-[#f4ead4]">
      <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
        <div className="w-fit max-w-full">
          <div>
            <p className="font-display text-balance text-[1.5rem] leading-[1.15] tracking-[-0.03em] text-[#f4ead4] uppercase sm:text-[1.75rem]">
              {copy.footerFriends}
            </p>
            <p className="mt-2 text-[13px] tracking-[0.12em] text-[#8a7340] uppercase">
              {displayName}
              {tagline ? (
                <>
                  <span className="mx-2 text-[#8a7340]/50" aria-hidden>
                    ·
                  </span>
                  {tagline}
                </>
              ) : null}
            </p>
          </div>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-x-10 gap-y-6">
            <div className="flex flex-col">
              <p className="mb-2 text-[11px] tracking-[0.16em] text-[#666] uppercase">{copy.footerMenu}</p>
              <a href="/" className="py-1.5 text-[15px]">
                {copy.navHome}
              </a>
              <a href="/categories" className="py-1.5 text-[15px]">
                {copy.navCategories}
              </a>
              <a href="/about" className="py-1.5 text-[15px]">
                {copy.navAbout}
              </a>
              <a href="/contact" className="py-1.5 text-[15px]">
                {copy.navContact}
              </a>
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-[11px] tracking-[0.16em] text-[#666] uppercase">{copy.footerContact}</p>
              <a href={websiteUrl} target="_blank" rel="noreferrer" className="py-1.5 text-[15px]">
                {websiteLabel}
              </a>
              {socials.map((social) => (
                <a key={social.url} href={social.url} target="_blank" rel="noreferrer" className="py-1.5 text-[15px]">
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <a
            href="#top"
            className="mt-6 inline-flex py-2 text-[13px] tracking-wide text-[#8a8070] uppercase"
          >
            {copy.footerBackToTop}
          </a>
        </div>
        <div className="justify-self-end">
          <FooterSky />
        </div>
      </div>
    </footer>
  );
}
