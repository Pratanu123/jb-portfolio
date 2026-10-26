import { HeroBanner } from "@/components/comic/HeroBanner";
import { MustReadsCarousel } from "@/components/comic/MustReadsCarousel";
import { AboutPlay } from "@/components/folio/AboutPlay";
import { CategoryIndex } from "@/components/folio/CategoryIndex";
import { FolioLinkRows } from "@/components/folio/FolioLinkRows";
import { getCategories, getPublishedWorks, getSettings } from "@/lib/data";

export default async function HomePage() {
  const [settings, featured, categories] = await Promise.all([
    getSettings(),
    getPublishedWorks({ featured: true }),
    getCategories(),
  ]);
  const { copy } = settings;
  const linkedin =
    settings.socials.find((social) => social.label.toLowerCase().includes("linkedin")) ??
    settings.socials[0];
  const aboutBlurb = settings.about.split(/\n\n+/)[0] ?? settings.bio;
  const heroVoice = copy.heroVoice.trim() || aboutBlurb;

  return (
    <div>
      <HeroBanner
        name={settings.displayName}
        voice={heroVoice}
        imageUrl={settings.heroImage}
        copy={copy}
      />

      <section className="folio-x folio-section relative z-10">
        <p className="font-display folio-display text-[#f4ead4]">{copy.mustReadsHeading}</p>
        <div className="mt-8 md:mt-10">
          {featured.length === 0 ? (
            <p className="folio-body">{copy.featuredEmpty}</p>
          ) : (
            <MustReadsCarousel
              moreLabel={copy.readMore}
              works={featured.map((work) => ({
                id: work.id,
                title: work.title,
                slug: work.slug,
                excerpt: work.excerpt,
                coverImageUrl: work.coverImageUrl,
                category: { name: work.category.name },
              }))}
            />
          )}
        </div>
      </section>

      <section className="folio-x folio-section relative z-10">
        <p className="font-display folio-display text-[#f4ead4]">{copy.categoriesHeading}</p>
        <CategoryIndex
          categories={categories.map((category) => ({
            id: category.id,
            slug: category.slug,
            name: category.name,
            mark: category.mark,
            markImageUrl: category.markImageUrl,
          }))}
        />
      </section>

      <section className="relative z-10">
        <AboutPlay
          title={copy.aboutHeading}
          text={settings.about}
          moreHref="/about"
          moreLabel={copy.readMore}
        >
          <FolioLinkRows
            items={[
              { href: settings.websiteUrl, label: settings.websiteLabel },
              ...(linkedin ? [{ href: linkedin.url, label: linkedin.label }] : []),
            ]}
          />
        </AboutPlay>
      </section>
    </div>
  );
}
