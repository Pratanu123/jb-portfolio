import { AboutPlay } from "@/components/folio/AboutPlay";
import { getSettings } from "@/lib/data";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const settings = await getSettings();

  return <AboutPlay title={settings.copy.aboutPageHeading} text={settings.copy.aboutPageText} />;
}
