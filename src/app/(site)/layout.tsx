import { Cosmos } from "@/components/folio/Cosmos";
import { PageBack } from "@/components/layout/PageBack";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div id="top" className="relative flex min-h-full flex-1 flex-col bg-transparent text-[#f4ead4]">
      <Cosmos />
      <SiteHeader
        displayName={settings.displayName}
        websiteUrl={settings.websiteUrl}
        websiteLabel={settings.websiteLabel}
        copy={settings.copy}
      />
      <PageBack copy={settings.copy} />
      <main className="relative z-10">{children}</main>
      <SiteFooter
        displayName={settings.displayName}
        tagline={settings.tagline}
        websiteUrl={settings.websiteUrl}
        websiteLabel={settings.websiteLabel}
        socials={settings.socials}
        copy={settings.copy}
      />
    </div>
  );
}
