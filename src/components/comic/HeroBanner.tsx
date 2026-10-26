import { HeroCopy } from "@/components/folio/HeroCopy";
import { SiteMedia } from "@/components/folio/SiteMedia";
import type { SiteCopy } from "@/lib/copy";

type Props = {
  name: string;
  voice: string;
  imageUrl: string;
  copy: SiteCopy;
};

export function HeroBanner({ name, voice, imageUrl, copy }: Props) {
  return (
    <section id="hero" className="folio-x folio-section folio-split folio-split-hero relative z-10">
      <style href="hero-center">{`
        @media (min-width: 1024px) {
          #hero.folio-split-hero {
            justify-content: center;
            grid-template-columns: minmax(0, 34rem) auto;
          }
          #hero.folio-split-hero .hero-art {
            width: auto;
            justify-content: center;
          }
        }
      `}</style>
      <HeroCopy name={name} voice={voice} copy={copy} />
      <div className="hero-art">
        <SiteMedia
          src={imageUrl}
          alt={copy.heroImageAlt}
          width={549}
          height={571}
          sizes="(min-width: 1024px) 54vw, 80vw"
          priority
          objectFit="contain"
          className="lg:h-[min(52.5rem,78vh)] lg:max-h-none"
        />
      </div>
    </section>
  );
}
